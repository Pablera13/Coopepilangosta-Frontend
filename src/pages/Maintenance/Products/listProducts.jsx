import React, { useState, useEffect, useRef } from 'react';
import './listProducts.css'
import { useQuery } from "react-query";
import { getProducts } from '../../../services/productService';
import { NavLink } from 'react-router-dom'
import { deleteProduct } from '../../../services/productService';
import { Table, Container, Col, Row, Button } from 'react-bootstrap';
import AddProductModal from './operations/addProductModal.jsx'
import { Form } from 'react-bootstrap';
import EditProductModal from './operations/editProductModal.jsx'
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";


const listProducts = () => {

  const { data: Products, isLoading: ProductsLoading, isError: ProductsError } = useQuery('product', getProducts);
  if (Products) { console.log(Products) }

  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState(null);

  const navigate = useNavigate()


  const recordsPerPage = 6;
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
    console.log("paginatedProducts = " + paginatedProducts.length)
  };


  const showAlert = (id) => {
    swal({
      title: 'Eliminar',
      text: '¿Está seguro de que desea eliminar esta valoración?',
      icon: 'warning',
      buttons: ['Cancelar', 'Aceptar'],
    }).then((answer) => {
      if (answer) {
        deleteProduct(id);
        swal({
          title: 'Eliminado',
          text: 'La valoración ha sido eliminada',
          icon: 'success',
        });
        setTimeout(function () {
          console.log("Review eliminada" + id)
          window.location.reload();
        }, 2000);
      }
    });
  };

  return (

    <Container>
      <h2 className="text-center">Productos</h2>
      <br></br>
        
        <Form>
          <Row className="mb-3">

          <Col md={3}>
          <AddProductModal />
          </Col>

            <Col md={3}>
              <Form.Label>Buscar</Form.Label>
              <Form.Control
                type="text"
                placeholder="Por nombre, unidad comercial o estado..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>

            <Col md={3}>
              <Form.Label>Filtrar por estado</Form.Label>
              <Form.Select onChange={(e) => setFilterState(e.target.value === "true" ? true : e.target.value === "false" ? false : null)}>
                <option value="">Todos</option>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </Form.Select>
            </Col>

          </Row>
        </Form>


      <Col xs={8} md={2} lg={12}>
        {Products ? (
          <Row>
            <Table className='TableProducts' striped bordered hover variant="light" >
              <thead>
                <tr className='TblProducts'>
                  <th>Código</th>
                  <th>Nombre</th>
                  {/* <th>Descripción</th> */}
                  <th>Unidad</th>
                  <th>IVA</th>
                  <th>Margen ganancia</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              {paginatedProducts.map((product) => (
                <tr key={product.id}>
                  {/* <td><img className='imgProduct'
                    src={product.image}
                  /></td> */}
                  <td>{product.code}</td>
                  <td>{product.name}</td>
                  <td>{product.unit}</td>
                  <td>{product.iva}%</td>
                  <td>{product.margin}%</td>
                  <td>{product.state === true ? 'Activo' : 'De baja'}</td>
                  <td>
                    <EditProductModal props={product} />

                    <Button className='BtnTrashProducts' onClick={() => showAlert(product.id)}>
                      Eliminar <MdDelete />
                    </Button>

                  </td>
                </tr>
              ))}

            </Table>
            <div className='Pagination-Container'>
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
            </div>

          </Row>
        ) : (
          "Cargando"
        )}
      </Col>
    </Container>
  );
};

export default listProducts;