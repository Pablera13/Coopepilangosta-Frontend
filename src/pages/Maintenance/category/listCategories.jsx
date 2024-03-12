import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { getCategories } from "../../../services/categoryService";
import { Table, Container, Col, Row, Button } from "react-bootstrap";
import { deleteCategory } from "../../../services/categoryService";
import AddCategoryModal from "./actions/addCategoryModal";
import { Form } from "react-bootstrap";
import EditCategoryModal from "./actions/editCategoryModal";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import "../../../css/Pagination.css";
import "../../../css/StylesBtn.css";

const listCategories = () => {
  const {
    data: Categories,
    isLoading: CategoriesLoading,
    isError: CategoriesError,
  } = useQuery("category", getCategories);

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const recordsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);

  if (CategoriesLoading)
    return (
      <div className="Loading">
        <ul>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    );

  if (CategoriesError) return <div>Error</div>;

  const filteredBySearch = Categories.filter((category) =>
    category.name.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const offset = currentPage * recordsPerPage;
  const paginatedCategories = filteredBySearch.slice(
    offset,
    offset + recordsPerPage
  );

  const pageCount = Math.ceil(Categories.length / recordsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };


  const showAlert = (id) => {
    swal({
      title: "Eliminar",
      text: "¿Está seguro de que desea eliminar esta categoría?",
      icon: "warning",
      buttons: ["Cancelar", "Aceptar"],
    }).then((answer) => {
      if (answer) {
        deleteCategory(id);
        swal({
          title: "Eliminado",
          text: "La categoría ha sido eliminada",
          icon: "success",
        });
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      }
    });
  };

  //
  return (
    <Container>
      <div className="table-container">
        <h2 className="table-title">Categorías</h2>
        <hr className="divider" />

        <Form>
          <Row className="mb-3 filters-container">
            <Col xs={6} md={6}>
              <AddCategoryModal />
            </Col>
            <Col xs={0} md={0}>
            </Col>
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
          {Categories ? (
            <Row>
              <Table
                className="Table"
                striped
                bordered
                hover
                variant="light"
                responsive
              >
                <thead>
                  <tr>
                    <th>Nombre de la categoría</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                {paginatedCategories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>
                      <EditCategoryModal props={category} />

                      <Button
                        className="BtnRed"
                        onClick={() => showAlert(category.id)}
                        size="sm"
                      >
                        <MdDelete />
                      </Button>
                    </td>
                  </tr>
                ))}
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
  );
};

export default listCategories;
