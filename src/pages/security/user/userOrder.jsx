import { React, useState, useEffect } from 'react'
import { useParams, NavLink } from 'react-router-dom';
import { getProducerOrderSales } from '../../../services/saleService';
import { getProductById2 } from '../../../services/productService';
import { getCostumerOrderById } from '../../../services/costumerorderService';
import { format } from 'date-fns';

import './userOrder.css'

const userOrder = () => {

    const order = useParams();
    const [customerorderRequest, setCustomerorder] = useState(null)
    const [MyFilteredData, setMyFilteredData] = useState([]);
    const [MyOrders, setMyOrders] = useState([]);
    const [subTotal, setSubTotal] = useState(0);

    useEffect(() => {
        async function settingSales() {
            getProducerOrderSales(order.orderid, setMyFilteredData)
            getCostumerOrderById(order.orderid, setCustomerorder);
        }
        settingSales();
      }, []);

    useEffect(() => {

        async function MeCagoEnLasRestricciones() {

            let MySales = []
            let subtotal=0

            for (const sale of MyFilteredData) {

                const product = await getProductById2(sale.productId);
                const Sale = {
                    ProductName: product.name,
                    ProductImage: product.image,
                    IVA: product.iva / 100,
                    UnitPrice: sale.unitPrice,
                    Quantity: sale.quantity,
                    Unit: sale.unit,
                    Total: sale.purchaseTotal,
                };

                console.log("Sale = " + Sale)
                MySales.push(Sale)
                subtotal += sale.unitPrice * sale.quantity
            }
            setMyOrders(MySales)
            setSubTotal(subtotal)
        }

        MeCagoEnLasRestricciones();

    }, [MyFilteredData]);


    return (

        <div className="container">

            {customerorderRequest != null && MyOrders.length >0 ? (

                <><article className="card">
                    <header className="card-header"><h6>Código de Pedido: #{order.orderid}</h6></header>
                    <div className="card-body">
                        <article className="card">
                            <div className="card-body row">

                                <div className="col">
                                    <strong>Fecha de pedido</strong>
                                    <br />
                                    {customerorderRequest.confirmedDate === "0001-01-01T00:00:00"
                                        ? "Sin pagar"
                                        : format(new Date(customerorderRequest.confirmedDate), 'yyyy-MM-dd')}
                                </div>

                                <div className="col">
                                    <strong>Fecha de pago</strong>
                                    <br />
                                    {customerorderRequest.paidDate === "0001-01-01T00:00:00"
                                        ? "Sin pagar"
                                        : format(new Date(customerorderRequest.paidDate), 'yyyy-MM-dd')}
                                </div>

                                <div className="col">
                                    <strong>Fecha de entrega</strong>
                                    <br />
                                    {customerorderRequest.deliveredDate === "0001-01-01T00:00:00"
                                        ? "Sin entregar"
                                        : format(new Date(customerorderRequest.deliveredDate), 'yyyy-MM-dd')}
                                </div>

                            </div>
                        </article>

                        <ul className="row">

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
                                    {MyOrders.map((order, index) => (
                                        <tr key={index}>
                                            <td>
                                                <img src={order.ProductImage} className="img-sm border" alt={order.ProductName} />
                                            </td>
                                            <td>{order.ProductName}</td>
                                            <td>{order.Quantity}</td>
                                            <td>{order.Unit}</td>
                                            <td>{order.UnitPrice == 0 ? 'Por cotizar' : '₡' + order.UnitPrice}</td>
                                            <td>{order.UnitPrice == 0 ? 'Por cotizar' : '₡' + order.UnitPrice * order.Quantity}</td>
                                            <td>{(order.IVA * 100)}%</td>
                                            <td>{order.Total == 0 ? 'Por cotizar' : '₡' + order.Total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="card">
                                <div className="card-body row">

                                    <div className="col" style={{ marginLeft: "75%" }}>
                                        <strong>Subtotal</strong>
                                    </div>

                                    <div className="col">
                                        {subTotal == 0 ? 'Por cotizar' : '₡' + subTotal.toFixed(2)}
                                    </div>

                                    <div className="col" style={{ marginLeft: "75%" }}>
                                        <strong>Total</strong>
                                    </div>

                                    <div className="col">
                                        {customerorderRequest.total == 0 ? 'Por cotizar' : '₡' + customerorderRequest.total}
                                    </div>

                                </div>
                            </div>
                        </ul>



                    </div>
                </article><article className="card">
                        <div className="card-body">





                            {customerorderRequest.detail != "" ?

                                <article className="card">

                                    <div className="card-body row">

                                        <div className="col">
                                            <strong>Detalle del pedido:</strong>
                                            <br /><br />{customerorderRequest.detail}
                                        </div>
                                        <br />
                                    </div>

                                </article>

                                : ""}

                            <div className="track">
                                {/* <div className="step active"> */}
                                <div className={customerorderRequest.stage === "Confirmado" ||
                                    customerorderRequest.stage === "En preparación" ||
                                    customerorderRequest.stage === "En ruta de entrega" ||
                                    customerorderRequest.stage === "Entregado"
                                    ? "step active"
                                    : "step"}>

                                    <span className="icon"> <i className="fa fa-check"></i> </span>
                                    <span className="text">Pedido confirmado</span>
                                </div>
                                <div className={customerorderRequest.stage === "En preparación" ||
                                    customerorderRequest.stage === "En ruta de entrega" ||
                                    customerorderRequest.stage === "Entregado"
                                    ? "step active"
                                    : "step"}>
                                    <span className="icon"> <i className="fa fa-user"></i> </span>
                                    <span className="text">En preparación</span>
                                </div>
                                <div className={customerorderRequest.stage === "En ruta de entrega" ||
                                    customerorderRequest.stage === "Entregado"
                                    ? "step active"
                                    : "step"}>
                                    <span className="icon"> <i className="fa fa-truck"></i> </span>
                                    <span className="text">En ruta de entrega</span>
                                </div>
                                <div className={customerorderRequest.stage === "Entregado"
                                    ? "step active"
                                    : "step"}>
                                    <span className="icon"> <i className="fa fa-box"></i> </span>
                                    <span className="text">Entregado</span>
                                </div>
                            </div>

                            <br></br>
                            <hr />
                            <NavLink to={`/userProfile`} className="btn btn-warning">Volver a mi perfil</NavLink>

                            <br></br>
                        </div>
                    </article></>

            ) : "Cargando..."}


        </div>
    );

}

export default userOrder;