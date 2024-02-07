import React from 'react'
import { Container,Row,Col,Form,Table, Button} from 'react-bootstrap'
import { useQuery } from 'react-query';
import { getCostumers } from '../../../services/costumerService';
import DetailsCostumer from './detailsCostumer';
import Styles from './listCostumers.css'
import VerifyCostumer from '../costumers/actions/verifyCostumer';


const listCostumers = () => {
    const {data: costumers,isLoading: costumersloading,IsError: costumersError} = useQuery('costumer',getCostumers);
    if(costumers){console.log(costumers)}

    const [searchTerm, setSearchTerm] = React.useState('');

     //if (costumersloading) return <div>Loading...</div>;

     //if (costumersError) return <div>Error</div>;

    // const filteredBySearch = costumers.filter(
    //     (costumer) =>
    //     costumer.cedulaJuridica.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     costumer.name.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     costumer.province.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     costumer.district.toString().toLowerCase().includes(searchTerm.toLowerCase()) 
    //   );

    const recordsPerPage = 10;
    const [currentPage, setCurrentPage] = React.useState(0);

    const offset = currentPage * recordsPerPage;
    //const paginatedCustomers = filteredBySearch.slice(offset, offset + recordsPerPage);
    
  return (
    <>
    <Container>
        <Row >
            <Col >
            <h2 className="text-center">Clientes</h2>
            <td></td>

            </Col>
        </Row>
        <Row>
            <Table striped bordered hover variant="light">
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
                        
                        costumers.map((costumer)=>
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
                                </td>
                            </tr>
                        )
                        
                    ):("")
                }
                </tbody>
            </Table>
        </Row>
    </Container>
    </>
  )
}

export default listCostumers