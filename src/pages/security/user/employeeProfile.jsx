import React from 'react'
import { Container, Row, Col, Button, Card, ListGroup, CardGroup } from 'react-bootstrap'

const employeeProfile = () => {

  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user)
  return (
    <>
      <Container className=''>
        <Row>
          <Col lg={4}></Col>
          <Col>
            <Card bg='light' text='dark' style={{ width: '18rem' }}>
              <Card.Img variant="top" src="https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png" />
              <Card.Body>
                <Card.Title>Información general</Card.Title>
                <Card.Text>
                  {user.employee.name + " " + user.employee.lastName1 + " " + user.employee.lastName2}
                </Card.Text>
                <ListGroup className="list-group-flush">
                  <ListGroup.Item>Cédula: {user.employee.cedula}</ListGroup.Item>
                  <ListGroup.Item>Correo: {user.email}</ListGroup.Item>
                  <ListGroup.Item>Departamento: {user.employee.department}</ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Col lg={4}></Col>
      </Container>
    </>
  )
}

export default employeeProfile