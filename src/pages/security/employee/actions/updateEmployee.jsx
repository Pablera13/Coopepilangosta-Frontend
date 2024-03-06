import React, { useRef, useState } from 'react'
import { Modal, Col, Row, Container, Button, Form } from 'react-bootstrap'
import { useMutation } from 'react-query';
import { editEmployee } from '../../../../services/employeeService';
import swal from 'sweetalert';

import { TiEdit } from "react-icons/ti";

const updateEmployee = (props) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [validated, setValidated] = useState(false);

  const [employee, setEmployee] = useState(null);
  const handleOpen = () => {
    handleShow()
    setEmployee(props.props);
    console.log(props.props)
  }

  const name = useRef();
  const lastName1 = useRef();
  const lastName2 = useRef();
  const department = useRef();

  const updateEmployeeMutation = useMutation('employee', editEmployee, 
    {
      onSettled: () => queryClient.invalidateQueries('employee'),
      mutationKey: 'employee',
      onSuccess: () => window.location.reload(),
    })

  const handleUpdate = (event) =>{
    const form = document.getElementById('form-updateuser');

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
  } else {

    setValidated(true);
    
    let toUpdateEmployee={
      id: employee.id,
      cedula:employee.cedula,
      name: name.current.value,
      lastName1: lastName1.current.value,
      lastName2:lastName2.current.value,
      department:department.current.value,
      idUser:employee.user.id
    }
    console.log(toUpdateEmployee)
    updateEmployeeMutation.mutateAsync(toUpdateEmployee);
  }}
  return (
    <>
      <Button className="BtnBrown" variant="primary" onClick={handleOpen} size='sm'>
        Editar<TiEdit />

      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header  className="HeaderModal" closeButton>
          <Modal.Title>Actualizar datos del empleado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            employee != null ? (
              <Form validated={validated}>
                <Row>
                  <Col>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control required placeholder="Ingrese su nombre" defaultValue={employee.name} ref={name}/>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Label>Primer apellido</Form.Label>
                    <Form.Control required defaultValue={employee.lastName1} ref={lastName1}/>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Label>Segundo apellido</Form.Label>
                    <Form.Control required defaultValue={employee.lastName2} ref={lastName2}/>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Label>Departamento</Form.Label>
                    <Form.Control required defaultValue={employee.department} ref={department}/>
                  </Col>
                </Row>
              </Form>
            ) : ("")
          }

        </Modal.Body>
        <Modal.Footer>
          <Button className="BtnClose" variant="secondary" size='sm' onClick={handleClose}>
            Cerrar
          </Button>
          <Button  className="BtnSave" variant="primary" size='sm' onClick={handleUpdate}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default updateEmployee