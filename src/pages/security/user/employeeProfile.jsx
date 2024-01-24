import React from 'react';
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import UpdateEmployee from '../employee/actions/updateEmployee';
import './employeeProfile.css';

const employeeProfile = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Container>
      <Row className='gutters'>
        <Col xl={3} lg={3} md={12} sm={12} xs={12}>
          <Card className='h-100'>
            <Card.Body>
              <div className='account-settings'>
                <div className='user-profile'>
                  <div className='user-avatar'>
                    <img src="https://image.ibb.co/jw55Ex/def_face.jpg" alt="User Avatar" />
                  </div>
                  <h5 className='user-name'>{user.employee.name} {user.employee.lastName1} {user.employee.lastName2}</h5>
                  <h6 className='user-email'>{user.email}</h6>
                </div>
                <div className='about'>
                  <h5>{user.idRole==1? 'Administrador':'Super Administrador'}</h5>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={9} lg={9} md={12} sm={12} xs={12}>
          <Card className='h-100'>
            <Card.Body>
              <Row className='gutters'>
                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                  <h6 className='mb-2 text-primary'>Información Personal</h6>
                </Col>
                <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                  <div className='form-group'>
                    <label htmlFor='fullName'>Nombre</label>
                    <input type='text' className='form-control' id='fullName' placeholder={user.employee.name} readOnly />
                  </div>
                </Col>
                <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                  <div className='form-group'>
                    <label htmlFor='eMail'>Primer Apellido</label>
                    <input type='email' className='form-control' id='eMail' placeholder={user.employee.lastName1} readOnly />
                  </div>
                </Col>
                <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                  <div className='form-group'>
                    <label htmlFor='phone'>Segundo Apellido</label>
                    <input type='text' className='form-control' id='phone' placeholder={user.employee.lastName2} readOnly />
                  </div>
                </Col>
                <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                  <div className='form-group'>
                    <label htmlFor='website'>Cédula</label>
                    <input type='url' className='form-control' id='website' placeholder={user.employee.cedula} readOnly />
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
                <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                  <div className='form-group'>
                    <label htmlFor='sTate'>Permisos</label>
                    <input type='text' className='form-control' id='sTate' placeholder={user.idRole==1? 'Administrador':'Super Administrador'} readOnly />
                  </div>
                </Col>

                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                  <div className='text-right'>
                  <UpdateEmployee props={user.employee}/>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default employeeProfile;
