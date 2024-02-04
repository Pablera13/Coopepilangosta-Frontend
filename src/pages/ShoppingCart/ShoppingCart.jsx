import React, { useState, useEffect, useRef } from 'react';
import { QueryClient, useMutation, useQuery } from "react-query";
import swal from 'sweetalert';
import { format } from 'date-fns';
import { NavLink, Navigate, useNavigate, useParams } from 'react-router-dom';
import { createCostumerOrder } from '../../services/costumerorderService';
import { createSale } from '../../services/saleService';
import { Form, Row, Col, Button, Container, InputGroup, Collapse } from 'react-bootstrap'
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
      console.log("Carrito recuperado: " + storedCar);

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
    console.log(JSON.parse(localStorage.getItem('ShoppingCar')))
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
        navigate(`/userProfile`)
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
      Address: `${Address}, ${District}, ${Canton}, ${Province}`,
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
      {/* {localStorage.getItem('ShoppingCar') != null ? ( */}
      {LocalShopping.length >= 1 && localStorage.getItem('ShoppingCar') != null ? (
        <>
          <div className="container">
            <div className="row">
              <div className="card">
                <div className="warning">
                  Los precios indicados en este catálogo son referenciales y
                  pueden estar sujetos a variaciones en el precio final.
                  Por favor consulte con nuestro equipo para conocer precios especiales y descuentos disponibles
                </div>
                <br></br>
                <div >
                  <table className="table table-borderless table-shopping-cart">
                    <br></br>

                    <thead>
                      <tr>
                        <th>Imagen</th>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                        <th>Unidad</th>
                        <th>Precio Unitario</th>
                        <th>Subtotal</th>
                        <th>IVA</th>
                        <th>Final</th>
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
                              // style={{width:'50%', textAlign:'center'}}
                              defaultValue={Sale.Quantity}
                              type="number"
                              min="1"
                              onChange={(e) => {

                                const updatedShopping = [...LocalShopping];
                                updatedShopping[index].Quantity = parseInt(e.target.value);

                                if (Sale.CotizacionId != 0) {

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
                                  setSubTotal(newSubTotal);

                                }

                                setLocalShopping(updatedShopping);
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
                    </tbody>
                  </table>
                </div>
                </div>
</div>
</div>

          <div className="container">
          <div className="card">
        <div className="card-body">
            <div className="row">
                <div className="col-md-6">
                    <h5 className="card-title">Dirección de Envío</h5>
                    <div className="row">
                        <div className="col-md-4">
                            <label htmlFor="provincia">Provincia</label>
                            <input type="text" className="form-control" id="provincia" defaultValue={user.costumer.province} ref={Province}/>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="provincia">Cantón</label>
                            <input type="text" className="form-control" id="Cantón" defaultValue={user.costumer.canton} ref={Canton}/>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="provincia">Distrito</label>
                            <input type="text" className="form-control" id="Distrito" defaultValue={user.costumer.district} ref={District}/>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-12">
                            <label htmlFor="provincia">Dirección de Envío</label>
                            <input type="text" className="form-control" id="direccion" defaultValue={user.costumer.address} ref={Address}/>
                        </div>
                        <br></br>
                        <br></br>
                        <br></br>

                        <div>
                        <a href="#" className="btn btn-primary btn-main btn-square btn-block" data-abc="true" onClick={saveProducerOrder}>Realizar pedido</a>
                        <NavLink to={`/home`} className="btn btn-success btn-main btn-square btn-block mt-2">Seguir comprando</NavLink>
                    </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <h5 className="card-title">Detalle de Envío</h5>
                    <br />

                    <textarea className="form-control" rows="5" placeholder="Ingrese aquí el detalle del envío..." ref={Detail}></textarea>
                </div>
            </div>
        </div>


</div>
          </div>

        </>
      ) : (
        <div className="empty-cart-message">
          <p>No has realizado compras aún</p>
          <NavLink to={`/home`} className="btn btn-primary">
            Ir a comprar
          </NavLink>
        </div>
      )}
    </>
  );
};

export default ShoppingCart;
