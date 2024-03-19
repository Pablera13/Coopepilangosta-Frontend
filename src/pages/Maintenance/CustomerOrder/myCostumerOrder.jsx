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
import "../../../css/StylesBtn.css";
import { IoMdSearch } from 'react-icons/io';

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
            <div className="table-container">
                <h2 className="table-title">Mis Pedidos</h2>

                <hr className="divider" />

                <br/>


                <Form>
                <Row className="mb-3 filters-container">

                <Col xs={5.5} md={5.5}></Col>


    <Col xs={3} md={3}>
        <Form.Control
            type="datetime-local"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
        />
    </Col>
    <Col xs={3} md={3}>
        <Form.Control
            type="text"
            placeholder="Buscar coincidencias"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
        />
    </Col>
</Row>

                </Form>

                <br></br>

                <Col xs={12} md={12} lg={12}>
                    {user != null && customerorderData != null ? (
                        <>
                            <Row>
                                {customerorderData ? (
                                    <Table className='Table' hover responsive>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Fecha</th>
                                                <th>Pago</th>
                                                <th>Entrega</th>
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
                                                            : 'No entregado'
                                                        }</td>

                                                        {/* <td>₡{order.total.toFixed(2)}</td> */}
                                                        <td>{order.total.toFixed(2) == 0 ?
                                                            'Por cotizar'
                                                            : `₡${order.total.toFixed(2)}`
                                                        }</td>
                                                        <td>{order.stage}</td>
                                                        <td>

                                                            <div className="BtnContainer">

                                                                <Button className='BtnBrown'
                                                                    onClick={() => navigate(`/userOrder/${order.id}`)}>
                                                                    <IoMdSearch />
                                                                </Button>

                                                                <PrintCustomerOrder props={order.id} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    'Cargando'
                                )}
                                <ReactPaginate
                                    previousLabel="<"
                                    nextLabel=">"
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
            </div>
        </Container>
    );
};

export default myCostumerOrder;