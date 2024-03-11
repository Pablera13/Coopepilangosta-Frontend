import React, { useRef, useState } from 'react'
import { Modal, Row, Col, Button, Form } from 'react-bootstrap'
import { createEmployee, CheckEmployeeCedulaAvailability } from '../../../../services/employeeService';
import { createuser, checkEmailAvailability } from '../../../../services/userService';
import { useMutation, useQuery } from 'react-query';
import { getRoles } from '../../../../services/rolesService';
import Select from 'react-select';
import { QueryClient } from 'react-query';
import { checkCedulaFormat } from '../../../../utils/validateCedulaFormat';
export const AddEmployee = () => {
  const queryClient = new QueryClient();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [validated, setValidated] = useState(false);

  const cedula = useRef();
  const name = useRef();
  const lastName1 = useRef();
  const lastName2 = useRef();
  const department = useRef();
  const email = useRef();
  const userName = useRef();
  const password = useRef();

  const { data: roles, isLoading: rolesLoading, isError: rolesError } = useQuery('roles', getRoles)
  const [selectedRole, setSelectedRole] = useState();

  let rolesOptions = []
  if (roles) {
    rolesOptions = roles.map((role) => ({
      value: role.id,
      label: role.name
    }));
  }

  const addUserMutation = useMutation('users', createuser,
    {
      onSettled: () => queryClient.invalidateQueries('users'),
      mutationKey: 'users',
      onSuccess: () => console.log("User created"),
      onError: () => {
        swal({
          title: 'Error!',
          text: 'Ocurrió un error al guardar el usuario',
          icon: 'error',
        });
      }
    })

  const addEmployeMutation = useMutation('employee', createEmployee,
    {
      onSettled: () => queryClient.invalidateQueries('employee'),
      mutationKey: 'employee',
      onSuccess: () => {
        swal({
          title: 'Agregado!',
          text: 'Se agrego el empleado',
          icon: 'success',
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      onError: () => {
        swal({
          title: 'Error!',
          text: 'Ocurrió un error al guardar el empleado',
          icon: 'error',
        });
      }
    })

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    event.preventDefault();
    handleSave()
    setValidated(true);
  };

  const handleSave = async () => {
    let newUser = {
      email: email.current.value,
      userName: userName.current.value,
      password: password.current.value,
      idRole: selectedRole.value
    }

    let cedulaAvailability = await CheckEmployeeCedulaAvailability(cedula.current.value).then(data => data);
    let emailAvailability = await checkEmailAvailability(email.current.value).then(data => data)
    let CheckFormatCedula = checkCedulaFormat(cedula.current.value)
    console.log(CheckFormatCedula)
    if (cedulaAvailability && emailAvailability && CheckFormatCedula) {
      const createdUser = await addUserMutation.mutateAsync(newUser)

      createdUser != null ? (console.log(createdUser)) : (console.log("E"))

      let newEmployee = {
        cedula: cedula.current.value,
        name: name.current.value,
        lastName1: lastName1.current.value,
        lastName2: lastName2.current.value,
        department: department.current.value,
        idUser: createdUser.id
      }


      addEmployeMutation.mutateAsync(newEmployee);

    } else {
      if (cedulaAvailability == false) {
        swal('Advertencia', 'Ya existe un empleado con este numero de cedula', 'warning')
      }
      if (emailAvailability == false) {
        swal('Advertencia', 'Este correo electronico ya se encuentra en uso', 'warning')
      }
      if (CheckFormatCedula == false) {
        swal('Advertencia', 'La cedula no se encuentra en el formato correcto', 'warning')
      }
    }

  }


  return (
    <>
      <Button variant="info" onClick={handleShow} size='sm'>
        Agregar nuevo empleado
      </Button>
      

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="HeaderModal"  closeButton>
          <Modal.Title>Agregar empleado</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form noValidate validated={validated}>
            <Row>
              <Col>
                <Form.Label>Cédula</Form.Label>
                <Form.Control required placeholder="Ingrese la cédula" ref={cedula} autoFocus type='number' />
              </Col>
              <Col>
                <Form.Label>Nombre</Form.Label>
                <Form.Control required placeholder="Ingrese el nombre" ref={name} />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Primer apellido</Form.Label>
                <Form.Control required placeholder="Ingrese el apellido" ref={lastName1} />
              </Col>
              <Col>
                <Form.Label>Segundo apellido</Form.Label>
                <Form.Control required placeholder="Ingrese el segundo apellido" ref={lastName2} />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Departamento</Form.Label>
                <Form.Control required placeholder="Ingrese el departamento" ref={department} />
              </Col>
            </Row>
            <Row>
            </Row>
            <Row>
              <Col>
                <Form.Label>Correo</Form.Label>
                <Form.Control required placeholder="Ingrese el correo" ref={email} type='email' />
              </Col>
              <Col>
                <Form.Label>Nombre de usuario</Form.Label>
                <Form.Control required placeholder="Ingrese el nombre de usuario" ref={userName} type='text' />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Contraseña</Form.Label>
                <Form.Control required placeholder="Ingrese la contraseña" ref={password} type='password' />
              </Col>
              <Col>
                <Form.Label>Rol</Form.Label>
                <Select required placeholder="Elija el rol" options={rolesOptions} onChange={(selected) => setSelectedRole(selected)}></Select>
              </Col>
            </Row>
          </Form>


        </Modal.Body>
        <Modal.Footer>
          <Button className="BtnClose" variant="secondary" size='sm' onClick={handleClose}>
            Cerrar
          </Button>
          <Button className="BtnSave" variant="primary" size='sm' onClick={handleSubmit}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default AddEmployee
