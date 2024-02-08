import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import { getWarehouse } from '../../../services/warehouseService';
import { NavLink } from 'react-router-dom';
import { deleteWarehouse } from '../../../services/warehouseService';
import swal from 'sweetalert';
import { Table, Container, Col, Row, Button } from 'react-bootstrap';
import AddWarehouseModal from './actions/addWarehouseModal';
import EditWarehouseModal from './actions/editWarehouseModal';


import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';

import syles from '../Warehouse/listWarehouse.css';

const listWarehouse = () => {
  const { data: Warehouses, isLoading: WarehousesLoading, isError: WarehousesError } = useQuery('warehouse', getWarehouse);

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

  if (WarehousesLoading) return <div>Loading...</div>;

  if (WarehousesError) return <div>Error</div>;

  const offset = currentPage * recordsPerPage;
  const paginatedWarehouses = Warehouses.slice(offset, offset + recordsPerPage);

  const pageCount = Math.ceil(Warehouses.length / recordsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // const deletewarehouse = (id) => {
  //   console.log('Id de la bodega: ', id);
  //   deleteWarehouse(id);
  // };

  const showAlert = (id) => {
    swal({
      title: 'Eliminar',
      text: '¿Está seguro de que desea eliminar esta valoración?',
      icon: 'warning',
      buttons: ['Cancelar', 'Aceptar'],
    }).then((answer) => {
      if (answer) {
        deleteWarehouse(id);
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
      <h2 className="text-center">Bodegas</h2>
      <div className="buttons">
        <AddWarehouseModal />
      </div>
      <Col xs={8} md={2} lg={12}>
        {Warehouses ? (
          <Row>
            <Table striped bordered hover variant="light">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descripción</th>
                  <th>Dirección</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              {paginatedWarehouses.map((warehouse) => (
                <tr key={warehouse.id}>
                  <td>{warehouse.code}</td>
                  <td>{warehouse.description}</td>
                  <td>{warehouse.address}</td>
                  <td>{warehouse.state ? 'Activo' : 'Inactivo'}</td>
                  <td>

                    {/* <Button
                  onClick={() => navigate(`/editWarehouse/${warehouse.id}`)}
                  size='sm'
                  style={{...buttonStyle, marginLeft: '5px',}}
                  onMouseOver={(e) => e.target.style.backgroundColor = buttonStyle.hover.backgroundColor}
                  onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                  >
                  Editar
                  </Button> */}

                    <EditWarehouseModal props={warehouse}/>

                    <Button
                      onClick={() => showAlert(warehouse.id)}
                      size='sm'
                      style={{ ...buttonStyle, marginLeft: '5px', }}
                      onMouseOver={(e) => e.target.style.backgroundColor = buttonStyle.hover.backgroundColor}
                      onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                    >
                      Eliminar
                    </Button>
                  </td>

                </tr>
              ))}
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
          'Cargando'
        )}
      </Col>
    </Container>
  );
};

export default listWarehouse;
