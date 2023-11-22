import React from 'react';
import { useQuery } from 'react-query';
import { getCategories } from '../../../services/categoryService';
import { NavLink } from 'react-router-dom';
import { deleteCategory } from '../../../services/categoryService';
import AddCategoryModal from './actions/addCategoryModal';
import { Table, Button } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import styles from './listCategories.css'
import {useNavigate} from 'react-router-dom';

const listCategories = () => {
  const { data: Categories, isLoading: CategoriesLoading, isError: CategoriesError } = useQuery('category', getCategories);

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
  const [currentPage, setCurrentPage] = React.useState(0);

  if (CategoriesLoading) return <div>Loading...</div>;

  if (CategoriesError) return <div>Error</div>;

  const offset = currentPage * recordsPerPage;
  const paginatedCategories = Categories.slice(offset, offset + recordsPerPage);

  const pageCount = Math.ceil(Categories.length / recordsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const deleteCategoryItem = async (id) => {
    console.log("Id de la categoría: ", id);
    await deleteCategory(id);
    window.location.reload();
  };

  const showAlert = (id) => {
    swal({
      title: "Eliminar",
      text: "¿Está seguro de que desea eliminar esta categoría?",
      icon: "warning",
      buttons: ["Cancelar", "Aceptar"],
    }).then((answer) => {
      if (answer) {
        swal({
          title: 'Eliminado!',
          text: 'La categoría ha sido eliminada',
          icon: 'success',
        });
        setTimeout(function () {
          deleteCategoryItem(id);
        }, 2000);
      }
    });
  };

  return (
    <div>
      <h2 className="text-center">Categorías</h2>
      <div className="buttons">
        <AddCategoryModal />
      </div>
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

              <Button
                  onClick={() => navigate(`/editCategory/${category.id}`)}
                  size='sm'
                  style={{...buttonStyle, marginLeft: '5px',}}
                  onMouseOver={(e) => e.target.style.backgroundColor = buttonStyle.hover.backgroundColor}
                  onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                  >
                  Editar
                  </Button>

                  <Button
                  onClick={() => showAlert(category.id)}
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
    </div>
  );
};

export default listCategories;
