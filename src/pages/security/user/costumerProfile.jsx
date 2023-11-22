import React from 'react';
import { Table, Container, Col, Row, Button, Card } from 'react-bootstrap';
import AddContact from '../costumers/actions/addContact';
import UpdateContact from '../costumers/actions/updateContact';
import { NavLink, Navigate, useNavigate, useParams  } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { getUserById } from '../../../services/userService';
import { useQuery } from 'react-query';
import { deleteCostumerContact } from '../../../services/CostumerContactService';
import swal from 'sweetalert';
import { format } from 'date-fns';

import UpdateCostumer from '../costumers/actions/updateCostumer';

import {getCostumerOrder} from '../../../services/costumerorderService';

import styles from './costumerProfile.css' 


const costumerProfile = () => {

    const userStorage = JSON.parse(localStorage.getItem('user'));
    const [user, setUser] = useState(null);

    const { data: customerorderData, isLoading , isError } = useQuery('customerorder', getCostumerOrder);
    let dataFiltered = [] 

    useEffect(() => {
    
        if(customerorderData){
        getUserById(userStorage.id, setUser);
        dataFiltered = customerorderData.filter((order) => order.costumerId === userStorage.costumer.id)
        console.log("Los pedidos de este usuario = " + JSON.stringify(dataFiltered))
        }
    }, [customerorderData]);

    const deleteContact = (id) => {
        deleteCostumerContact(id).finally(() => window.location.reload());
    };

    const showAlert = (id) => {
        swal({
            title: 'Eliminar',
            text: '¿Está seguro de que desea eliminar este contacto?',
            icon: 'warning',
            buttons: ['Cancelar', 'Aceptar'],
        }).then((answer) => {
            if (answer) {
                swal({
                    title: 'Eliminado!',
                    text: 'El contacto ha sido eliminado',
                    icon: 'success',
                });
                setTimeout(() => {
                    deleteContact(id);
                }, 1500);
            }
        });
    };


    if(isLoading)
    return <div>Loading...</div>
    
    if(isError)
    return <div>Error</div>

    return (
        
        <Container>
            {user != null && customerorderData != null ? (
                <><Row>
                    <Col lg={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Información general</Card.Title>
                                <Card.Text>{user.costumer.name}</Card.Text>
                            </Card.Body>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">Provincia: {user.costumer.province}</li>
                                <li className="list-group-item">Cantón: {user.costumer.canton}</li>
                                <li className="list-group-item">Distrito: {user.costumer.district}</li>
                                <li className="list-group-item">Cuenta bancaria: {user.costumer.bankAccount}</li>
                            </ul>
                            <Card.Body>Dirección: {user.costumer.address}</Card.Body>
                            <UpdateCostumer costumer={user.costumer} />
                        </Card>
                    </Col>
                    <Col lg={8}>
                        {user.costumer.costumersContacts ? (
                            <Card>
                                <Card.Header>Información de contacto</Card.Header>
                                {user.costumer.costumersContacts.map((contact) => (
                                    <Card.Body key={contact.id}>
                                        <Card.Title>{contact.name}</Card.Title>
                                        <Card.Text>Contacto: {contact.contact}</Card.Text>
                                        <div>
                                            <UpdateContact props={contact} />
                                            <Button
                                                variant="outline-danger"
                                                onClick={() => showAlert(contact.id)}
                                                size="sm"
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                        <hr />
                                    </Card.Body>
                                ))}
                            </Card>
                        ) : (
                            <Card>
                                <Card.Body>Aún no se han agregado contactos</Card.Body>
                            </Card>
                        )}
                        <AddContact props={user.costumer.id} />
                    </Col>

                    

                </Row><Row>
                        <Col>
                            <Card>
                            <br>
                    </br>
  
                                <Card.Header>Mis Pedidos</Card.Header>
                                {customerorderData ? (
                                    <Table striped bordered hover variant="light">
                                        <thead>
                                            <tr>
                                                <th>Número de pedido</th>
                                                <th>Fecha del pedido</th>
                                                <th>Total</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {customerorderData
                                                .filter((order) => order.costumerId === userStorage.costumer.id)
                                                .map((order) => (
                                                    <tr key={order.id}>
                                                        <td>{order.id}</td>
                                                        <td>{format(new Date(order.confirmedDate), 'yyyy-MM-dd')}</td>
                                                        <td>{order.total.toFixed(2)}</td>
                                                        <td>
                                                        <NavLink to={`/userOrder/${order.id}`} 

                                                        style={{
                                                        textDecoration: 'underline',
                                                        margin: '0 10px', 
                                                        border: 'none',
                                                        background: 'none',
                                                        padding: 0,
                                                        color: 'inherit',
                                                        cursor: 'pointer'
                                                        }}
                                                        >Detalles
                                                        </NavLink>
                                                    </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    'Cargando'
                                )}
                            </Card>
                        </Col>
                    </Row></>
            ) : (
                <div className="text-center">Cargando...</div>
            )}
        </Container>
    );
};

export default costumerProfile;