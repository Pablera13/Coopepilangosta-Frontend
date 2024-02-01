import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import { getProducers } from '../../../services/producerService';
import { NavLink } from 'react-router-dom';
import { deleteProducerService } from '../../../services/producerService';
import { Table, Container, Col, Row, Button } from 'react-bootstrap';
import AddProducerModal from './actions/addProducerModal.jsx';
import ReactPaginate from 'react-paginate';
import syles from '../Producer/listProducer.css'
import {useNavigate} from 'react-router-dom';

const listProducers = () => {
  const { data: Producers, isLoading: ProducersLoading, isError: ProducersError } = useQuery('producer', getProducers);

  const navigate = useNavigate()
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

  const recordsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);

  if (ProducersLoading) return <div>Loading...</div>;

  if (ProducersError) return <div>Error</div>;

  const offset = currentPage * recordsPerPage;
  const paginatedProducers = Producers.slice(offset, offset + recordsPerPage);

  const pageCount = Math.ceil(Producers.length / recordsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // const deleteProducer = (id) => {
  //   console.log("Id del productor: ", id);
  //   deleteProducer(id);
  // };

  const showAlert = (id) => {
    swal({
      title: 'Eliminar',
      text: '¿Está seguro de que desea eliminar esta valoración?',
      icon: 'warning',
      buttons: ['Cancelar', 'Aceptar'],
    }).then((answer) => {
      if (answer) {
        deleteProducerService(id);
        swal({
          title: 'Eliminado',
          text: 'La valoración ha sido eliminada',
          icon: 'success',
        });
        setTimeout(function () {
          console.log("Review eliminada" + id)
          window.location.reload();
        }, 2000);
      }
    });
  };

  return (
    <Container>
      <h2 className="text-center">Productores</h2>
      <div className="buttons">
        <AddProducerModal />
      </div>
      <Col xs={8} md={2} lg={12}>
        {Producers ? (
          <Row>
            <Table striped bordered hover variant="light">
              <thead>
                <tr>
                  <th>Cédula</th>
                  <th>Nombre Completo</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Dirección</th>
                  <th>Cuenta bancaria</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
              {paginatedProducers.map((producer) => (
                <tr key={producer.id}>
                  <td>{producer.cedula}</td>
                  <td>{producer.name} {producer.lastname1} {producer.lastname2}</td>
                  <td>{producer.phoneNumber}</td>
                  <td>{producer.email}</td>
                  <td>{producer.address}</td>
                  <td>{producer.bankAccount}</td>
                  <td>

                    <Button
                  onClick={() => navigate(`/editProducer/${producer.id}`)}
                  size='sm'
                  style={{...buttonStyle, marginLeft: '5px',}}
                  onMouseOver={(e) => e.target.style.backgroundColor = buttonStyle.hover.backgroundColor}
                  onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                  >
                  Editar
                  </Button>

                  <Button
                  onClick={() => showAlert(producer.id)}
                  size='sm'
                  style={{...buttonStyle, marginLeft: '5px',}}
                  onMouseOver={(e) => e.target.style.backgroundColor = buttonStyle.hover.backgroundColor}
                  onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                  >
                  Eliminar
                  </Button> 

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

export default listProducers;
