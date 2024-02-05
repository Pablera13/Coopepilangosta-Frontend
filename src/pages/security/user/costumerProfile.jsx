import React from 'react';
import { Table, Container, Col, Row, Button, Card, ListGroup } from 'react-bootstrap';
import AddContact from '../costumers/actions/addContact';
import UpdateContact from '../costumers/actions/updateContact';
import { NavLink, Navigate, useNavigate, useParams } from 'react-router-dom';
import PrintCustomerOrder from '../../Maintenance/CustomerOrder/actions/printCustomerOrder.jsx';

import { useEffect, useState } from 'react';
import { getUserById } from '../../../services/userService';
import { useQuery } from 'react-query';
import { deleteCostumerContact } from '../../../services/CostumerContactService';
import swal from 'sweetalert';
import { format } from 'date-fns';

import UpdateCostumer from '../costumers/actions/updateCostumer';

import { getCostumerOrder } from '../../../services/costumerorderService';

import './costumerProfile.css'

const costumerProfile = () => {
    const userStorage = JSON.parse(localStorage.getItem('user'));
    const [user, setUser] = useState(null);
    const { data: customerorderData, isLoading, isError } = useQuery('customerorder', getCostumerOrder);
  
    useEffect(() => {
      if (customerorderData) {
        getUserById(userStorage.id, setUser);
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
  
    return (
      <Container>
        {user != null && customerorderData != null ? (
          <>
            <Row>
              {/* Columna izquierda */}
              <Col xl={3} lg={3} md={12} sm={12} xs={12}>
                <Card className='h-100'>
                  <Card.Body>
                    <div className='account-settings'>
                      <div className='user-profile'>
                        <div className='user-avatar'>
                          <img src="https://image.ibb.co/jw55Ex/def_face.jpg" alt="User Avatar" />
                        </div>
                        <h5 className='user-name'>{user.costumer.name}</h5>
                        <h6 className='user-email'>{user.email}</h6>
                      </div>
                      <div className='about'>
                        <h5>{user.costumer.verify == true? 'Verificado' : 'No verificado'}</h5>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
  
              {/* Columna derecha */}
              <Col xl={9} lg={9} md={12} sm={12} xs={12}>
                <Card className='h-100'>
                  <Card.Body>
                    <Row className='gutters'>

                      <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                        <h6 className='mb-2 text-primary'>Información general</h6>
                      </Col>
                      <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                        <div className='form-group'>
                          <label htmlFor='fullName'>Nombre</label>
                          <input type='text' className='form-control' id='fullName' placeholder={user.costumer.name} readOnly />
                        </div>
                      </Col>
                      <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                        <div className='form-group'>
                          <label htmlFor='eMail'>Cédula Juridica</label>
                          <input type='text' className='form-control' id='eMail' placeholder={user.costumer.cedulaJuridica} readOnly />
                        </div>
                      </Col>
                      <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                        <div className='form-group'>
                          <label htmlFor='phone'>Provincia</label>
                          <input type='text' className='form-control' id='phone' placeholder={user.costumer.province} readOnly />
                        </div>
                      </Col>
                      <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                        <div className='form-group'>
                          <label htmlFor='website'>Cantón</label>
                          <input type='text' className='form-control' id='website' placeholder={user.costumer.canton} readOnly />
                        </div>
                      </Col>

                      <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                        <div className='form-group'>
                          <label htmlFor='website'>Distrito</label>
                          <input type='text' className='form-control' id='website' placeholder={user.costumer.district} readOnly />
                        </div>
                      </Col>

                      <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                        <div className='form-group'>
                          <label htmlFor='website'>Dirección</label>
                          <input type='text' className='form-control' id='website' placeholder={user.costumer.address} readOnly />
                        </div>
                      </Col>

                      <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                        <div className='form-group'>
                          <label htmlFor='website'>Código Postal</label>
                          <input type='text' className='form-control' id='website' placeholder={user.costumer.postalCode} readOnly />
                        </div>
                      </Col>

                      <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                        <div className='form-group'>
                          <label htmlFor='website'>Número de Cuenta</label>
                          <input type='text' className='form-control' id='website' placeholder={user.costumer.bankAccount} readOnly />
                        </div>
                      </Col>
  
                      <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                        <h6 className='mt-3 mb-2 text-primary'>Información de Usuario</h6>
                      </Col>
                      <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                        <div className='form-group'>
                          <label htmlFor='Street'>Correo Electrónico</label>
                          <input type='text' className='form-control' id='Street' placeholder={user.email} readOnly />
                        </div>
                      </Col>
                      <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                        <div className='form-group'>
                          <label htmlFor='ciTy'>Nombre de Usuario</label>
                          <input type='text' className='form-control' id='ciTy' placeholder={user.userName} readOnly />
                        </div>
                      </Col>

                      <Card.Body>
                                    <UpdateCostumer costumer={user.costumer} />
                    </Card.Body>
  
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
  
            <Row>
            <Col xl={3} lg={3} md={12} sm={12} xs={12}>
              {user.costumer.costumersContacts ? (
                <div className="d-flex flex-column">
                  {user.costumer.costumersContacts.map((contact) => (
                    <Card key={contact.id} className="mb-3">
                      <Card.Header>Información de contacto</Card.Header>
                      <Card.Body>
                        <Card.Title>{contact.name}</Card.Title>
                        <Card.Text>Contacto: {contact.contact}</Card.Text>
                        <div className="d-flex justify-content-between">
                          <Button
                            variant="outline-danger"
                            onClick={() => showAlert(contact.id)}
                            size="sm"
                          >
                            Eliminar
                          </Button>
                          <UpdateContact props={contact} />
                        </div>
                        <hr />
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <Card.Body>Aún no se han agregado contactos</Card.Body>
                </Card>
              )}
              <AddContact props={user.costumer.id} />

            </Col>
            </Row>
          </>
        ) : (
          <div className="text-center">Cargando...</div>
        )}
      </Container>
    );
  };
  
  export default costumerProfile;