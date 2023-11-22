import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Image, Button, Form } from 'react-bootstrap';
import { NavLink, Navigate, useNavigate, useParams } from 'react-router-dom';
import { QueryClient, useMutation, useQuery } from 'react-query';
import { getProductById } from '../../services/productService';
import { getProductProducerById } from '../../services/productProducerService';
import { getCategoryById } from '../../services/categoryService';

import './ProductDetail.css';

const ProductDetail = () => {

  const productParams = useParams();
  console.log("id del producto =" + productParams.idproduct)
  console.log("id de la categoria =" + productParams.idcategory)

  const user = JSON.parse(localStorage.getItem('user'));
  //const costumerId = user.costumer.id

  const navigate = useNavigate()

  const [UserRole, setUserRole] = useState('');

  useEffect(() => {
    const User = localStorage.getItem('user');
    if (User) {
      const UserObjet = JSON.parse(User)
      const UserRole = UserObjet.role.name
      UserRole === 'Cliente' ? setUserRole('Cliente') : setUserRole('No Cliente')
    } else {
      console.log("No habia usuario")
    }
  }, []);


  const [LocalShopping, setLocalShopping] = useState([]);
  const [productRequest, setProduct] = useState(null);
  const [categoryRequest, setCategory] = useState(null);

  const [AveragePrice, setAveragePrice] = useState();

  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    if (productRequest) {
      setCurrentImage(productRequest.image);
      console.log("img" + productRequest.image)

      productRequest.image.split(',').map((image, index) => (

        console.log("Imagen=" + image + ", index=" + index)

      ))



    }
  }, [productRequest]);

  const switchImage = (newImage) => {
    setCurrentImage(newImage);
  };

  useEffect(() => {

    async function MeCagoEnLasRestricciones() {

      await getProductById(productParams.idproduct, setProduct);
      await getCategoryById(productParams.idcategory, setCategory);
    }

    MeCagoEnLasRestricciones();

  }, []);

  useEffect(() => {

    async function MeCagoEnLasRestricciones() {

      let averageeprice = await getProductProducerById(productParams.idproduct);
      setAveragePrice(averageeprice)
      console.log("precio de compra promedio = " + averageeprice);
    }

    MeCagoEnLasRestricciones();

  }, []);

  useEffect(() => {
    const storedCar = localStorage.getItem('ShoppingCar');
    if (storedCar) {
      setLocalShopping(JSON.parse(storedCar));
      console.log("Carrito recuperado : " + storedCar)
    } else {
      console.log("No habia carrito")
    }
  }, []);


  const quantity = useRef();

  useEffect(() => {
    localStorage.setItem('ShoppingCar', JSON.stringify(LocalShopping));
    console.log(JSON.parse(localStorage.getItem('ShoppingCar')))
  }, [LocalShopping]);



  const toLogin = () => {
    navigate(`/login`)
  }


  const addToCart = () => {
    if (quantity.current.value !== '0') {
      const existingProductIndex = LocalShopping.findIndex(
        (product) => product.ProductId === productParams.idproduct
      );

      if (existingProductIndex !== -1) {

        const updatedLocalShopping = [...LocalShopping];
        updatedLocalShopping[existingProductIndex].Quantity += parseInt(
          quantity.current.value
        );
        setLocalShopping(updatedLocalShopping);
      } else {

        const costumerId = user.costumer.id
        const MargenGanancia = AveragePrice * (productRequest.margin / 100)
        const PrecioConMargen = AveragePrice + MargenGanancia
        const IVA = PrecioConMargen * (productRequest.iva / 100)
        const PrecioFinal = PrecioConMargen + IVA

        const newProductToCart = {
          CostumerId: costumerId,
          ProductId: productParams.idproduct,
          PrecioConMargen: PrecioConMargen,
          IVA: productRequest.iva,
          PrecioFinal: PrecioFinal,
          TotalVenta: PrecioFinal * parseInt(quantity.current.value),
          ProductName: productRequest.name,
          ProductDescription: productRequest.description,
          ProductUnit: productRequest.unit,
          ProductImage: productRequest.image,
          Quantity: parseInt(quantity.current.value),
        };
        setLocalShopping((prevProducts) => [...prevProducts, newProductToCart]);
      }

      swal({
        title: 'Agregado!',
        text: 'El producto se añadió correctamente',
        icon: 'success',
      });
      setTimeout(() => {
        history.back();
      }, 2000);
    }
  };

  return (
    <>
      {productRequest != null && categoryRequest != null ? (
        <Container className="bootdey">
          <div className="mt-5">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="cardDetails">
                    <Col md={12}>
                      <section className="panel">
                        <div className="panel-body">
                          <Row>
                            <Col md={6}>

                              <div className="ImgDetails">
                                <Image src={currentImage} alt={productRequest.name} fluid />
                              </div>

                              {productRequest.image != null ? (

                                <div className="ImgFluid">

                                  {
                                    productRequest.image.split(',').map((image) => (
                                      <a onClick={() => switchImage(image)}>
                                        <Image src={image} width={'100px'}
                                        />
                                      </a>

                                    ))}

                                </div>
                              ) : null}
                            </Col>
                            <Col md={6}>
                             
                              <h4 className="pro-d-title">
                                <a  href="#" className="TitleProducts">
                                  {productRequest.name}
                                </a>
                              </h4>
                              <br />
                              <form>
                                <p className="clasificacion">
                                  <input id="radio1" type="radio" name="estrellas" value="5" />
                                  <label className='Star' htmlFor="radio1">★</label>
                                  <input id="radio2" type="radio" name="estrellas" value="4" />
                                  <label className='Star' htmlFor="radio2">★</label>
                                  <input id="radio3" type="radio" name="estrellas" value="3" />
                                  <label className='Star' htmlFor="radio3">★</label>
                                  <input id="radio4" type="radio" name="estrellas" value="2" />
                                  <label className='Star' htmlFor="radio4">★</label>
                                  <input id="radio5" type="radio" name="estrellas" value="1" />
                                  <label className='Star' htmlFor="radio5">★</label>
                                </p>
                              </form>
                              <p>
                                {productRequest.description}
                              </p>
                              <div className="product_meta">
                                <span className="posted_in">
                                  <strong>Categoría:</strong> <a className='CategoryName' rel="tag" href="#">
                                    {categoryRequest.name}
                                  </a>
                                  <br />
                                </span>
                                <span className="tagged_as">
                                  <strong>Unidad comercial:</strong> <a className='ProductName' rel="tag" href="#">
                                    {productRequest.unit}
                                  </a>
                                </span>
                              </div>
                              {/*                               
                              <div className="m-bot15">
                                <strong>Precio de referencia :</strong>{' '}
                                <span className="pro-price"> ₡300 </span>
                              </div> */}
                              <br />
                              <div className="form-group">
                                <label >Ingrese la cantidad</label>
                                <Form.Control
                                  type="number"
                                  placeholder="1"
                                  className="form-control quantity"
                                  ref={quantity}
                                  min="1"
                                />
                              </div>
                              <p>
                                <br />
                                {UserRole === 'Cliente' ? (
                                  <Button
                                    variant="danger"
                                    className="btn btn-round"
                                    type="button"
                                    onClick={addToCart}
                                  >

                                    <i className="fa fa-shopping-cart"></i> Agregar al carrito
                                  </Button>
                                ) : (

                                  <Button
                                    variant="danger"
                                    className="btn btn-round"
                                    type="button"
                                    onClick={toLogin}
                                  >
                                    <i className="fa fa-shopping-cart"></i> Inicie sesión para comprar
                                  </Button>
                                )}
                              </p>
                            </Col>
                          </Row>
                        </div>
                      </section>
                    </Col>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      ) : (
        'Espere'
      )}
    </>
  );
}
export default ProductDetail;