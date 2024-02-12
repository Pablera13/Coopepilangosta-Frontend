import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import { getCategories } from '../../../services/categoryService';
import { Table, Container, Col, Row, Button } from 'react-bootstrap';
import { deleteCategory } from '../../../services/categoryService';
import AddCategoryModal from './actions/addCategoryModal';
import { Table, Button } from 'react-bootstrap';
import { Form, Row, Col } from 'react-bootstrap';
import EditCategoryModal from './actions/editCategoryModal';
import ReactPaginate from 'react-paginate';
import styles from './listCategories.css'
import { useNavigate } from 'react-router-dom';

const listCategories = () => {
  const { data: Categories, isLoading: CategoriesLoading, isError: CategoriesError } = useQuery('category', getCategories);

  const [searchTerm, setSearchTerm] = useState('');



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

  if (CategoriesLoading) return <div>Loading...</div>;

  if (CategoriesError) return <div>Error</div>;

  const filteredBySearch = Categories.filter(
    (category) =>
    category.name.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const offset = currentPage * recordsPerPage;
  const paginatedCategories = filteredBySearch.slice(offset, offset + recordsPerPage);

  const pageCount = Math.ceil(Categories.length / recordsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // const deleteCategoryItem = async (id) => {
  //   console.log("Id de la categoría: ", id);
  //   await deleteCategory(id);
  //   window.location.reload();
  // };

  const showAlert = (id) => {
    swal({
      title: 'Eliminar',
      text: '¿Está seguro de que desea eliminar esta valoración?',
      icon: 'warning',
      buttons: ['Cancelar', 'Aceptar'],
    }).then((answer) => {
      if (answer) {
        deleteCategory(id);
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
      <h2 className="text-center">Categorías</h2>
      <div className='buttons'>
        <AddCategoryModal />

        <Form>
        <Row className="mb-3">
          <Col md={3}>
            <Form.Label>Buscar:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Buscar categoria..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
        </Row>
      </Form>

        </div>
      <Col xs={8} md={2} lg={12}>
        {Categories ? (
          <Row>
            <Table striped bordered hover variant="light">
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
                onClick={() => showAlert(category.id)}
                size='sm'
                style={{ ...buttonStyle, marginLeft: '5px', }}
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

export default listCategories;
