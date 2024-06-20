import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Image, Button, Form, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById } from '../../services/productService';
import { getCategoryById } from '../../services/categoryService';
import { getProductCostumerById } from '../../services/productCostumerService.js';
import { getSingleProductCostumerById } from '../../services/productCostumerService.js';
import { getVolumeDiscount } from '../../services/volumeDiscount.js';
import { getStarsAverage } from '../../services/reviewService';
import { NumbersOnly } from '../../utils/validateFields.js'


import Select from 'react-select';

import Listreview from './listReview';

import './ProductDetail.css';
import { getUserLocalStorage } from '../../utils/getLocalStorageUser.js';

const ProductDetail = () => {

  const productParams = useParams();
  const user = getUserLocalStorage()
  const navigate = useNavigate()

  const [UserRole, setUserRole] = useState('');
  const [StarsAverage, setStarsAverage] = useState(0);

  useEffect(() => {
    const User = getUserLocalStorage()
    if (User) {
      const UserObjet = getUserLocalStorage()
      const UserRole = UserObjet.role.name
      UserRole === 'Cliente' ? setUserRole('Cliente') : setUserRole('No Cliente')
    } else {
    }
  }, []);

  const [LocalShopping, setLocalShopping] = useState([]);
  const [productRequest, setProduct] = useState(null);
  const [categoryRequest, setCategory] = useState(null);
  const [cotizacionRequest, setCotizacionRequest] = useState([]);
  const [cotizacionOptions, setCotizacionOptions] = useState([]);

  const [MyCotizacion, setMyCotizacion] = useState([]);
  const [FixedCotizacion, setFixedCotizacion] = useState(null);
  const [Volumes, setVolumes] = useState(null);

  const [currentImage, setCurrentImage] = useState(null);

  const setCotizacion = async (id) => {
    await getSingleProductCostumerById(id, setMyCotizacion);
  }

  useEffect(() => {
    async function fetchCotizacion() {
      if (MyCotizacion != null && productRequest != null) {

        const MargenGanancia = MyCotizacion.purchasePrice * (MyCotizacion.margin / 100)
        const PrecioConMargen = MyCotizacion.purchasePrice + MargenGanancia
        const IVA = PrecioConMargen * (productRequest.iva / 100)
        const finalPrice = PrecioConMargen + IVA

        const FixedCotizacion = {
          cotizacionId: MyCotizacion.id,
          priceWithMargin: PrecioConMargen,
          iva: productRequest.iva,
          unit: MyCotizacion.unit,
          finalPrice: finalPrice.toFixed(0)
        }
        setFixedCotizacion(FixedCotizacion)
        getVolumeDiscount(MyCotizacion.id, setVolumes)

      }
    }
    fetchCotizacion();
  }, [MyCotizacion]);

  useEffect(() => {
    if (productRequest) {
      setCurrentImage(productRequest.image);

    }
  }, [productRequest]);

  const switchImage = (newImage) => {
    setCurrentImage(newImage);
  };

  useEffect(() => {
    async function MeCagoEnLasRestricciones() {
      await getProductById(productParams.idproduct, setProduct);
      await getCategoryById(productParams.idcategory, setCategory);
      await getStarsAverage(productParams.idproduct, setStarsAverage);
      await getProductCostumerById(productParams.idproduct, user.costumer.id, setCotizacionRequest);
    }
    MeCagoEnLasRestricciones();
  }, []);

  useEffect(() => {
    if (cotizacionRequest && cotizacionRequest.length > 0) {
      FillSelect();
    }
  }, [cotizacionRequest]);

  const FillSelect = async () => {
    if (cotizacionRequest) {
      let cotizacionOptions = []
      for (const cotizacion of cotizacionRequest) {
        let cotizacionOption = {
          value: cotizacion.id,
          label: cotizacion.description + ' - ' + cotizacion.unit,
        }
        cotizacionOptions.push(cotizacionOption)
      } setCotizacionOptions(cotizacionOptions)
    }
  };

  useEffect(() => {
    const storedCar = localStorage.getItem('ShoppingCar');
    if (storedCar) {
      setLocalShopping(JSON.parse(storedCar));

    } else {

    }
  }, []);


  const quantity = useRef();

  useEffect(() => {
    localStorage.setItem('ShoppingCar', JSON.stringify(LocalShopping));

  }, [LocalShopping]);

  const toLogin = () => {
    navigate(`/login`)
  }

  const addToCart = () => {

    if (quantity.current.value !== '0') {

      if (FixedCotizacion != null) {

        const existingCotizacion = LocalShopping.findIndex(
          (product) => product.CotizacionId === FixedCotizacion.cotizacionId)

        if (existingCotizacion !== -1) {

          const updatedLocalShopping = [...LocalShopping];
          updatedLocalShopping[existingCotizacion].Quantity += parseInt(
            quantity.current.value
          );
          setLocalShopping(updatedLocalShopping);

        } else {

          const newProductToCart = {
            CotizacionId: FixedCotizacion.cotizacionId,
            CostumerId: user.costumer.id,
            ProductId: productParams.idproduct,
            PrecioInicial: FixedCotizacion.priceWithMargin,
            PrecioConMargen: FixedCotizacion.priceWithMargin,
            iva: FixedCotizacion.iva,
            PrecioFinal: FixedCotizacion.finalPrice,
            SubTotal: FixedCotizacion.priceWithMargin * parseInt(quantity.current.value),
            TotalVenta: (FixedCotizacion.finalPrice * parseInt(quantity.current.value)),
            ProductName: productRequest.name,
            ProductDescription: productRequest.description,
            ProductUnit: FixedCotizacion.unit,
            ProductImage: productRequest.image,
            Quantity: parseInt(quantity.current.value),
            Volumes: Volumes,
            Stockable: productRequest.stockable,
            Stock: productRequest.stock
          };
          setLocalShopping((prevProducts) => [...prevProducts, newProductToCart]);
        }
      } else {

        const existingProduct = LocalShopping.findIndex(
          (product) => product.ProductId === productParams.idproduct && product.CotizacionId === 0)

        if (existingProduct !== -1) {

          const updatedLocalShopping = [...LocalShopping];
          updatedLocalShopping[existingProduct].Quantity += parseInt(
            quantity.current.value
          );
          setLocalShopping(updatedLocalShopping);
        } else {

          const newProductToCart = {
            CotizacionId: 0,
            CostumerId: user.costumer.id,
            ProductId: productParams.idproduct,
            PrecioInicial: 0,
            ProductName: productRequest.name,
            ProductDescription: productRequest.description,
            PrecioConMargen: 0,
            iva: productRequest.iva,
            TotalVenta: 0,
            SubTotal: 0,
            ProductUnit: productRequest.unit,
            ProductImage: productRequest.image,
            Quantity: parseInt(quantity.current.value),
            Stockable: productRequest.stockable,
            Stock: productRequest.stock
          };


          setLocalShopping((prevProducts) => [...prevProducts, newProductToCart]);
        }
      }

      swal({
        title: 'Agregado!',
        text: 'El producto se añadió correctamente',
        icon: 'success',
      }).then(setTimeout(() => {
        window.location.reload()
      }, 2000));
    }
  };

  return (
    <>
      {productRequest != null && categoryRequest != null ? (
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

                      <Row>
                        <h4 className="pro-d-title text-center" >
                          <a className="TitleProducts" style={{ marginRight: '5%' }}>
                            {productRequest.name}
                          </a>
                        </h4>

                      </Row>

                      <Row>
                        <h4 className="pro-d-title text-center" >
                          <br />
                          {Array.from({ length: StarsAverage }, () => (
                            <span className="Rating">
                              ★
                            </span>
                          ))}
                        </h4>
                      </Row>

                      <br />

                      <p className='Josefin'>
                        {productRequest.description}
                      </p>

                      <div className="product_meta text-center">
                        <span className="posted_in Playfair">
                          <strong>Categoría: </strong> <a className='CategoryName' rel="tag" href="#">
                            {categoryRequest.name}
                          </a>
                          <br />

                        </span>

                        <span className="tagged_as text-center Playfair">
                          <strong>Unidad: </strong> <a className='ProductName' rel="tag" href="#">
                            {productRequest.unit}
                          </a>
                        </span>
                      </div>

                      <p>
                        <br />
                        {UserRole === 'Cliente' ? (
                          <>

                            {cotizacionRequest != null && cotizacionRequest.length > 0 ? (
                              <>
                                <Col>
                                  <span className="tagged_as Josefin">
                                    <strong >Mis cotizaciones</strong> <a className='ProductName' rel="tag" href="#">
                                    </a>
                                  </span>
                                  <Select
                                    options={cotizacionOptions}
                                    placeholder='Seleccione'
                                    onChange={(selectedOption) => setCotizacion(selectedOption.value)}
                                    className="small-input" />
                                  <br />
                                </Col>

                                {FixedCotizacion != null ? (
                                  <>
                                    <Col>
                                      <span className="posted_in Josefin">
                                        <strong>Precio unitario: ₡{FixedCotizacion.finalPrice}</strong> <a className='CategoryName' rel="tag" href="#">
                                        </a>
                                      </span>
                                      <br />
                                    </Col>
                                  </>
                                ) : (""
                                )}

                              </>
                            ) : (
                              <>
                                <span className="posted_in Josefin">
                                  <strong>No tienes cotizaciones</strong> <a className='CategoryName' rel="tag" href="#">
                                  </a>
                                </span>
                                <br />
                              </>
                            )}

                            {productRequest.stockable == true ? (

                              productRequest.stock >= 1
                                ? (
                                  <>
                                    <br />
                                    <div className="form-group text-center" >
                                      <div className="oval-button text-center">
                                        <Row className="text-center">
                                          <Col xs={4} className="d-flex">
                                            <input
                                              type="number"
                                              className="quantity-input"
                                              min="1"
                                              defaultValue={1}
                                              ref={quantity}
                                              max={productRequest.stock}
                                              onKeyDown={NumbersOnly} />

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

                                  <><br /><p className="infoReview Josefin">Sin Existencias</p></>
                                )

                            ) : (
                              <>
                                <div className="form-group ">
                                  <br />

                                  <Row>
                                    <div className="oval-button text-center">
                                      <Row className="text-center">
                                        <Col xs={4} className="d-flex">
                                          <input
                                            type="number"
                                            className="quantity-input"
                                            min="1"
                                            defaultValue={1}
                                            ref={quantity}
                                            onKeyDown={NumbersOnly}
                                          />
                                        </Col>
                                        <Col xs={8}>
                                          <Button className="add-to-cart-btn" onClick={addToCart}>
                                            Agregar al carro
                                          </Button>
                                        </Col>
                                      </Row>
                                    </div>
                                  </Row>
                                </div>

                                <br />
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
                            <i className="fa fa-shopping-cart"></i>Inicie sesión para comprar
                          </Button>
                        )}

                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          </Row>
          {productParams != null ? (

            <Listreview productid={productParams.idproduct} />


          ) : (
            'No hay reviews'
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