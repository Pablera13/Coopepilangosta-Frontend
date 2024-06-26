import React, { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { Row, Col, Container, Card, Button, Accordion } from "react-bootstrap";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { useQuery } from "react-query";
import { getProducts } from "../../services/productService";
import "./Catalog.css";
import "../../css/Pagination.css";
import { useNavigate } from "react-router-dom";

import { getCategories } from "../../services/categoryService";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import { dataDecrypt } from "../../utils/data-decrypt";

const catalog = () => {

  const { data, isLoading, isError } = useQuery("product", getProducts);
  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useQuery("category", getCategories);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(0);
  const searchValue = useRef();
  const navigate = useNavigate();

  const handleSearch = useCallback(() => {
    setSearch(searchValue.current.value);
    setCurrentPage(0);
  }, []);

  const handleProductsPerPageChange = useCallback((event) => {
    setProductsPerPage(parseInt(event.target.value));
    setCurrentPage(0);
  }, []);


  const filteredProducts = useMemo(() => {
    let filteredProducts = data || [];
    if (selectedCategory && selectedCategory == 0) {
      filteredProducts = data
    }

    if (selectedCategory && selectedCategory.value !== 0) {
      filteredProducts = filteredProducts.filter(product => product.categoryId === selectedCategory.value);
      setCurrentPage(0)

    }
    if (search) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.normalize("NFD").replace(/[\u0300-\u036f\s]/g, "").toLowerCase().includes(search.replace(/\s/g, "").toLowerCase())
      );
    }

    return filteredProducts;
  }, [data, search, selectedCategory]);

  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = ({ selected }) => {
    window.scroll({top})
    setCurrentPage(selected);
  };

  if (isLoading || categoriesLoading)
    return (
      <div className="Loading">
        <ul>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    );

  if (isError || categoriesError) return <div>Error</div>;

  const indexOfLastProduct = (currentPage + 1) * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);


  let categoriesOptions = []
  categoriesOptions.push({ value: 0, label: "Todos los productos" })

  if (categories) {

    let categoriesMapped = categories.map(category => ({ value: category.id, label: category.name }))
    categoriesOptions = categoriesOptions.concat(categoriesMapped)
    
  }

  return (
    <>
      <Container>
        <Accordion defaultActiveKey="0" className="Josefin">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Filtrar</Accordion.Header>
            <Accordion.Body>
              <Row className="searchContainer gap-2">
                <Col xs={12} sm={4} md={3} lg={3}>
                  <Select
                    placeholder="Filtrar por categoría"
                    options={categoriesOptions}
                    onChange={setSelectedCategory}
                    value={selectedCategory}
                  ></Select>
                </Col>
                <Col xs={12} sm={3} md={3} lg={3}>
                  <input
                    type="text"
                    placeholder="Búsqueda..."
                    ref={searchValue}
                    onChange={handleSearch}
                    className="form-control"
                    style={{ height: "100%" }}
                  />
                </Col>


                <Col xs={12} sm={4} md={5} lg={5} className="">

                  <label style={{ marginRight: "2%" }}>Productos por página</label>
                  <select className="products-per-page" value={productsPerPage} onChange={handleProductsPerPageChange}>
                    <option value={12}>12</option>
                    <option value={36}>36</option>
                    <option value={56}>56</option>
                  </select>

                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>

        </Accordion>

        <Row xs={4} md={4} lg={8} xl={12} className="custom-card-catalog-row">
          {currentProducts.length > 0 ? (
            currentProducts.map(product => (
              <Col xs={11} md={6} lg={3} key={product.id} className="custom-card-catalog-col text-center">
                <Card className="Customcard shadow rounded-2">
                  <Card.Img variant="top" src={product.image} className="custom-card-img" />
                  <Card.Body className="mt-2 p-2">
                    <Card.Title className="Playfair">{product.name}</Card.Title>
                    <Card.Text className="Josefin">
                      <strong className='Josefin' style={{ fontSize: "100%" }}>{product.unit}</strong>
                    </Card.Text>
                    <Card.Text className="Josefin">{product.description.slice(0, 45)}...</Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-white text-center pt-4" pb-3>
                      <Button className="BtnDetail" href={`/ProductDetail/${product.categoryId}/${product.id}`}>
                        Detalle
                      </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          ) : (
            <p className="infoReview Josefin">Sin Productos</p>
          )}
          <br></br>

        </Row>
        <Row className="mt-3">
          <Col>
            <div className="Pagination-Container">
              <ReactPaginate
                previousLabel={"<"}
                nextLabel={">"}
                breakLabel={"..."}
                pageCount={pageCount}
                onPageChange={handlePageChange}
                containerClassName={"pagination"}
                activeClassName={"active"}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default catalog;
