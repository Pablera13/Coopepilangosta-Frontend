import { React, useState, useEffect } from 'react'
import { useQuery } from 'react-query';
import { NavLink, Navigate, useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Table, Container, Col, Row, Button } from 'react-bootstrap';
import { deleteCostumerOrder } from '../../../services/costumerorderService';
import { getCostumerOrder } from '../../../services/costumerorderService';
import Select from 'react-select';
import PrintCustomerOrder from './actions/printCustomerOrder.jsx';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import styles from './listCustomerOrder.css'

import ReactPaginate from 'react-paginate';

import UpdateCustomerOrderModal from './actions/updateCustomerOrderModal.jsx';

const listCustomerOrder = () => {

  const params = useParams();

  const buttonStyle = {
    borderRadius: '5px',
    backgroundColor: '#e0e0e0',
    color: '#333',
    border: '1px solid #e0e0e0',
    padding: '8px 12px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    minWidth: '100px',
    fontWeight: 'bold',
    hover: {
      backgroundColor: '#c0c0c0',
    },
  };

  const { data: customerorderData, isLoading, isError } = useQuery('customerorder', getCostumerOrder);
  let dataFiltered = []

  const filter = params.filter

  if (customerorderData) {

    if (filter === 'all') {
      dataFiltered = customerorderData

    } else if (filter === 'paid') {

      dataFiltered = customerorderData.filter((prodorder) => prodorder.paidDate != "0001-01-01T00:00:00")

    } else if (filter === 'notpaid') {

      dataFiltered = customerorderData.filter((prodorder) => prodorder.paidDate === "0001-01-01T00:00:00")

    } else if (filter === 'delivered') {

      dataFiltered = customerorderData.filter((prodorder) => prodorder.deliveredDate != "0001-01-01T00:00:00")

    } else if (filter === 'notdelivered') {

      dataFiltered = customerorderData.filter((prodorder) => prodorder.deliveredDate === "0001-01-01T00:00:00")

    }

  }

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

      navigate(`/listCustomerOrder/${selectedOption.value}`)

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

  const paginatedProducers = customerorderData.slice(offset, offset + recordsPerPage);

  const pageCount = Math.ceil(customerorderData.length / recordsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };


  const deleteObject = (id) => {

    deleteCostumerOrder(id);

  }

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
          deleteCostumerOrder(id);
          window.location.reload();
        }, 2000)

      }
    })
  }


  return (
    <Container>
      <h2 className="text-center">Pedidos Recibidos</h2>
      <div className="buttons">
      </div>
      <Row>
        <Col xs={12}>
          <span>Seleccione los pedidos que desea ver:</span>
          <Select onChange={(selected) => setSelectedOption(selected)} options={optionsSelect} />
        </Col>
      </Row>
      <br></br>

      {customerorderData ? (
        <Row>
          <Col xs={12}>
            <Table striped bordered hover variant="light" responsive>
              <thead>
                <tr>
                  <th>Número de pedido</th>
                  <th>Fecha del pedido</th>
                  <th>Total</th>
                  <th>Estado del pago</th>
                  <th>Estado de entrega</th>
                  <th>Seguimiento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {dataFiltered.map((CustomerOrder) => (
                  <tr key={CustomerOrder.id}>
                    <td>{CustomerOrder.id}</td>
                    <td>{format(new Date(CustomerOrder.confirmedDate), 'yyyy-MM-dd')}</td>
                    <td>₡{CustomerOrder.total.toFixed(2)}</td>
                    <td>
                      {CustomerOrder.paidDate === "0001-01-01T00:00:00"
                        ? "Sin pagar"
                        : format(new Date(CustomerOrder.paidDate), 'yyyy-MM-dd')}
                    </td>
                    <td>
                      {CustomerOrder.deliveredDate === "0001-01-01T00:00:00"
                        ? "No entregado"
                        : format(new Date(CustomerOrder.deliveredDate), 'yyyy-MM-dd')}
                    </td>
                    <td>{CustomerOrder.stage}</td>
                    <td>
                      <UpdateCustomerOrderModal props={CustomerOrder.id} />

                      {/* <Button
                        onClick={() => navigate(`/editCustomerOrder/${CustomerOrder.id}`)}
                        size='sm'
                        style={{ ...buttonStyle, marginLeft: '5px', }}
                        onMouseOver={(e) => e.target.style.backgroundColor = buttonStyle.hover.backgroundColor}
                        onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                      >
                        Editar
                      </Button> */}

                      <Button
                        onClick={() => showAlert(CustomerOrder.id)}
                        size='sm'
                        style={{ ...buttonStyle, marginLeft: '5px', }}
                        onMouseOver={(e) => e.target.style.backgroundColor = buttonStyle.hover.backgroundColor}
                        onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                      >
                        Eliminar
                      </Button>

                      <PrintCustomerOrder props={CustomerOrder.id} />

                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
          <Col>
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
          </Col>
        </Row>
      ) : (
        "Cargando"
      )}

    </Container>
  );
};

export default listCustomerOrder;