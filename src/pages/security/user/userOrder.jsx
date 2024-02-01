import {React, useState, useEffect} from 'react'
import { useParams, NavLink } from 'react-router-dom';
import {getSale} from '../../../services/saleService';
import { getProductById } from '../../../services/productService';
import { getProductProducerById } from '../../../services/productProducerService';
import { useQuery } from 'react-query';
import {getCostumerOrderById} from '../../../services/costumerorderService';
import { format } from 'date-fns';


import styles from './userOrder.css' 

const userOrder = () => {

    const order  = useParams();
    const [customerorderRequest, setCustomerorder] = useState(null)
    const { data: sales, isLoading , isError } = useQuery('sale', getSale);
    
    const [productRequest, setProductRequest] = useState(null)
    let dataFiltered = [] 
   
    const [MyFilteredData, setMyFilteredData] = useState([]);
    const [MyOrders, setMyOrders] = useState([]);

    useEffect(() => {        
        if(sales){   
        console.log("Sales = " + JSON.stringify(sales))
        dataFiltered = sales.filter((sale) => sale.costumerOrderId == order.orderid)
        setMyFilteredData(dataFiltered)
        console.log("dataFiltered = "+ dataFiltered)
        }
    }, [sales]);


    useEffect(() => {

        async function MeCagoEnLasRestricciones() {

            let MySales = []

            const costumerorder = getCostumerOrderById(order.orderid, setCustomerorder);
    
            for (const sale of MyFilteredData) {
        
                const product = await getProductById(sale.productId, setProductRequest);
        
                const averageeprice = await getProductProducerById(product.id);
        
                const MargenGanancia = averageeprice * (product.margin/100)
                const PrecioConMargen = averageeprice + MargenGanancia
                const IVA = PrecioConMargen * (product.iva/100)
                const PrecioFinal = PrecioConMargen + IVA
          
                const Sale = {
                  ProductName: product.name,
                  ProductImage: product.image,
                  UnitPrice: PrecioFinal,
                  Quantity: sale.quantity,
                  Unit: product.unit,
                  Total: sale.purchaseTotal,
                };
                
                console.log("Sale = " + Sale)
                MySales.push(Sale)
            } 
            setMyOrders(MySales)
        }

        MeCagoEnLasRestricciones();
    
         }, [MyFilteredData]);  

         if(isLoading)
         return <div>Loading...</div>
         
         if(isError)
         return <div>Error</div>
     
    return (
  
        <div className="container">

          {/* {Array.isArray(MyOrders) && MyOrders.length > 0 ? ( */}

          {MyOrders != null && customerorderRequest != null ? (

            <article className="card">
                <header className="card-header"> Mis pedidos / Seguimiento </header>
                <div className="card-body">
                    <h6>Código de Pedido: #{order.orderid}</h6>
                    
                    {customerorderRequest.detail != ""? 

                    <article className="card">

                        <div className="card-body row">

                            <div className="col">
                                <strong>Detalle del pedido:</strong>
                                <br /><br />{customerorderRequest.detail}
                            </div>
                            <br/>
                        </div>

                    </article>

                    : ""}

                    <article className="card">

                        <div className="card-body row">
                            <div className="col">
                                <strong>Fecha de pago:</strong>
                                <br/> 
                                {customerorderRequest.paidDate === "0001-01-01T00:00:00"
                                ? "Sin pagar"
                                : format(new Date(customerorderRequest.paidDate), 'yyyy-MM-dd')}
                                <i className="fa fa-phone"></i> 
                            </div>

                            <div className="col">
                                <strong>Fecha de entrega:</strong>
                                <br /> {customerorderRequest.deliveredDate === "0001-01-01T00:00:00"
                                ? "Sin entregar"
                                : format(new Date(customerorderRequest.deliveredDate), 'yyyy-MM-dd')}
                            </div>

                            <div className="col">
                                <strong>Total de la compra:</strong>
                                <br /> ₡{customerorderRequest.total.toFixed(2)}
                            </div>

                        </div>

                    </article>

                    <div className="track">
                        {/* <div className="step active"> */}
                        <div className={
                            customerorderRequest.stage === "Confirmado" ||
                            customerorderRequest.stage === "En preparación"||
                            customerorderRequest.stage === "En ruta de entrega"||
                            customerorderRequest.stage === "Entregado"
                            ? "step active"
                            : "step"
                            }>

                            <span className="icon"> <i className="fa fa-check"></i> </span>
                            <span className="text">Pedido confirmado</span>
                        </div>
                        <div className={
                            customerorderRequest.stage === "En preparación"||
                            customerorderRequest.stage === "En ruta de entrega"||
                            customerorderRequest.stage === "Entregado"
                            ? "step active"
                            : "step"
                            }>
                            <span className="icon"> <i className="fa fa-user"></i> </span>
                            <span className="text">En preparación</span>
                        </div>
                        <div className={
                            customerorderRequest.stage === "En ruta de entrega"||
                            customerorderRequest.stage === "Entregado"
                            ? "step active"
                            : "step"
                            }>
                            <span className="icon"> <i className="fa fa-truck"></i> </span>
                            <span className="text">En ruta de entrega</span>
                        </div>
                        <div className={
                            customerorderRequest.stage === "Entregado"
                            ? "step active"
                            : "step"
                            }>
                            <span className="icon"> <i className="fa fa-box"></i> </span>
                            <span className="text">Entregado</span>
                        </div>
                    </div>
                    <hr />
                    <ul className="row">
                        {MyOrders.map((order, index) => (
                            <li className="col-md-4" key={index}>
                                <figure className="itemside mb-3">
                                    <div className="aside">
                                        <img src={order.ProductImage} className="img-sm border" alt={order.ProductName} />
                                    </div>
                                    <figcaption className="info align-self-center">
                                        <p className="title">{order.ProductName} x {order.Quantity}</p>
                                        <span className="text-muted">Precio Unitario: ₡{order.UnitPrice.toFixed(2)}</span>
                                        <br></br>
                                        <span className="text-muted">Total: ₡{order.Total.toFixed(2)}</span>

                                    </figcaption>
                                </figure>
                            </li>
                        ))}
                    </ul>
                    <hr />

                    {/* <span className="text-muted">Total: ₡{order.Total.toFixed(2)}</span> */}

                    {/* <a href="#" className="btn btn-warning" data-abc="true">
                        <i className="fa fa-chevron-left"></i> Volver a mi perfil
                    </a> */}

                    <NavLink to={`/userProfile`} className="btn btn-warning">Volver a mi perfil</NavLink>
                    
                    
                </div>
            </article>

          )   : "Cargando..."  }


        </div>
    );

                        }

export default userOrder;