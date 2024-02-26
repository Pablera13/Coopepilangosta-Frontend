import React, { useRef, useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { NavLink, Navigate, useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Table, Container, Col, Row, Button } from 'react-bootstrap';
import { deleteProducerOrder } from '../../../services/producerorderService';
import { getProducerOrder } from '../../../services/producerorderService';
import { getPurchase } from '../../../services/purchaseService';
import Select from 'react-select';
import PrintProducerOrder from './actions/printProducerOrder.jsx';
import AddProducerOrderModal from './actions/addProducerOrderModal.jsx';

import styles from './listProducerOrder.css'

import ReactPaginate from 'react-paginate';

const listProducerOrders = () => {

  const params = useParams();

  const { data: producerorderData, isLoading, isError } = useQuery('producerorder', getProducerOrder);
  let dataFiltered = []

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


  const recordsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const offset = currentPage * recordsPerPage;

  if (isLoading)
    return <div>Loading...</div>

  if (isError)
    return <div>Error</div>

  const paginatedEntries = producerorderData.slice(offset, offset + recordsPerPage);

  const pageCount = Math.ceil(producerorderData.length / recordsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };


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
      <div className="buttons">
      </div>
      <Col xs={8} md={2} lg={12}>

        <span>Seleccione los pedidos que desea ver:</span>
        <Select onChange={(selected) => setSelectedOption(selected)} options={optionsSelect} /><Col>
          <br></br>

          {/* <Button className='BtnAddProducerModal' onClick={() => navigate("/addProducerOrder")}size='sm'>
            Crear Pedido
          </Button> */}

          <Col md={3}>
            <AddProducerOrderModal />
          </Col>




        </Col>

        <br></br>

        {producerorderData ? (
          <Row>
            <Table className='TableProducerOrder' striped bordered hover variant="light">
              <thead>
                <tr className='TblProducerOrder'>
                  <th>Número de pedido</th>
                  <th>Fecha del pedido</th>
                  <th>Total</th>
                  <th>Estado del pago</th>
                  <th>Estado de entrega</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {dataFiltered.map((ProducerOrder) => (
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

                      <Button className='BtnEdit' onClick={() => navigate(`/editProducerOrder/${ProducerOrder.id}`)} size='sm'>
                        Editar
                      </Button>

                      {ProducerOrder.deliveredDate != "0001-01-01T00:00:00" ? (
                        <Button className='BtnAdd' onClick={() => navigate(`/checkProducerOrder/${ProducerOrder.id}`)} size='sm'>
                          Ingresar
                        </Button>
                      ) : null}

                      <Button className='BtnTrash' onClick={() => showAlert(ProducerOrder.id)} size='sm'>
                        Eliminar
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
      </Col>
    </Container>
  );
};

export default listProducerOrders;