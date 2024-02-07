import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from "react-query";
import { getProducts } from '../../../services/productService';
import { NavLink } from 'react-router-dom'
import { deleteProduct } from '../../../services/productService';
import { Table, Container, Col, Row, Button } from 'react-bootstrap';
import AddProductModal from './operations/addProductModal.jsx'
import { Form } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import {useNavigate} from 'react-router-dom';

import './listProducts.css'

const listProducts = () => {

  const { data: Products, isLoading: ProductsLoading, isError: ProductsError } = useQuery('product', getProducts);
  if (Products) { console.log(Products) }

  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState(null);

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

  if (ProductsLoading)
    return <div>Loading...</div>

  if (ProductsError)
    return <div>Error</div>

    const filteredBySearch = Products.filter(product => {
      const matchesSearchTerm = (
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.unit.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesState = filterState === null || product.state === filterState;
      return matchesSearchTerm && matchesState;
    });

  const offset = currentPage * recordsPerPage;
  const paginatedProducts = filteredBySearch.slice(offset, offset + recordsPerPage);

  const pageCount = Math.ceil(Products.length / recordsPerPage);

  //const paginatedFilter = filteredBySearch.slice(offset, offset + recordsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const deleteproducto = (id) => {

    console.log("Id del producto: ", id);
    deleteProduct(id);

  }

  const showAlert = (id) => {
    swal({
      title: "Eliminar",
      text: "Esta seguro que desea eliminar este producto?",
      icon: "warning",
      buttons: ["Cancelar", "Aceptar"]
    }).then(answer => {
      if (answer) {
        swal({
          title: 'Eliminado!',
          text: `El producto ha sido eliminada`,
          icon: "success"

        })
        setTimeout(function () {
          deleteproducto(id);
          window.location.reload();
        }, 2000)

      }
    })
  }

  return (

    <Container>
      <h2 className="text-center">Productos</h2>
      <div className='buttons'>
        <AddProductModal />
        <Form>
          <Row className="mb-3">
            <Col md={3}>
              <Form.Label>Buscar:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Por nombre, unidad comercial o estado..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Label>Filtrar por estado:</Form.Label>
              <Form.Select onChange={(e) => setFilterState(e.target.value === "true" ? true : e.target.value === "false" ? false : null)}>
                <option value="">Todos</option>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </Form.Select>
            </Col>
          </Row>
        </Form>
      </div>


      <Col xs={8} md={2} lg={12}>
        {Products ? (
          <Row>
            <Table striped bordered hover variant="light">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Unidad comercial</th>
                  <th>IVA</th>
                  <th>Margen de ganancia</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              {paginatedProducts.map((product) => (
                <tr key={product.id}>
                  <td><img className='imgProduct'
                    src={product.image}
                  /></td>
                  <td>{product.code}</td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.unit}</td>
                  <td>{product.iva}%</td>
                  <td>{product.margin}%</td>
                  <td>{product.state === true ? 'Activo' : 'De baja'}</td>
                  <td>

                  <Button
                  onClick={() => navigate(`/editProduct/${product.id}`)}
                  size='sm'
                  style={{...buttonStyle, marginLeft: '5px',}}
                  onMouseOver={(e) => e.target.style.backgroundColor = buttonStyle.hover.backgroundColor}
                  onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                  >
                  Editar
                  </Button>

                  <Button
                  onClick={() => showAlert(product.id)}
                  size='sm'
                  style={{...buttonStyle, marginLeft: '5px',}}
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
              previousLabel={"Anterior"}
              nextLabel={"Siguiente"}
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
    </Container>
  );
};

export default listProducts;