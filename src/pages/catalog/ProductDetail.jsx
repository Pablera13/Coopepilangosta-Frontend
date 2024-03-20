import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Image, Button, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import swal from 'sweetalert';
import { getProductById } from '../../services/productService';
import { getCategoryById } from '../../services/categoryService';
import { getProductCostumerById, getSingleProductCostumerById } from '../../services/productCostumerService';
import { getVolumeDiscount } from '../../services/volumeDiscount';
import { getStarsAverage } from '../../services/reviewService';
import ListReview from './listReview';
import './ProductDetail.css';

const ProductDetail = () => {
  const { idproduct, idcategory } = useParams();
  
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');
  const [starsAverage, setStarsAverage] = useState(0);

  const [productRequest, setProduct] = useState(null);
  const [categoryRequest, setCategory] = useState(null);
  const [cotizacionRequest, setCotizacionRequest] = useState([]);
  const [cotizacionOptions, setCotizacionOptions] = useState([]);
  const [myCotizacion, setMyCotizacion] = useState([]);
  const [fixedCotizacion, setFixedCotizacion] = useState(null);
  const [volumes, setVolumes] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [localShopping, setLocalShopping] = useState([]);
  const quantity = useRef();

  useEffect(() => {
    const fetchData = async () => {
      await getProductById(idproduct, setProduct);
      await getCategoryById(idcategory, setCategory);
      await getStarsAverage(idproduct, setStarsAverage);
      await getProductCostumerById(idproduct, user.costumer.id, setCotizacionRequest);
    };
    fetchData();
  }, [idcategory, idproduct, user.costumer.id]);

  useEffect(() => {
    const fetchCotizacion = async () => {
      if (myCotizacion && productRequest) {
        const marginGanancia = myCotizacion.purchasePrice * (myCotizacion.margin / 100);
        const precioConMargen = myCotizacion.purchasePrice + marginGanancia;
        const iva = precioConMargen * (productRequest.iva / 100);
        const finalPrice = precioConMargen + iva;
        const fixedCotizacion = {
          cotizacionId: myCotizacion.id,
          priceWithMargin: precioConMargen,
          iva: productRequest.iva,
          unit: myCotizacion.unit,
          finalPrice: finalPrice.toFixed(0)
        };
        setFixedCotizacion(fixedCotizacion);
        getVolumeDiscount(myCotizacion.id, setVolumes);
      }
    };
    fetchCotizacion();
  }, [myCotizacion, productRequest]);

  useEffect(() => {
    const storedCar = JSON.parse(localStorage.getItem('ShoppingCar'));
    if (storedCar) {
      setLocalShopping(storedCar);
    }
  }, []);

  useEffect(() => {
    const User = localStorage.getItem('user');
    if (User) {
      const UserObjet = JSON.parse(User);
      const UserRole = UserObjet.role.name;
      UserRole === 'Cliente' ? setUserRole('Cliente') : setUserRole('No Cliente');
    }
  }, []);

  useEffect(() => {
    if (productRequest && productRequest.image) {
      setCurrentImage(productRequest.image);
    }
  }, [productRequest]);


  useEffect(() => {
    localStorage.setItem('ShoppingCar', JSON.stringify(localShopping));
  }, [localShopping]);

  const switchImage = (newImage) => {
    setCurrentImage(newImage);
  };

  const toLogin = () => {
    navigate('/login');
  };

  const addToCart = () => {
    if (quantity.current.value !== '0') {
      if (fixedCotizacion) {
        const existingCotizacion = localShopping.findIndex((product) => product.cotizacionId === fixedCotizacion.cotizacionId);
        if (existingCotizacion !== -1) {
          const updatedLocalShopping = [...localShopping];
          updatedLocalShopping[existingCotizacion].quantity += parseInt(quantity.current.value, 10);
          setLocalShopping(updatedLocalShopping);
        } else {
          const newProductToCart = {
            cotizacionId: fixedCotizacion.cotizacionId,
            costumerId: user.costumer.id,
            productId: idproduct,
            precioInicial: fixedCotizacion.priceWithMargin,
            precioConMargen: fixedCotizacion.priceWithMargin,
            iva: fixedCotizacion.iva,
            precioFinal: fixedCotizacion.finalPrice,
            subTotal: fixedCotizacion.priceWithMargin * parseInt(quantity.current.value, 10),
            totalVenta: fixedCotizacion.finalPrice * parseInt(quantity.current.value, 10),
            productName: productRequest.name,
            productDescription: productRequest.description,
            productUnit: fixedCotizacion.unit,
            productImage: productRequest.image,
            quantity: parseInt(quantity.current.value, 10),
            volumes: volumes,
            stockable: productRequest.stockable,
            stock: productRequest.stock
          };
          setLocalShopping((prevProducts) => [...prevProducts, newProductToCart]);
        }
      } else {
        const existingProduct = localShopping.findIndex((product) => product.productId === idproduct && product.cotizacionId === 0);
        if (existingProduct !== -1) {
          const updatedLocalShopping = [...localShopping];
          updatedLocalShopping[existingProduct].quantity += parseInt(quantity.current.value, 10);
          setLocalShopping(updatedLocalShopping);
        } else {
          const newProductoParaCarrito = {
            cotizacionId: 0,
            costumerId: user.costumer.id,
            productId: idproduct,
            precioInicial: 0,
            productName: productRequest.name,
            productDescription: productRequest.description,
            precioConMargen: 0,
            iva: productRequest.iva,
            totalVenta: 0,
            subTotal: 0,
            productUnit: productRequest.unit,
            productImage: productRequest.image,
            quantity: parseInt(quantity.current.value, 10),
            stockable: productRequest.stockable,
            stock: productRequest.stock
          };
          setLocalShopping((prevProducts) => [...prevProducts, newProductoParaCarrito]);
        }
        swal({
          title: 'Agregado!',
          text: 'El producto se añadió correctamente',
          icon: 'success',
        });
        setTimeout(() => {
          window.history.back();
        }, 2000);
      }
    }
  };

  return (
    <>
      {productRequest && categoryRequest ? (
        <Container className="bootdey">
          <Row>
            <div className="col-lg-12">
              <Card className="cardDetails" style={{ width: '100%', height: 'auto' }}>
                <Card.Body>
                  <Row>
                    <Col xs={9} md={6} >
                      <div className="ImgDetails">
                        <Image src={currentImage} alt={productRequest.name} fluid />
                      </div>
                      {productRequest.image && (
                        <div className="ImgFluid">
                          {productRequest.image.split(',').map((image) => (
                            <a onClick={() => switchImage(image)} key={image}>
                              <Image src={image} width={'100px'} />
                            </a>
                          ))}
                        </div>
                      )}
                    </Col>
                    <Col md={6}>
                      <h4 className="pro-d-title" >
                        <a className="TitleProducts" style={{ marginRight: '5%' }}>
                          {productRequest.name}
                        </a>
                        {Array.from({ length: starsAverage }, () => (
                          <span className="Rating">
                            ★
                          </span>
                        ))}
                      </h4>
                      <br />
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
                          <strong>Unidad:</strong> <a className='ProductName' rel="tag" href="#">
                            {productRequest.unit}
                          </a>
                        </span>
                      </div>
                      <p>
                        <br />
                        {userRole === 'Cliente' ? (
                          <>
                            {cotizacionRequest && cotizacionRequest.length > 0 ? (
                              <>
                                <Col>
                                  <span className="tagged_as">
                                    <strong>Mis cotizaciones</strong> <a className='ProductName' rel="tag" href="#">
                                    </a>
                                  </span>
                                  <Select
                                    options={cotizacionOptions}
                                    placeholder='Seleccione'
                                    onChange={(selectedOption) => setMyCotizacion(selectedOption.value)}
                                    className="small-input" />
                                  <br />
                                </Col>
                                {fixedCotizacion && (
                                  <>
                                    <Col>
                                      <span className="posted_in">
                                        <strong>Precio unitario: ₡{fixedCotizacion.finalPrice}</strong> <a className='CategoryName' rel="tag" href="#">
                                        </a>
                                      </span>
                                      <br />
                                    </Col>
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                <span className="posted_in">
                                  <strong>Consulta por nuestras cotizaciones</strong> <a className='CategoryName' rel="tag" href="#">
                                  </a>
                                </span>
                                <br />
                              </>
                            )}
                            {productRequest.stockable === true ? (
                              productRequest.stock >= 1 ? (
                                <>
                                  <br />
                                  <div className="form-group text-center" >
                                    <div className="oval-button text-center" style={{ marginLeft: '22%' }}>
                                      <Row>
                                        <Col xs={4} className="d-flex">
                                          <input
                                            type="number"
                                            className="quantity-input"
                                            min="1"
                                            defaultValue={1}
                                            ref={quantity}
                                            max={productRequest.stock} />
                                        </Col>
                                        <Col xs={8}>
                                          <Button className="add-to-cart-btn" onClick={addToCart}>
                                            Agregar al carro
                                          </Button>
                                        </Col>
                                      </Row>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <br />
                                  <p className="verify warning">Sin Existencias</p>
                                </>
                              )
                            ) : (
                              <>
                                <div className="form-group ">
                                  <br />
                                  <Row>
                                    <div className="oval-button text-center" style={{ marginLeft: '22%' }}>
                                      <Row>
                                        <Col xs={4} className="d-flex">
                                          <input
                                            type="number"
                                            className="quantity-input"
                                            min="1"
                                            defaultValue={1}
                                            ref={quantity} />
                                        </Col>
                                        <Col xs={8}>
                                          <Button className="add-to-cart-btn" onClick={addToCart}>
                                            Agregar al carro
                                          </Button>
                                        </Col>
                                      </Row>
                                    </div>
                                  </Row>
                                  <br />
                                  </div>
                                </>
                              )}
                          </>
                        ) : (
                          <Button
                            variant="danger"
                            className="BtnStar"
                            type="button"
                            onClick={toLogin}
                          >
                            <i className="fa fa-shopping-cart"></i> Inicie sesión para comprar
                          </Button>
                        )}
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          </Row>
          {idproduct && (
            <ListReview productid={idproduct} />
          )}
        </Container>
      ) : (
        <div className="Loading">
          <ul>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
      )}
    </>
  );
}

export default ProductDetail;

