import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { getProducerOrderSales } from '../../../services/saleService';
import { getProductById2 } from '../../../services/productService';
import { getCostumerOrderById } from '../../../services/costumerorderService';
import { Form, Row, Col, Button, Container, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { FaCheck, FaTruck, FaBoxes, FaCheckDouble } from 'react-icons/fa';
import { format } from 'date-fns';
import './userOrder.css';

const userOrder = () => {
    const { orderid } = useParams();
    const [customerorderRequest, setCustomerorder] = useState(null);
    const [myFilteredData, setMyFilteredData] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            getProducerOrderSales(orderid, setMyFilteredData);
            getCostumerOrderById(orderid, setCustomerorder);
        }
        fetchData();
    }, [orderid]);

    useEffect(() => {
        async function calculateSales() {
            let mySales = [];
            let subtotal = 0;

            for (const sale of myFilteredData) {
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
                mySales.push(Sale);
                subtotal += sale.unitPrice * sale.quantity;
            }
            setMyOrders(mySales);
            setSubTotal(subtotal);
        }
        calculateSales();
    }, [myFilteredData]);

    return (
        <Container>
            {customerorderRequest != null && myOrders.length > 0 ? (
                <>
                    <article className="card">
                        <header className="card-header">
                            <h6>Código de Pedido: #{orderid}</h6>
                            <br />
                            <Row className="mb-3">
                                <Col xs={2} md={2} lg={2}>
                                    <label className="datesStrong">Fecha de pedido</label>
                                    <br />
                                    {customerorderRequest.confirmedDate === '0001-01-01T00:00:00'
                                        ? 'Sin pagar'
                                        : format(new Date(customerorderRequest.confirmedDate), 'yyyy-MM-dd')}
                                </Col>
                                <Col xs={2} md={2} lg={2}>
                                    <label className="datesStrong">Fecha de pago</label>
                                    <br />
                                    {customerorderRequest.paidDate === '0001-01-01T00:00:00'
                                        ? 'Sin pagar'
                                        : format(new Date(customerorderRequest.paidDate), 'yyyy-MM-dd')}
                                </Col>
                                <Col xs={2} md={2} lg={2}>
                                    <label className="datesStrong">Fecha de entrega</label>
                                    <br />
                                    {customerorderRequest.deliveredDate === '0001-01-01T00:00:00'
                                        ? 'Sin entregar'
                                        : format(new Date(customerorderRequest.deliveredDate), 'yyyy-MM-dd')}
                                </Col>
                            </Row>
                        </header>

                        <div className="card-body">
                            <Table responsive className="table table-borderless table-shopping-cart">
                                <thead>
                                    <tr>
                                        <th>Imagen</th>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Unidad</th>
                                        <th>Precio Unitario</th>
                                        <th>Subtotal</th>
                                        <th>IVA</th>
                                        <th>Final</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myOrders.map((order, index) => (
                                        <tr key={index}>
                                            <td>
                                                <img src={order.ProductImage} className="img-sm" alt={order.ProductName} />
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
                            </Table>
                            <div className="card-body row">
                                <Row>
                                    <Col xs={8} md={8} lg={8}></Col>
                                    <Col xs={2} md={2} lg={2}>
                                        <strong className="datesStrong">Subtotal</strong>
                                    </Col>
                                    <Col xs={2} md={2} lg={2}>
                                        {subTotal == 0 ? 'Por cotizar' : '₡' + subTotal.toFixed(2)}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={8} md={8} lg={8}></Col>
                                    <Col xs={2} md={2} lg={2}>
                                        <strong className="datesStrong">Total</strong>
                                    </Col>
                                    <Col xs={2} md={2} lg={2}>
                                        {customerorderRequest.total == 0 ? 'Por cotizar' : '₡' + customerorderRequest.total}
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </article>

                    <article className="card">
                        <div className="card-body">
                            {customerorderRequest.detail !== '' && (
                                <article className="card">
                                    <div className="card-body row">
                                        <Col>
                                            <strong>Detalle del pedido</strong>
                                            <br />
                                            <br />
                                            {customerorderRequest.detail}
                                        </Col>
                                    </div>
                                </article>
                            )}
                            <div className="track">
                                <div className={customerorderRequest.stage === 'Confirmado' ||
                                    customerorderRequest.stage === 'En preparación' ||
                                    customerorderRequest.stage === 'En ruta de entrega' ||
                                    customerorderRequest.stage === 'Entregado'
                                    ? 'step active'
                                    : 'step'}>
                                    <span className="icon">
                                        <FaCheck />
                                        <i className="fa fa-check"></i>{' '}
                                    </span>
                                    <span className="text">Pedido confirmado</span>
                                </div>
                                <div className={customerorderRequest.stage === 'En preparación' ||
                                    customerorderRequest.stage === 'En ruta de entrega' ||
                                    customerorderRequest.stage === 'Entregado'
                                    ? 'step active'
                                    : 'step'}>
                                    <span className="icon">
                                        <FaBoxes />
                                        <i className="fa fa-user"></i>{' '}
                                    </span>
                                    <span className="text">En preparación</span>
                                </div>
                                <div className={customerorderRequest.stage === 'En ruta de entrega' ||
                                    customerorderRequest.stage === 'Entregado'
                                    ? 'step active'
                                    : 'step'}>
                                    <span className="icon">
                                        <FaTruck />
                                        <i className="fa fa-truck"></i>{' '}
                                    </span>
                                    <span className="text">En ruta de entrega</span>
                                </div>
                                <div className={customerorderRequest.stage === 'Entregado'
                                    ? 'step active'
                                    : 'step'}>
                                    <span className="icon">
                                        <FaCheckDouble />
                                        <i className="fa fa-box"></i>{' '}
                                    </span>
                                    <span className="text">Entregado</span>
                                </div>
                            </div>
                            <br />
                            <hr />
                            <Button className="BtnBrown" onClick={() => navigate(`/userProfile`)}>
                                <RiArrowGoBackFill />
                            </Button>
                            <br />
                        </div>
                    </article>
                </>
            ) : (
                'Cargando...'
            )}
        </Container>
    );
};

export default userOrder;
