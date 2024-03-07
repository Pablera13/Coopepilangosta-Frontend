import React, { useRef, useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { NavLink, Navigate, useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Table, Container, Col, Row, Button, Form } from 'react-bootstrap';
import { deleteProducerOrder } from '../../../services/producerorderService';
import { getProducerOrder } from '../../../services/producerorderService';
import { getPurchase } from '../../../services/purchaseService';
import Select from 'react-select';
import PrintProducerOrder from './actions/printProducerOrder.jsx';
import AddProducerOrderModal from './actions/addProducerOrderModal.jsx';

import { MdDelete } from "react-icons/md";
// import styles from './listProducerOrder.css'
import CheckEntryModal from '../../Inventory/Entries/actions/checkEntryModal.jsx';

import ReactPaginate from 'react-paginate';

const listProducerOrders = () => {

  const params = useParams();

  const { data: producerorderData, isLoading, isError } = useQuery('producerorder', getProducerOrder);
  let dataFiltered = []
  console.log(producerorderData)

  const [currentPage, setCurrentPage] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');

  const filter = params.filter

  if (producerorderData) {

    if (filter === 'all') {
      dataFiltered = producerorderData

    } else if (filter === 'paid') {

      dataFiltered = producerorderData.filter((prodorder) => prodorder.paidDate != "0001-01-01T00:00:00")

    } else if (filter === 'notpaid') {

      dataFiltered = producerorderData.filter((prodorder) => prodorder.paidDate === "0001-01-01T00:00:00")

    } else if (filter === 'delivered') {

      dataFiltered = producerorderData.filter((prodorder) => prodorder.deliveredDate != "0001-01-01T00:00:00")

    } else if (filter === 'notdelivered') {

      dataFiltered = producerorderData.filter((prodorder) => prodorder.deliveredDate === "0001-01-01T00:00:00")

    }

  }

  const { data: purchases } = useQuery('purchase', getPurchase);

  const optionsSelect = [
    { value: 'all', label: 'Todos los pedidos' },
    { value: 'paid', label: 'Pedidos pagados' },
    { value: 'notpaid', label: 'Pedidos sin pagar' },
    { value: 'delivered', label: 'Pedidos recibidos' },
    { value: 'notdelivered', label: 'Pedidos sin recibir' }
  ];

  const [selectedOption, setSelectedOption] = useState();
  const navigate = useNavigate()

  useEffect(() => {
    if (selectedOption != null) {

      navigate(`/listProducerOrder/${selectedOption.value}`)

      console.log("Entro al effect")
    }
  }, [selectedOption]);

  const filteredByDate = producerorderData ? producerorderData.filter((pedido) => {
    if (selectedDate) {
      const pedidoDate = new Date(pedido.confirmedDate);
      const selected = new Date(selectedDate);
      return pedidoDate.toDateString() === selected.toDateString();
    }
    return true;
  }) : [];

  const recordsPerPage = 10;
  const offset = currentPage * recordsPerPage;
  const paginatedPedidos = filteredByDate.slice(offset, offset + recordsPerPage);

  const pageCount = Math.ceil(filteredByDate.length / recordsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  if (isLoading)
    return <div>Loading...</div>

  if (isError)
    return <div>Error</div>


  const showAlert = (id) => {
    swal({
      title: "Eliminar",
      text: "Esta seguro que desea eliminar este pedido?",
      icon: "warning",
      buttons: ["Cancelar", "Aceptar"]
    }).then(answer => {
      if (answer) {
        swal({
          title: 'Eliminado!',
          text: `El pedido ha sido eliminado`,
          icon: "success"

        })
        setTimeout(function () {
          deleteProducerOrder(id);
          window.location.reload();
        }, 2000)

      }
    })
  }


  return (
    <Container>
      <h2 className="text-center">Pedidos a productores</h2>
      <br></br>

<Form>
        <Row className="mb-3">

        <Col xs={2} md={3}>
          <AddProducerOrderModal />
        </Col>

        <Col md={3}>
            <Form.Label>Fecha Inicial</Form.Label>
            <Form.Control
              type="datetime-local"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </Col>

          <Col xs={8} lg={8}>
          <span>Seleccione los pedidos que desea ver:</span>
          <Select onChange={(selected) => setSelectedOption(selected)} options={optionsSelect} />
          {/* <Button className='BtnAddProducerModal' onClick={() => navigate("/addProducerOrder")}size='sm'>
            Crear Pedido
          </Button> */}
        </Col>

        </Row>
      </Form>

      <br></br>

      {producerorderData ? (
        <Row>
          <Col xs={12}>
          <Table className='Table' striped bordered hover variant="light" responsive>
              <thead>
                <tr className='TblProducerOrder'>
                  <th>#</th>
                  <th>Fecha del pedido</th>
                  <th>Total</th>
                  <th>Estado del pago</th>
                  <th>Estado de entrega</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredByDate.map((ProducerOrder) => (
                  <tr key={ProducerOrder.id}>
                    <td>{ProducerOrder.id}</td>
                    <td>{format(new Date(ProducerOrder.confirmedDate), 'yyyy-MM-dd')}</td>
                    <td>₡{ProducerOrder.total.toFixed(2)}</td>
                    <td>
                      {ProducerOrder.paidDate === "0001-01-01T00:00:00"
                        ? "Sin pagar"
                        : format(new Date(ProducerOrder.paidDate), 'yyyy-MM-dd')}
                    </td>
                    <td>
                      {ProducerOrder.deliveredDate === "0001-01-01T00:00:00"
                        ? "No recibido"
                        : format(new Date(ProducerOrder.deliveredDate), 'yyyy-MM-dd')}
                    </td>
                    <td>

                      <Button className='BtnBrown' onClick={() => navigate(`/editProducerOrder/${ProducerOrder.id}`)} size='sm'>
                        Editar
                      </Button>

                      {ProducerOrder.deliveredDate != "0001-01-01T00:00:00" ? (
                        <CheckEntryModal props={ProducerOrder} />
                      ) : null}

                      <Button className='BtnRed' onClick={() => showAlert(ProducerOrder.id)} size='sm'>
                        Eliminar <MdDelete />

                      </Button>

                      {/* <Button
                  onClick={() => generatePDF(ProducerOrder.id)}
                  size='sm'
                  style={{...buttonStyle, marginLeft: '5px',}}
                  onMouseOver={(e) => e.target.style.backgroundColor = buttonStyle.hover.backgroundColor}
                  onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                  >
                  Imprimir
                  </Button> */}

                      <PrintProducerOrder props={ProducerOrder.id} />


                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
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
      ) : (
        "Cargando"
      )}

    </Container>
  );
};

export default listProducerOrders;