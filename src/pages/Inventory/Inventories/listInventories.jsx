import React from 'react'
import { useState } from 'react';
import './listInventories.css';
import { NavLink } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getProducts } from '../../../services/productService';
import { getCategories } from '../../../services/categoryService';
import { Table,Container,Col,Row, Button } from 'react-bootstrap';
import AddInventoryModal from './actions/addInventoriesModal';
import ReactPaginate from 'react-paginate';
import {useNavigate} from 'react-router-dom';

const ListInventories = () => {
  const { data: categoriesData, isLoading: categoriesLoading, isError: categoriesError } = useQuery('categories', getCategories);
  const { data: productsData, isLoading: productsLoading, isError: productsError } = useQuery('products', getProducts);

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

  const [currentPage, setCurrentPage] = useState(0);

    if (categoriesLoading || productsLoading) {
      return <div>Cargando...</div>;
    }
  
    if (categoriesError || productsError) {
      return <div>Error al cargar los datos.</div>;
    }
  
    let productsFiltered = [];

    if (productsData != null) {
      productsFiltered = productsData.filter((product) => {
       const category = categoriesData.find((category) => category.id === product.categoryId);
       return category && (category.name.normalize("NFD").toLowerCase().startsWith('caf') || category.name.normalize("NFD").toLowerCase().startsWith('materia prima'));
     });
 } console.log(productsFiltered);

  const recordsPerPage = 10;

  const offset = currentPage * recordsPerPage;
  const paginatedProducts = productsFiltered.slice(offset, offset + recordsPerPage);
  const pageCount = Math.ceil(productsData.length / recordsPerPage);
    
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };
  
    return (
      <Container>
        <h2 className="text-center">Existencias</h2>
        <br></br>
        <Col xs={8} md={10} lg={12}>
        {
        productsData !=null?(
          <Row>
            <Table striped bordered hover variant="light">
              <thead>
                <tr>
                  {/* <th>Imagen</th> */}
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
                    {/* <td><img className='imgProduct'
                    src={product.image}
                  /></td> */}
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
          )
            : ("Cargando")
        }

      </Col>
    </Container>
  );
};
  
export default ListInventories;

