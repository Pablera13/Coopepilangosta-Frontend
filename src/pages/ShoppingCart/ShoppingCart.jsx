import React, { useState, useEffect, useRef } from 'react';
import { QueryClient, useMutation, useQuery } from "react-query";
import swal from 'sweetalert';
import { format } from 'date-fns';
import { NavLink, Navigate, useNavigate, useParams } from 'react-router-dom';
import { createCostumerOrder } from '../../services/costumerorderService';
import { createSale } from '../../services/saleService';
import { Form, Row, Col, Button, Container, InputGroup, Collapse, Table } from 'react-bootstrap'
import Select from 'react-select'

import './ShoppingCart.css'

const ShoppingCart = () => {

  const user = JSON.parse(localStorage.getItem('user'));
  const [LocalShopping, setLocalShopping] = useState([]);
  const queryClient = new QueryClient();

  let storedCar;
  const navigate = useNavigate()

  const [TotalOrder, setTotalOrder] = useState();
  const [SubTotal, setSubTotal] = useState();
  const Detail = useRef()

  const Province = useRef()
  const Canton = useRef()
  const District = useRef()
  const Address = useRef()


  useEffect(() => {
    storedCar = localStorage.getItem('ShoppingCar');
    if (storedCar) {
      const parsestoredCar = JSON.parse(storedCar);
      setLocalShopping(parsestoredCar);
      //console.log("Carrito recuperado: " + storedCar);

      async function xd() {
        let newTotal = 0;
        let newSubTotal = 0;
        parsestoredCar.forEach((sale) => {
          newTotal += sale.TotalVenta;
          newSubTotal += sale.SubTotal;
        });
        setTotalOrder(newTotal);
        setSubTotal(newSubTotal);

      }

      xd();
    } else {
      console.log("No había carrito");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ShoppingCar', JSON.stringify(LocalShopping));
    //console.log(JSON.parse(localStorage.getItem('ShoppingCar')))
  }, [LocalShopping]);


  const mutationCostumerOrder = useMutation("costumerorder ", createCostumerOrder, {
    onSettled: () => queryClient.invalidateQueries("costumerorder"),
    mutationKey: "producerorder",
    onSuccess: () => {
      swal({
        title: 'Agregado!',
        text: `El pedido ha sido agregado`,
        icon: "success"
      });

      setTimeout(() => {
        // history.back();
        navigate(`/myCustomerOrders`)
      }, 2000);
    },
  })


  const mutationSale = useMutation("sale ", createSale, {
    onSettled: () => queryClient.invalidateQueries("sales"),
    mutationKey: "sale"
  })

  const DeleteProduct = (ProductId) => {
    const updatedCart = LocalShopping.filter(sale => sale.ProductId !== ProductId);
    setLocalShopping(updatedCart);
  };
  const DeleteCotizacion = (CotizacionId) => {
    const updatedCart = LocalShopping.filter(sale => sale.CotizacionId !== CotizacionId);
    setLocalShopping(updatedCart);
  };

  const saveProducerOrder = async () => {

    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd');

    let OrdersSummed = 0;
    let CostumerId;

    LocalShopping.map((sale) => {

      OrdersSummed = OrdersSummed + sale.TotalVenta
      CostumerId = sale.CostumerId
    })

    let newCostumerOrder = {
      CostumerId: CostumerId,
      Total: OrdersSummed,
      ConfirmedDate: formattedDate,
      PaidDate: "0001-01-01T00:00:00",
      DeliveredDate: "0001-01-01T00:00:00",
      Detail: Detail.current.value,
      Stage: "Sin confirmar",
      Address: `${Address.current.value}, ${District.current.value}, ${Canton.current.value}, ${Province.current.value}`,
    };

    const costumerOrder = await mutationCostumerOrder.mutateAsync(newCostumerOrder).finally(data => data)

    LocalShopping.map((sale) => {
      let newSale = {
        ProductId: sale.ProductId,
        Quantity: sale.Quantity,
        PurchaseTotal: sale.TotalVenta,
        CostumerOrderId: costumerOrder.id,
        UnitPrice: sale.PrecioConMargen,
        Unit: sale.ProductUnit,
      };

      mutationSale.mutateAsync(newSale);
    })

    setLocalShopping([])
    localStorage.setItem('ShoppingCar', JSON.stringify(LocalShopping));

  }

  return (
    <>
      {LocalShopping.length >= 1 && localStorage.getItem('ShoppingCar') != null ? (
        <>
          <Container>
            <Row className="mb-3">

              <div className="card">

                <div className="warning">
                  Los precios indicados en este catálogo son referenciales y
                  pueden estar sujetos a variaciones en el precio final.
                  Por favor consulte con nuestro equipo para conocer precios especiales y descuentos disponibles
                </div>

                <br></br>
                <div >

                  <Col xs={12} md={12} lg={12}>
                    <Row>
                      <Table responsive className="table table-borderless table-shopping-cart">
                        <br></br>

                        <thead>
                          <tr>
                            <th>Imagen</th>
                            <th>Descripción</th>
                            <th style={{ width: '10%' }}>Cantidad</th>
                            <th>Unidad</th>
                            <th>Precio</th>
                            <th>Subtotal</th>
                            <th>IVA</th>
                            <th>Final</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>

                        <tbody>
                          {LocalShopping.map((Sale, index) => (
                            <tr key={Sale.ProductId}>

                              <td>
                                <img src={Sale.ProductImage} className="img-sm border" alt={Sale.ProductName} />
                              </td>
                              <td>{Sale.ProductName}</td>

                              <td>
                                <input
                                  className="form-control"
                                  style={{ textAlign: 'center' }}
                                  defaultValue={Sale.Quantity}
                                  type="number"
                                  min="1"
                                  onChange={(e) => {

                                    const updatedShopping = [...LocalShopping];
                                    updatedShopping[index].Quantity = parseInt(e.target.value);

                                    if (Sale.CotizacionId != 0) {

                                      var volumesArray = [];
                                      volumesArray = Sale.Volumes;

                                      const initialVolume = {
                                        id: 0,
                                        price: updatedShopping[index].PrecioInicial,
                                        volume: 1,
                                        productCostumerId: 1,
                                        productCostumer: null
                                      }

                                      volumesArray.push(initialVolume)

                                      function compararPorVolume(a, b) {
                                        return a.volume - b.volume;
                                      }
                                      volumesArray.sort(compararPorVolume);

                                      // console.log("volumes ordered" + JSON.stringify(volumes))

                                      for (let object of volumesArray) {

                                        if (e.target.value >= object.volume) {
                                          updatedShopping[index].PrecioConMargen = object.price
                                        }

                                        updatedShopping[index].TotalVenta = updatedShopping[index].PrecioFinal * parseInt(e.target.value);
                                        updatedShopping[index].SubTotal = updatedShopping[index].PrecioConMargen * parseInt(e.target.value);

                                        let newTotal = 0;
                                        updatedShopping.map((sale) => (
                                          newTotal = newTotal + sale.TotalVenta
                                        ))
                                        setTotalOrder(newTotal);

                                        let newSubTotal = 0;
                                        updatedShopping.map((sale) => (
                                          newSubTotal = newSubTotal + sale.SubTotal
                                        ))
                                        setSubTotal(newSubTotal.toFixed(0));

                                      }

                                      setLocalShopping(updatedShopping);
                                    }
                                  }}
                                />
                              </td>
                              <td>{Sale.ProductUnit}</td>

                              <td>{Sale.PrecioConMargen == 0 ? 'Por cotizar' : '₡' + Sale.PrecioConMargen}</td>

                              <td>{Sale.SubTotal == 0 ? 'Por cotizar' : '₡' + Sale.SubTotal}</td>
                              <td>{Sale.iva}%</td>
                              <td>{Sale.TotalVenta == 0 ? 'Por cotizar' : '₡' + Sale.TotalVenta}</td>



                              <td>
                                <button variant='danger' className="btn btn-light" size='sm'
                                  onClick={() => {
                                    Sale.CotizacionId != 0 ?
                                      DeleteCotizacion(Sale.CotizacionId)
                                      :
                                      DeleteProduct(Sale.ProductId)
                                  }}
                                >Eliminar</button>
                              </td>

                            </tr>
                          ))}

                          <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><b>SubTotal</b></td>
                            <td>{SubTotal == 0 ? 'Por cotizar' : '₡' + SubTotal}</td>
                          </tr>

                          <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><b>Total</b></td>
                            <td>{TotalOrder == 0 ? 'Por cotizar' : '₡' + TotalOrder}</td>
                          </tr>

                          <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>

                        </tbody>
                      </Table>
                    </Row>
                  </Col>

                </div>
              </div>

            </Row>
          </Container>

          <div className="container">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="card-title">Dirección de Envío</h5>
                    <div className="row">
                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label>Provincia</Form.Label>
                          <Form.Control type="text" defaultValue={user.costumer.province} ref={Province} />
                        </Form.Group>
                      </div>
                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label>Cantón</Form.Label>
                          <Form.Control type="text" defaultValue={user.costumer.canton} ref={Canton} />
                        </Form.Group>
                      </div>
                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label>Distrito</Form.Label>
                          <Form.Control type="text" defaultValue={user.costumer.district} ref={District} />
                        </Form.Group>
                      </div>
                    </div>
                    <Form.Group>
                      <Form.Label>Dirección de Envío</Form.Label>
                      <Form.Control type="text" defaultValue={user.costumer.address} ref={Address} />
                    </Form.Group>

                  </div>
                  <div className="col-md-6">
                    <h5 className="card-title">Detalle de Envío</h5>
                    <Form.Group>
                      <Form.Label></Form.Label>
                      <Form.Control as="textarea" placeholder='Ingrese el detalle del envío' rows={5} ref={Detail} />
                    </Form.Group>
                  </div>

                </div>
                
              </div>
              <Row>
                  <Col xs={12} lg={12}>
                    <Button variant="primary" className="BtnTrash" onClick={saveProducerOrder}>Realizar pedido</Button>
                    
                  </Col>
                  <Col lg={12}>
                  <NavLink to={`/home`} className="BtnUpdate">Seguir comprando</NavLink>

                  </Col>
                </Row>
                <Row>

                </Row>
            </div>
          </div>

        </>
      ) : (
        <div className="empty-cart-message">
          <p>No has realizado compras aún</p>
          <Button className='BtnBrown'
                                    onClick={() => navigate(`/home`)}>
Ir a comprar                                   </Button>
        </div>
      )}
    </>
  );
};

export default ShoppingCart;