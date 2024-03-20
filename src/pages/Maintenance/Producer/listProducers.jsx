import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { getProducers } from "../../../services/producerService";
import { deleteProducerService } from "../../../services/producerService";
import { Table, Container, Col, Row, Button } from "react-bootstrap";
import AddProducerModal from "./actions/addProducerModal.jsx";
import { Form } from "react-bootstrap";
import EditProducerModal from "./actions/editProducerModal";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";

import "../../../css/Pagination.css";
import "../../../css/StylesBtn.css";
const listProducers = () => {
  const {
    data: Producers,
    isLoading: ProducersLoading,
    isError: ProducersError,
  } = useQuery("producer", getProducers);

  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const recordsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);

  if (ProducersLoading)
    return (
      <div className="Loading">
        <ul>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    );

  if (ProducersError) return <div>Error</div>;

  const filteredBySearch = Producers.filter(
    (producer) =>
      producer.name
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      producer.cedula
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      producer.phoneNumber
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const offset = currentPage * recordsPerPage;
  const paginatedProducers = filteredBySearch.slice(
    offset,
    offset + recordsPerPage
  );

  const pageCount = Math.ceil(Producers.length / recordsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };


  const showAlert = (id) => {
    swal({
      title: "Eliminar",
      text: "¿Está seguro de que desea eliminar este productor?",
      icon: "warning",
      buttons: ["Cancelar", "Aceptar"],
    }).then((answer) => {
      if (answer) {
        deleteProducerService(id).then(
          swal({
            title: "Eliminado",
            text: "El productor ha sido eliminado",
            icon: "success",
          }).then(function () {
            window.location.reload();
          })
        );
      }
    });
  };

  return (
    <Container>
      <div className="table-container">
        <h2 className="table-title">Productores</h2>
        <hr className="divider" />

        <br></br>

        <Form>
          <Row className="mb-3 filters-container">
            <Col xs={6} md={6}>
              <AddProducerModal />
            </Col>
            <Col xs={0} md={0}></Col>
            <Col xs={12} md={3}>
              <Form.Control
                type="text"
                placeholder="Buscar coincidencias"
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input"
              />
            </Col>
          </Row>
        </Form>

        <Col xs={12} md={2} lg={12}>
          {Producers ? (
            <Row>
              <Table className="Table" responsive>
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
                      <td>
                        {producer.name} {producer.lastname1}{" "}
                        {producer.lastname2}
                      </td>
                      <td>{producer.phoneNumber}</td>
                      <td>{producer.email}</td>
                      <td>{producer.address}</td>
                      <td>{producer.bankAccount}</td>
                      <td>
                        <div className="BtnContainer">
                          <EditProducerModal props={producer} />

                          <Button
                            className="BtnRed"
                            onClick={() => showAlert(producer.id)}
                            size="sm"
                          >
                            <MdDelete />
                          </Button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="Pagination-Container">
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
              </div>
            </Row>
          ) : (
            "Cargando"
          )}
        </Col>
      </div>
    </Container>
  );
};

export default listProducers;
