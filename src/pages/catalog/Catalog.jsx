import React, {useRef, useState, useMemo, useCallback } from "react";
import { Row, Col, Container, Card, Button } from "react-bootstrap";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { useQuery } from "react-query";
import { getProducts } from "../../services/productService";
import "./Catalog.css";
import { getCategories } from "../../services/categoryService";
import Select from "react-select";
import { NavLink } from "react-router-dom";

const catalog = () => {
  const { data, isLoading, isError } = useQuery("product", getProducts);
  const { data: Categories, isLoading: CategoriesLoading, isError: CategoriesError } = useQuery("category", getCategories);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const searchValue = useRef();

  const optionsSelect = useMemo(() => {
    let options = [];
    if (Categories) {
      options = Categories.map(category => ({
        value: category.id,
        label: category.name
      }));
      options.unshift({ value: 0, label: "Todos los productos" });
    }
    return options;
  }, [Categories]);

  const handleSearch = useCallback(() => {
    setSearch(searchValue.current.value);
  }, []);

  const resetFilter = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  const products = useMemo(() => {
    let filteredProducts = [];
    if (data && Array.isArray(data)) {
      filteredProducts = [...data];
      if (selectedCategory && selectedCategory.value !== 0) {
        filteredProducts = filteredProducts.filter(product => product.categoryId === selectedCategory.value);
      }
      if (search) {
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(search.toLowerCase())
        );
      }
    }
    return filteredProducts;
  }, [data, search, selectedCategory]);
  

  if (isLoading)
    return (
      <div className="Loading">
        <ul>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    );

  if (isError) return <div>Error</div>;

  return (
    <>
      <Container>
        <Row className="searchContainer gap-2">
          <Col xs={12} sm={12} md={3} lg={3}>
            <Select
              placeholder="Filtrar por categoría"
              options={optionsSelect}
              onChange={setSelectedCategory}
              value={selectedCategory}
            ></Select>
          </Col>
          <Col xs={12} sm={12} md={4} lg={2}>
            <input
              type="text"
              placeholder="Búsqueda..."
              ref={searchValue}
              onChange={handleSearch}
              className="form-control"
              style={{ height: "100%" }}
            />
          </Col>
        </Row>
        <Row xs={4} md={4} lg={8} xl={12}>
          {products.length > 0 ? (
            products.map(product => (
              <Col xs={11} md={6} lg={3} key={product.id}>
                <Card className="Customcard">
                  <Card.Img variant="top" src={product.image} className="custom-card-img" />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>
                      <strong style={{ fontSize: "100%" }}>{product.unit}</strong>
                    </Card.Text>
                    <Card.Text>{product.description.slice(0, 50)}...</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className="BtnContainer">
                      <Button className="BtnDetail" href={`/ProductDetail/${product.categoryId}/${product.id}`}>
                        Detalle
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          ) : (
            <div>Sin productos</div>
          )}
        </Row>
      </Container>
    </>
  );
};

export default catalog;
