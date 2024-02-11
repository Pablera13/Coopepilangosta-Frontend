import React from 'react';
import { Table, Container, Col, Row, Button, Card, ListGroup } from 'react-bootstrap';
import { NavLink, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { format } from 'date-fns';

import { getCostumerOrder } from '../../../services/costumerorderService';
import { getUserById } from '../../../services/userService';
import PrintCustomerOrder from '../../Maintenance/CustomerOrder/actions/printCustomerOrder.jsx';

const myCostumerOrder = () => {
    const userStorage = JSON.parse(localStorage.getItem('user'));
    const [user, setUser] = useState(null);
    const { data: customerorderData, isLoading, isError } = useQuery('customerorder', getCostumerOrder);

    useEffect(() => {
        if (customerorderData) {
            getUserById(userStorage.id, setUser);
        }
    }, [customerorderData]);


    return (
        <Container>
            <h2 className="text-center">Mis Pedidos</h2>
            <br /> <br />
            <Col xs={8} md={2} lg={12}>
                {user != null && customerorderData != null ? (
                    <>
                        <Row>
                            {customerorderData ? (
                                <Table striped bordered hover variant="light">
                                    <thead>
                                        <tr>
                                            <th>Número de pedido</th>
                                            <th>Fecha del pedido</th>
                                            <th>Fecha de pago</th>
                                            <th>Fecha de entrega</th>
                                            <th>Total</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customerorderData
                                            .filter((order) => order.costumerId === userStorage.costumer.id)
                                            .map((order) => (
                                                <tr key={order.id}>
                                                    <td>{order.id}</td>
                                                    <td>{format(new Date(order.confirmedDate), 'yyyy-MM-dd')}</td>
                                                    <td>{order.paidDate != "0001-01-01T00:00:00" ?
                                                        format(new Date(order.paidDate), 'yyyy-MM-dd')
                                                        : 'Sin pagar'
                                                    }</td>
                                                    <td>{order.deliveredDate != "0001-01-01T00:00:00" ?
                                                        format(new Date(order.deliveredDate), 'yyyy-MM-dd')
                                                        : 'Sin pagar'
                                                    }</td>

                                                    <td>₡{order.total.toFixed(2)}</td>
                                                    <td>{order.stage}</td>
                                                    <td>
                                                        <NavLink
                                                            to={`/userOrder/${order.id}`}
                                                            style={{
                                                                textDecoration: 'underline',
                                                                margin: '0 10px',
                                                                border: 'none',
                                                                background: 'none',
                                                                padding: 0,
                                                                color: 'inherit',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            Detalles
                                                        </NavLink>

                                                        <PrintCustomerOrder props={order.id} />

                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </Table>
                            ) : (
                                'Cargando'
                            )}
                        </Row>
                    </>
                ) : (
                    <div className="text-center">Cargando...</div>
                )}
            </Col>
        </Container>
    );
};

export default myCostumerOrder;