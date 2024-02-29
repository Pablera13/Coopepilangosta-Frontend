import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { getWarehouse } from "../../../services/warehouseService";
import { NavLink } from "react-router-dom";
import { deleteWarehouse } from "../../../services/warehouseService";
import swal from "sweetalert";
import { Table, Container, Col, Row, Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import AddWarehouseModal from "./actions/addWarehouseModal";
import EditWarehouseModal from "./actions/editWarehouseModal";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import "../../../css/Pagination.css";
import "../../../css/StylesBtn.css";

const listWarehouse = () => {
  const {
    data: Warehouses,
    isLoading: WarehousesLoading,
    isError: WarehousesError,
  } = useQuery("warehouse", getWarehouse);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState(null);

  const navigate = useNavigate();

  const recordsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);

  if (WarehousesLoading) return <div>Loading...</div>;

  if (WarehousesError) return <div>Error</div>;

  const filteredBySearch = Warehouses.filter((warehouse) => {
    const matchesSearchTerm =
      warehouse.code
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      warehouse.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.address
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesState =
      filterState === null || warehouse.state === filterState;
    return matchesSearchTerm && matchesState;
  });

  const offset = currentPage * recordsPerPage;
  const paginatedWarehouses = filteredBySearch.slice(
    offset,
    offset + recordsPerPage
  );

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
      title: "Eliminar",
      text: "¿Está seguro de que desea eliminar esta valoración?",
      icon: "warning",
      buttons: ["Cancelar", "Aceptar"],
    }).then((answer) => {
      if (answer) {
        deleteWarehouse(id);
        swal({
          title: "Eliminado",
          text: "La valoración ha sido eliminada",
          icon: "success",
        });
        setTimeout(function () {
          console.log("Review eliminada" + id);
          window.location.reload();
        }, 2000);
      }
    });
  };

  return (
    <Container>
      <h2 className="text-center">Bodegas</h2>
      <br></br>

      {/* <div className="buttons">
        <AddWarehouseModal />
      </div> */}

      <Form>
        <Row className="mb-3">
          <Col md={3}>
            <AddWarehouseModal />
          </Col>

          <Col md={3}>
            <Form.Label>Buscar</Form.Label>
            <Form.Control
              type="text"
              placeholder="Por código, descripción, dirección o estado..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>

          <Col md={3}>
            <Form.Label>Filtrar por estado</Form.Label>
            <Form.Select
              onChange={(e) =>
                setFilterState(
                  e.target.value === "true"
                    ? true
                    : e.target.value === "false"
                    ? false
                    : null
                )
              }
            >
              <option value="">Todos</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      <Col xs={12} md={2} lg={12}>
        {Warehouses ? (
          <Row>
            <Table className='Table' striped bordered hover variant="light"responsive >
              <thead>
                <tr >
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
                  <td>{warehouse.state ? "Activo" : "Inactivo"}</td>
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

                    <EditWarehouseModal props={warehouse} />

                    <Button
                      className="BtnRed"
                      onClick={() => showAlert(warehouse.id)}
                      size="sm"
                    >
                      Eliminar <MdDelete />
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
          "Cargando"
        )}
      </Col>
    </Container>
  );
};

export default listWarehouse;
