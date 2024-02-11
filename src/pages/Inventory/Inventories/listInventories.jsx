import React from 'react'
import './listInventories.css';
import { NavLink } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getProducts } from '../../../services/productService';
import { getCategories } from '../../../services/categoryService';
import { Table, Container, Col, Row, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AddInventoryModal from './actions/addInventoriesModal';


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


  return (
    <Container>
      <h2 className="text-center">Existencias</h2>
      <br></br>
      <Col xs={8} md={10} lg={12}>
        {
          productsData != null ? (
            <Row>
              <Table striped bordered hover variant="light">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Código</th>
                    <th>Nombre</th>
                    {/* <th>Descripción</th> */}
                    <th>Unidad</th>
                    <th>Existencias</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                {
                  productsFiltered.map((product) => (
                    <tr key={product.id}>
                      <td><img className='imgProduct'
                        src={product.image}
                      /></td>
                      <td>{product.code}</td>
                      <td>{product.name}</td>
                      {/* <td>{product.description}</td> */}
                      <td>{product.unit}</td>
                      <td>{product.stock}</td>
                      <td>

                        {/* <Button
                  onClick={() => navigate(`/addInventories/${product.id}`)}
                  size='sm'
                  style={{...buttonStyle, marginLeft: '5px',}}
                  onMouseOver={(e) => e.target.style.backgroundColor = buttonStyle.hover.backgroundColor}
                  onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                  >
                  Editar
                  </Button> */}

                        <AddInventoryModal props={product} />


                      </td>
                    </tr>
                  ))
                }
              </Table>
            </Row>
          )
            : ("Cargando")
        }

      </Col>
    </Container>
  );
};

export default ListInventories;

