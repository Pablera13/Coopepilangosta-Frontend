import React from 'react'
import { useState } from 'react';
import { Container,Row,Col,Form,Table, Button} from 'react-bootstrap'
import { useQuery } from 'react-query';
import { getCostumers } from '../../../services/costumerService';
import DetailsCostumer from './detailsCostumer';
import Styles from './listCostumers.css'
import VerifyCostumer from '../costumers/actions/verifyCostumer';
import {useNavigate} from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const listCostumers = () => {
    const {data: costumers, isLoading: costumersloading, IsError: costumersError} = useQuery('costumer',getCostumers);
    //if(costumers){console.log(costumers)}

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

  const [currentPage, setCurrentPage] = useState(0);

     if (costumersloading) return <div>Loading...</div>;

     if (costumersError) return <div>Error</div>;

       const filteredBySearch = costumers?.filter(costumer => {
        const matchesSearchTerm = (
         costumer.cedulaJuridica.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
         costumer.name.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
         costumer.province.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
         costumer.district.toString().toLowerCase().includes(searchTerm.toLowerCase()) 
        );
        const matchesVerify = filterState === null || costumer.verified === filterState;
        return matchesSearchTerm && matchesVerify;
      });
       
    
    const recordsPerPage = 10;

    let paginatedCustomers = [];
    if (filteredBySearch) {

    const offset = currentPage * recordsPerPage;
    paginatedCustomers = filteredBySearch.slice(offset, offset + recordsPerPage);
    
}
  const pageCount = Math.ceil(costumers.length / recordsPerPage);
    
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <>
    <Container>
        <Row >
            <Col >
            <h2 className="text-center">Clientes</h2>
            <td></td>

            <Form>
          <Row className="mb-3">
            <Col md={3}>
              <Form.Label>Buscar:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Por Cédula Juridica, nombre, provincia o distrito..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Label>Filtrar por estado:</Form.Label>
              <Form.Select onChange={(e) => setFilterState(e.target.value === "true" ? true : e.target.value === "false" ? false : null)}>
                <option value="">Todos</option>
                <option value="true">Verificado</option>
                <option value="false">No Verificado</option>
              </Form.Select>
            </Col>
          </Row>
        </Form>

            </Col>
        </Row>
        <Row>
            <Table striped bordered hover variant="light" responsive>
                <thead className="bg-dark text-white">
                    <tr >
                        <th>Cédula jurídica</th>
                        <th>Nombre</th>
                        <th>Provincia</th>
                        <th>Cantón</th>
                        <th>Distrito</th>
                        <th>Dirección</th>
                        <th>Verificado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                {
                    costumers!=null?(
                        
                      paginatedCustomers.map((costumer)=>
                            <tr key={costumer.id}>
                                <td>{costumer.cedulaJuridica}</td>
                                <td>{costumer.name}</td>
                                <td>{costumer.province}</td>
                                <td>{costumer.canton}</td>
                                <td>{costumer.district}</td>
                                <td>{costumer.address}</td>
                                <td>{costumer.verified==true? "Verificado": "No verificado"}</td>
                                <td>
                                    <DetailsCostumer props={costumer}/>      
                                    <VerifyCostumer props={costumer} /> 

                                    {costumer.verified==true? 
                                    
                                    <Button
                                    onClick={() => navigate(`/listProductCostumer/${costumer.name}/${costumer.id}`)}>
                                    Cotizaciones
                                   </Button>

                                    :""}
                                             
                                </td>
                            </tr>
                        )
                        
                    ):("")
                }
                </tbody>
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
    </Container>
    </>
  )
}

export default listCostumers