import React from "react";
import { useState } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import { useQuery } from "react-query";
import { getCostumers } from "../../../services/costumerService";
import DetailsCostumer from "./detailsCostumer";
import Styles from "./listCostumers.css";
import VerifyCostumer from "../costumers/actions/verifyCostumer";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import "../../../css/Pagination.css";
import "../../../css/StylesBtn.css";
import { BsBox2 } from "react-icons/bs";

const listCostumers = () => {
  const {
    data: costumers,
    isLoading: costumersloading,
    IsError: costumersError,
  } = useQuery("costumer", getCostumers);
  //if(costumers){console.log(costumers)}

  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState(null);

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);

  if (costumersloading) return <div>Loading...</div>;

  if (costumersError) return <div>Error</div>;

  const filteredBySearch = costumers?.filter((costumer) => {
    const matchesSearchTerm =
      costumer.cedulaJuridica
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      costumer.name
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      costumer.province
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      costumer.district
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesVerify =
      filterState === null || costumer.verified === filterState;
    return matchesSearchTerm && matchesVerify;
  });

  const recordsPerPage = 10;

  let paginatedCustomers = [];
  if (filteredBySearch) {
    const offset = currentPage * recordsPerPage;
    paginatedCustomers = filteredBySearch.slice(
      offset,
      offset + recordsPerPage
    );
  }
  const pageCount = Math.ceil(costumers.length / recordsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <>
      <Container>
        <div className="table-container">
          <h2 className="table-title">Clientes</h2>
          <hr className="divider" />

          <br />

          <Form>
            <Row className="mb-3 filters-container">
              <Col xs={0} md={0}></Col>
              <Col xs={12} md={3}>
                <Form.Control
                  type="text"
                  placeholder="Buscar coincidencias"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="filter-input"
                />
              </Col>
              <Col md={3}>
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
                  <option value="true">Verificado</option>
                  <option value="false">No Verificado</option>
                </Form.Select>
              </Col>
            </Row>
          </Form>
          <Col xs={12} md={2} lg={12}>
            {costumers ? (
              <Row>
                <Table className="Table" responsive>
                  <thead>
                    <tr>
                      <th>Cédula</th>
                      <th>Nombre</th>
                      <th>Provincia</th>
                      <th>Cantón</th>
                      <th>Distrito</th>
                      <th>Verificado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costumers != null
                      ? paginatedCustomers.map((costumer) => (
                          <tr key={costumer.id}>
                            <td>{costumer.cedulaJuridica}</td>
                            <td>{costumer.name}</td>
                            <td>{costumer.province}</td>
                            <td>{costumer.canton}</td>
                            <td>{costumer.district}</td>
                            <td>
                              {costumer.verified == true
                                ? "Verificado"
                                : "No verificado"}
                            </td>
                            <td>
                              <div className="BtnContainer">
                                <DetailsCostumer props={costumer} />
                                <VerifyCostumer props={costumer} />
                                {costumer.verified == true ? (
                                  <Button
                                    className="BtnBrown"
                                    onClick={() =>
                                      navigate(
                                        `/listProductCostumer/${costumer.name}/${costumer.id}`
                                      )
                                    }
                                  >
                                 <BsBox2 />
                                  </Button>
                                ) : (
                                  ""
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      : ""}
                  </tbody>
                </Table>
                <ReactPaginate
                  previousLabel={"<"}
                  nextLabel={">"}
                  breakLabel={"..."}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages pagination"}
                  activeClassName={"active"}
                />
              </Row>
            ) : (
              "Cargando"
            )}
          </Col>
        </div>
      </Container>
    </>
  );
};

export default listCostumers;
