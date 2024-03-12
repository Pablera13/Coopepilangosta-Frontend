import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { getWarehouse } from "../../../services/warehouseService";
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

  if (WarehousesLoading)
    return (
      <div className="Loading">
        <ul>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    );

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
      <div className="table-container">
        <h2 className="table-title">Bodegas</h2>
        <hr className="divider" />

        <br></br>

        <Form>
          <Row className="mb-3 filters-container">
            <Col xs={12} md={6}>
              <AddWarehouseModal />
            </Col>
            <Col xs={12} md={3}>
              <Form.Control
                type="text"
                placeholder="Buscar coincidencias"
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input"
              />
            </Col>
            <Col xs={12} md={3}>
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
                className="filter-input"
                placeholder="Filtrar por estado"
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
              <Table className="Table" responsive>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th>Dirección</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {" "}
                  {paginatedWarehouses.map((warehouse) => (
                    <tr key={warehouse.id}>
                      <td>{warehouse.code}</td>
                      <td>{warehouse.description}</td>
                      <td>{warehouse.address}</td>
                      <td>{warehouse.state ? "Activo" : "Inactivo"}</td>
                      <td>
                        <div className="BtnContainer">
                          <EditWarehouseModal props={warehouse} />
                          <Button
                            className="BtnRed"
                            onClick={() => showAlert(warehouse.id)}
                            size="sm"
                          >
                            <MdDelete />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}{" "}
                </tbody>
              </Table>
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
          ) : (
            "Cargando"
          )}
        </Col>
      </div>
    </Container>
  );
};

export default listWarehouse;
