import React, { useState, useEffect, useRef } from 'react';
import { QueryClient, useMutation, useQuery } from "react-query";
import swal from 'sweetalert';
import { format } from 'date-fns';
import { NavLink, Navigate, useNavigate, useParams  } from 'react-router-dom';


import { createCostumerOrder } from '../../services/costumerorderService';
import { createSale } from '../../services/saleService';

import './ShoppingCart.css'


const ShoppingCart = () => {

  const [LocalShopping, setLocalShopping] = useState([]);

  const queryClient = new QueryClient();

  let storedCar;
  const navigate = useNavigate()

  const [TotalOrder , setTotalOrder] = useState();

  useEffect(() => {
    storedCar = localStorage.getItem('ShoppingCar');
    if (storedCar) {
      const parsestoredCar = JSON.parse(storedCar);
      setLocalShopping(parsestoredCar);
      console.log("Carrito recuperado: " + storedCar);
  
      async function xd() {
        let newTotal = 0;
        parsestoredCar.forEach((sale) => {
          newTotal += sale.TotalVenta;
        });
        setTotalOrder(newTotal);
      }
  
      xd();
    } else {
      console.log("No había carrito");
    }
  }, []);
  
  useEffect(()=> {
    localStorage.setItem('ShoppingCar', JSON.stringify(LocalShopping));
    console.log(JSON.parse(localStorage.getItem('ShoppingCar')))
  },[LocalShopping]);

  const Detail = useRef()

  const TotalFinal = useRef()

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
  },})


  const mutationSale = useMutation("sale ", createSale, {
    onSettled: () => queryClient.invalidateQueries("sales"),
    mutationKey: "sale"
  })

  const DeleteOrder = (Productid) =>{

    const updatedCart = LocalShopping.filter(sale => sale.ProductId !== Productid);

    setLocalShopping(updatedCart);
  };

  const saveProducerOrder = async () => {
    let CostumerId;

    LocalShopping.map((sale) => {
      CostumerId = sale.CostumerId
    })

    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd');

    let OrdersSummed = 0;

    LocalShopping.map((sale) => {
 
      OrdersSummed = OrdersSummed + sale.TotalVenta

      })

    let newCostumerOrder = {
      CostumerId: CostumerId,
      Total: OrdersSummed,
      ConfirmedDate: formattedDate,
      PaidDate: "0001-01-01T00:00:00",
      DeliveredDate: "0001-01-01T00:00:00",
      Detail: Detail.current.value,
      Stage: "Sin confirmar",

    };

    const costumerOrder = await mutationCostumerOrder.mutateAsync(newCostumerOrder).finally(data => data)

    LocalShopping.map((sale) => {
      let newSale = {
        ProductId: sale.ProductId,
        Quantity: sale.Quantity,
        PurchaseTotal: sale.TotalVenta,
        CostumerOrderId: costumerOrder.id,
      };

      mutationSale.mutateAsync(newSale);
    })

    setLocalShopping([])
    localStorage.setItem('ShoppingCar', JSON.stringify(LocalShopping));

  }

  return (
    <>
      {/* {localStorage.getItem('ShoppingCar') != null ? ( */}
      {LocalShopping.length >=1 && localStorage.getItem('ShoppingCar') != null ? (
        <>
          <div className="mt-5">
            <div className="container">
              <div className="row">
                <div className="col-lg-9">
                  <div className="card">

                  <div className="warning">
                  Los precios indicados en este catálogo son referenciales y 
                  pueden estar sujetos a variaciones en el precio final. 
                  Por favor consulte con nuestro equipo para conocer precios especiales y descuentos disponibles
                  </div>

                    <div >
                      <table className="table table-borderless table-shopping-cart">
                        
                        <thead className="text-muted">
                          <tr className="small text-uppercase">
                            <th scope="col">Producto</th>
                            <th scope="col" width="100">Cantidad</th>
                            <th scope="col">Precio</th>
                            <th scope="col">IVA</th> 
                            <th scope="col">Final</th>
                            <th scope="col">Total</th> 
                            <th scope="col" className="text-right d-none d-md-block" width="200"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {LocalShopping.map((Sale, index) => (
                            <tr key={Sale.ProductId}>
                              <td className="d-flex align-items-center">
                                <div className="aside">
                                  <img
                                    src={Sale.ProductImage}
                                    alt="Product"
                                    className="img-sm"
                                    width="120"
                                  />
                                </div>
                                <div className="info ml-3">
                                  <div className="mb-8">
                                    <a className="title text-dark" data-abc="true">
                                      {Sale.ProductName}
                                    </a>
                                  </div>
                                  <div className="text-muted small">
                                    <p>{Sale.ProductDescription}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="align-middle">
                                <input
                                  className="form-control"
                                  defaultValue={Sale.Quantity}
                                  type="number"
                                  min="1"
                                  onChange={(e) => {
                                    const updatedShopping = [...LocalShopping];
                                    updatedShopping[index].Quantity = parseInt(e.target.value);
                                    updatedShopping[index].TotalVenta =  updatedShopping[index].PrecioFinal * parseInt(e.target.value);

                                    let newTotal = 0;

                                    updatedShopping.map((sale) => (
                                    newTotal = newTotal + sale.TotalVenta
                                    ))
                                    setLocalShopping(updatedShopping);
                                    setTotalOrder(newTotal);
                                  }}

                                />
                              </td>
                              <td className="align-middle">
                                <div className="price-wrap">
                                  <var className="price">₡{Sale.PrecioConMargen} x {Sale.ProductUnit}</var>
                                </div>
                              </td>
                              <td className="align-middle">
                                <div className="price-wrap">
                                  <var className="price">{Sale.IVA}%</var>
                                </div>
                              </td>
                              <td className="align-middle">
                                <div className="price-wrap">
                                  <var className="price">₡{Sale.PrecioFinal}</var>
                                </div>
                              </td>
                              <td className="align-middle">
                                <div className="price-wrap">
                                  <var className="price" >₡{(Sale.TotalVenta).toFixed(2)}</var>
                                </div>
                              </td>
                              <td className="text-right d-none d-md-block align-middle">
                                <button variant='danger' className="btn btn-light" size='sm'
                                
                                onClick={() => DeleteOrder(Sale.ProductId)}
                                
                                >Eliminar</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="col-lg-3">
                  <div className="card">
                    <div className="card-body">
                      <dl className="dlist-align">
                        <dt>Aplicar Cupon</dt>
                      </dl>

                      <p> <input type='text' className="form-control lg" />  <a className="btn btn-primary btn-main btn-square btn-block">Aplicar</a> </p>

                      
                      <hr />

                      <dl className="dlist-align">
                        <dt>Total:</dt>
                        <dd className="text-right ml-3" ref={TotalFinal} >  {TotalOrder !== undefined ? `₡${TotalOrder.toFixed(2)}` : 'Sin dato'} </dd>
                      </dl>

                      <dl className="dlist-align">
                        <dt>Descuento:</dt>
                        <dd className="text-right text-danger ml-3">₡-0</dd>
                      </dl>

                      <dl className="dlist-align">
                        <dt>Total con Descuento:</dt>
                        <dd className="text-right text-dark b ml-3"><strong>No aplica</strong></dd>
                      </dl>

                      <hr />
                      <a href="#" className="btn btn-primary btn-main btn-square btn-block" data-abc="true" onClick={saveProducerOrder}>Realizar pedido</a>
                      <NavLink to={`/home`} className="btn btn-success btn-main btn-square btn-block mt-2">Seguir comprando</NavLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container mt-3">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h4>Detalle del pedido:</h4>
                    <p><textarea
                            
                            placeholder='Detalle'
                            ref={Detail}
                            type='text'
                            className="form-control sm"
                            rows = "1"
                            
                            /></p>
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
