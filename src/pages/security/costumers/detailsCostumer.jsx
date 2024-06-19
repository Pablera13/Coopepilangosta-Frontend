import React, { useState } from "react";
import { Modal, Row, Col, Table, Button, Form, InputGroup } from "react-bootstrap";
import { LuListChecks } from "react-icons/lu";
import { Tooltip } from '@mui/material';

const detailsCostumer = (props) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [costumerProps, setCostumerProps] = useState(null);

  const handleOpen = () => {
    handleShow();
    setCostumerProps(props.props);
  };

  return (
    <>

      <Tooltip title="Detalles">
        <Button
          className="BtnBrown"
          variant="outline-primary"
          onClick={handleOpen}
          size="sm"
        >
          <LuListChecks />
        </Button>
      </Tooltip>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header className="HeaderModal" closeButton>
          <Modal.Title>Información del cliente</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {costumerProps ? (
            <>

              <Row>
                <Col xl={4} lg={4} md={4} sm={4} xs={4}>
                  <Form.Group md="4">
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control type="textarea" readOnly
                      defaultValue={costumerProps.user.userName} />
                  </Form.Group>
                </Col>
                <Col xl={4} lg={4} md={4} sm={4} xs={4}>
                  <Form.Group md="4">
                    <Form.Label>Correo</Form.Label>
                    <Form.Control type="textarea" readOnly
                      defaultValue={costumerProps.user.email} />
                  </Form.Group>
                </Col>
              </Row>
              <br />

              <Row>
                <Col xl={4} lg={4} md={4} sm={4} xs={4}>
                  <Form.Group md="4">
                    <Form.Label>Código Postal</Form.Label>
                    <Form.Control
                      type="textarea"
                      readOnly
                      defaultValue={costumerProps.postalCode}
                    />
                  </Form.Group>
                </Col>
                <Col xl={4} lg={4} md={4} sm={4} xs={4}>
                  <Form.Group md="4">
                    <Form.Label>Cuenta IBAN</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>CR</InputGroup.Text>
                      <Form.Control
                        type="textarea"
                        readOnly
                        defaultValue={costumerProps.bankAccount}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
              <br />

              <Row>
                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                  <Form.Group md="4">
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control
                      type="textarea"
                      readOnly
                      defaultValue={
                        costumerProps.address +
                        `, ` +
                        costumerProps.district +
                        `, ` +
                        costumerProps.canton +
                        `, ` +
                        costumerProps.province
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <br />
              <Row>
                <Table className="Table" striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'center' }}>Nombre de contacto</th>
                      <th style={{ textAlign: 'center' }}>Medio de contacto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costumerProps.costumersContacts.map((contact, index) => (
                      <tr key={index}>
                        <td style={{ textAlign: 'left', paddingLeft: '10px' }}>{contact.name}</td>
                        <td style={{ textAlign: 'left', paddingLeft: '10px' }}>{contact.contact}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

              </Row>
            </>
          ) : (
            <p>No existen contactos</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="BtnClose"
            variant="secondary"
            onClick={handleClose}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default detailsCostumer;
