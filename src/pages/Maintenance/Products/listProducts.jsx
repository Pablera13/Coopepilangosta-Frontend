import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { getProducts } from "../../../services/productService";
import { NavLink } from "react-router-dom";
import { deleteProduct } from "../../../services/productService";
import { Table, Container, Col, Row, Button } from "react-bootstrap";
import AddProductModal from "./operations/addProductModal.jsx";
import { Form } from "react-bootstrap";
import EditProductModal from "./operations/editProductModal.jsx";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import "../../../css/StylesBtn.css";
import "../../../css/Pagination.css";
import { validateAllowedPageAccess } from "../../../utils/validatePageAccess.js";
const listProducts = () => {

  useEffect(() => {
    validateAllowedPageAccess()
  }, [])
  

  const {
    data: Products,
    isLoading: ProductsLoading,
    isError: ProductsError,
  } = useQuery("product", getProducts);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState(null);

  const navigate = useNavigate();

  const recordsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(0);

  if (ProductsLoading)
    return (
      <div className="Loading">
        <ul>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    );
  if (ProductsError) return <div>Error</div>;

  const filteredBySearch = Products.filter((product) => {
    const matchesSearchTerm =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.unit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = filterState === null || product.state === filterState;
    return matchesSearchTerm && matchesState;
  });

  const offset = currentPage * recordsPerPage;
  const paginatedProducts = filteredBySearch.slice(
    offset,
    offset + recordsPerPage
  );

  const pageCount = Math.ceil(Products.length / recordsPerPage);

  //const paginatedFilter = filteredBySearch.slice(offset, offset + recordsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    console.log("paginatedProducts = " + paginatedProducts.length);
  };

  const showAlert = (id) => {
    swal({
      title: "Eliminar",
      text: "¿Está seguro de que desea eliminar este producto?",
      icon: "warning",
      buttons: ["Cancelar", "Aceptar"],
    }).then((answer) => {
      if (answer) {
        deleteProduct(id);
        swal({
          title: 'Eliminado',
          text: 'El producto ha sido eliminado',
          icon: 'success',
        }).then(function(){window.location.reload()});
        
      }
    });
  };

  return (
    <Container>
      <div className="table-container">
        <h2 className="table-title">Productos</h2>
        <hr className="divider" />

        <br></br>

        <Form>
          <Row className="mb-3 filters-container">
            <Col xs={4} md={6}>
              <AddProductModal />
            </Col>
            <Col xs={4} md={3}>
              <Form.Control
                type="text"
                placeholder="Buscar coincidencias"
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input"
              />
            </Col>
            <Col xs={4} md={3}>
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
          {Products ? (
            <Row>
              <Table className="Table" responsive>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Unidad</th>
                    <th>IVA</th>
                    <th>Margen ganancia</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {" "}
                  {paginatedProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.code}</td>
                      <td>{product.name}</td>
                      <td>{product.unit}</td>
                      <td>{product.iva}%</td>
                      <td>{product.margin}%</td>
                      <td>{product.state === true ? "Activo" : "De baja"}</td>
                      <td>
                        <div className="BtnContainer">
                          {" "}
                          <EditProductModal props={product} />
                          <Button
                            className="BtnRed"
                            onClick={() => showAlert(product.id)}
                          >
                            <MdDelete />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}{" "}
                </tbody>
              </Table>
              <div className="Pagination-Container">
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

export default listProducts;
