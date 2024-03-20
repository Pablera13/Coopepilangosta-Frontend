import React from 'react'
import { useState } from 'react';
import './listInventories.css';
import { NavLink } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getCoffee } from '../../../services/productService';
import { getCategories } from '../../../services/categoryService';
import { Table,Container,Col,Row, Form } from 'react-bootstrap';
import AddInventoryModal from './actions/addInventoriesModal';
import ReactPaginate from 'react-paginate';
import {useNavigate} from 'react-router-dom';

const ListInventories = () => {
  const { data: categoriesData, isLoading: categoriesLoading, isError: categoriesError } = useQuery('categories', getCategories);
  const { data: productsData, isLoading: productsLoading, isError: productsError } = useQuery('products', getCoffee);

  
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState(null);

    if (categoriesLoading || productsLoading) {
      return <div>Cargando...</div>;
    }
  
    if (categoriesError || productsError) {
      return <div>Error al cargar los datos.</div>;
    }

  const recordsPerPage = 10;

  const filteredBySearch = productsData.filter(product => {
    const matchesSearchTerm = (
      product.code.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name.normalize("NFD")
      .replace(/[\u0300-\u036f\s]/g, "")
      .trim().toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.unit.toLowerCase().includes(searchTerm.replace(/\s/g, "").toLowerCase())
    );
    const matchesState = filterState === null || product.state === filterState;
    return matchesSearchTerm && matchesState;
  });

  const offset = currentPage * recordsPerPage;
  const paginatedProducts = filteredBySearch.slice(offset, offset + recordsPerPage);

  const pageCount = Math.ceil(productsData.length / recordsPerPage);
    
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };
  
    return (
      <Container>
      <div className="table-container">
        <h2 className="table-title">Existencias</h2>
        <hr className="divider" />

        <br></br>

        <Form>
          <Row className="mb-3 filters-container">
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


        <Col xs={12} md={10} lg={12}>
        {
        productsData !=null?(
          <Row>
            <Table className='Table' striped bordered hover variant="light" responsive>
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Unidad</th>
                  <th>Existencias</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              {
                paginatedProducts.map((product) => (
                  <tr key={product.id}>
                    <td><img  className="img-sm border"
                    src={product.image}
                  /></td>
                    <td>{product.code}</td>
                    <td>{product.name}</td>
                    <td>{product.unit}</td>
                    <td>{product.stock}</td>
                    <td>
                        <AddInventoryModal props={product} />
                      </td>
                    </tr>
                  ))
                }
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
          )
            : ("Cargando")
        }

      </Col>
      </div>
    </Container>
  );
};
  
export default ListInventories;

