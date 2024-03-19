import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Container, Card, Button, Fade } from "react-bootstrap";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { useQuery } from "react-query";
import { getProducts } from "../../services/productService";
import "./Catalog.css";
import { getCategories } from "../../services/categoryService";
import Select from "react-select";
import { NavLink } from "react-router-dom";

const catalog = () => {
  //Trae los productos y categorias
  const { data, isLoading, isError } = useQuery("product", getProducts);
  const {
    data: Categories,
    isLoading: CategoriesLoading,
    isError: CategoriesError,
  } = useQuery("category", getCategories);
  let products = [];
  const searchValue = useRef();
  const [search, setSearch] = useState();
  const [SelectedCategory, setSelectedCategory] = useState();

  //const [UserRole,setUserRole] = useState('');

  var optionsSelect = [];

  if (Categories) {
    Categories.map(async(category) => {
      let categoryObject = {
      value: category.id,
      label: category.name,}
      optionsSelect.push(categoryObject)
      });

    let nofilterOption = {
      value: 0, 
      label: "Todos los productos"
    }
    optionsSelect.unshift(nofilterOption)
  }

  function handleSearch() {
    setSearch(searchValue.current.value);
  }

  if (!SelectedCategory) {
    products = data;
  } else {

    if(SelectedCategory.value == 0){
      products = data
    } else {
    products = data.filter(
      (product) => product.categoryId == SelectedCategory.value
    )};
  }

  if (search) {
    products = products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(searchValue.current.value.toLowerCase())
    );
  }

  const resetFilter = () => {
    setSelectedCategory(null);
  };

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
      <br />

      <Container>
        <Row className="searchContainer gap-2">
          <Col xs={12} sm={12} md={3} lg={3}>
            <Select
              placeholder="Filtrar por categoría"
              options={optionsSelect}
              onChange={(selected) => setSelectedCategory(selected)}
            ></Select>
          </Col>

          <Col xs={12} sm={12} md={4} lg={2}>
            <input
              type="text"
              placeholder="Búsqueda..."
              ref={searchValue}
              onChange={handleSearch}
              className="form-control"
              style={{height:"100%"}}
            />
          </Col>
        </Row>
        <Row xs={4} md={4} lg={8} xl={12}>
          {products != null
            ? products.map((product) => (
                <>
                  {product.state == true ? (
                    <Col xs={11} md={6} lg={3} key={product.id}>
                      <Card className="Customcard">
                        <Card.Img
                          variant="top"
                          src={product.image}
                          className="custom-card-img"
                        />
                        <Card.Body>
                          <Card.Title>{product.name}</Card.Title>
                          {/* <Card.Text><strong>{product.name}</strong></Card.Text> */}
                          <Card.Text>
                            <strong style={{ fontSize: "100%" }}>
                              {product.unit}
                            </strong>
                          </Card.Text>
                          {/* <Card.Text class="text-success"><b>{product.unit}</b></Card.Text> */}
                          <Card.Text>
                            {product.description.slice(0, 50)}...
                          </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                          <div className="BtnContainer">
                            <Button
                              className="BtnDetail"
                              href={`/ProductDetail/${product.categoryId}/${product.id}`}
                            >
                              Detalle
                            </Button>
                          </div>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ) : (
                    ""
                  )}
                </>
              ))
            : "Sin productos"}
        </Row>
      </Container>
    </>
  );
};

export default catalog;
