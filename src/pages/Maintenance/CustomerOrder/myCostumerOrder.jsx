import React from 'react';
import { Table, Container, Col, Row, Button, Card, ListGroup } from 'react-bootstrap';
import { NavLink, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import { Form } from 'react-bootstrap';
import { getCostumerOrder } from '../../../services/costumerorderService';
import { getUserById } from '../../../services/userService';
import PrintCustomerOrder from '../../Maintenance/CustomerOrder/actions/printCustomerOrder.jsx';
import ReactPaginate from 'react-paginate';

const myCostumerOrder = () => {
    const userStorage = JSON.parse(localStorage.getItem('user'));
    const [user, setUser] = useState(null);
    const { data: customerorderData, isLoading, isError } = useQuery('customerorder', getCostumerOrder);
    const navigate = useNavigate()

    const [currentPage, setCurrentPage] = useState(0);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedStage, setSelectedStage] = useState('');

    useEffect(() => {
        if (customerorderData) {
            getUserById(userStorage.id, setUser);
        }
    }, [customerorderData]);

    const filteredByDate = customerorderData ? customerorderData.filter((miPedido) => {
        if (selectedDate) {
            const pedidoDate = new Date(miPedido.confirmedDate);
            const selected = new Date(selectedDate);
            return pedidoDate.toDateString() === selected.toDateString();
        }
        return true;
    }) : [];
    
    const filteredByStage = filteredByDate.filter((miPedido) => {
        if (miPedido.stage === 'Sin confirmar' || miPedido.stage === 'En preparación' || miPedido.stage === 'Confirmado') {
            return true;
        }
        return false;
    });

      

      const recordsPerPage = 10;
      const offset = currentPage * recordsPerPage;
      const paginatedOrders = filteredByStage.slice(offset, offset + recordsPerPage);

  const pageCount = Math.ceil(filteredByDate.length / recordsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };


    return (
        <Container>
            <h2 className="text-center">Mis Pedidos</h2>
            <br /> <br />

            <Form>
        <Row className="mb-3">

        <Col md={3}>
            <Form.Label>Fecha Inicial</Form.Label>
            <Form.Control
              type="datetime-local"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </Col>

        </Row>

        <Form.Group>
                    <Form.Label>Estado:</Form.Label>
                    <Form.Control
                        as="select"
                        value={selectedStage}
                        onChange={(e) => setSelectedStage(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="Sin confirmar">Sin confirmar</option>
                        <option value="En preparación">En preparación</option>
                        <option value="Confirmado">Confirmado</option>
                    </Form.Control>
                </Form.Group>
      </Form>

      <br></br>

            <Col xs={8} md={2} lg={12}>
                {user != null && customerorderData != null ? (
                    <>
                        <Row>
                            {customerorderData ? (
                                <Table className='Table' striped bordered hover variant="light" responsive>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Fecha del pedido</th>
                                            <th>Fecha de pago</th>
                                            <th>Fecha de entrega</th>
                                            <th>Total</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedOrders
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

                                                    {/* <td>₡{order.total.toFixed(2)}</td> */}
                                                    <td>{order.total.toFixed(2) == 0 ?
                                                        'Por cotizar'
                                                        : `₡${order.total.toFixed(2)}`
                                                    }</td>
                                                    <td>{order.stage}</td>
                                                    <td>
                                                        {/* <NavLink
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
                                                        </NavLink> */}

                                                        <Button className='BtnBrown'
                                                            onClick={() => navigate(`/userOrder/${order.id}`)}>
                                                            Detalles
                                                        </Button>

                                                        <PrintCustomerOrder props={order.id} />

                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </Table>
                            ) : (
                                'Cargando'
                            )}
                            <ReactPaginate
            previousLabel="Anterior"
            nextLabel="Siguiente"
            breakLabel="..."
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName="pagination"
            subContainerClassName="pages pagination"
            activeClassName="active"
          />
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