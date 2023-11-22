import React, { useRef, useState } from 'react'
import { Form, Col, Row, Button, Modal } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query';
import { getRoles } from '../../../../services/rolesService';
import Select from 'react-select';
import { editUser } from '../../../../services/userService';
import { QueryClient } from 'react-query';
import swal from 'sweetalert';
const updateEmployeeUser = (props) => {
    const queryClient = new QueryClient();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [selectedRole, setSelectedRole] = useState();
    const [user, setUser] = useState(null);
    const handleOpen = () => {
        handleShow()
        setUser(props.props);
        console.log(props.props)
    }

    const { data: roles, isLoading: rolesLoading, isError: rolesError } = useQuery('roles', getRoles)

    let rolesOptions = []
    if (roles) {
        rolesOptions = roles.map((role) => ({
            value: role.id,
            label: role.name
        }));
        if (selectedRole == null ) {
            let currentRole = rolesOptions.filter((role)=>role.value == 1)
            console.log(currentRole)
            setSelectedRole(currentRole)
        }
    }
    
    const email = useRef();
    const userName = useRef();
    const password = useRef();
    const selectRole = useRef();

    const editUserEmployeeMutation = useMutation('users', editUser,
        {
            onSettled: () => 
            queryClient.invalidateQueries('users'),
            mutationKey: 'employee',
            onSuccess: () => {
                swal({
                    title: 'Actualizado!',
                    text: 'Se actualizo el usuario',
                    icon: 'success',
                });
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            },
            onError: () =>{
                swal({
                    title: 'Error!',
                    text: 'Ocurrió un error al actualizar la información',
                    icon: 'error',
                });
            }
        })

    const handleUpdateUser = () => {
        let toUpdateUser = {
            id: user.id,
            email: email.current.value,
            userName: userName.current.value,
            password: password.current.value,
            idRole: selectRole.current.value
        }
        editUserEmployeeMutation.mutateAsync(toUpdateUser)
    }

    return (
        <>
            <Button variant="warning" onClick={handleOpen} size='sm'>
                Roles
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Actualizar usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        user != null ? (
                            <Form>
                                <Row><h3>Datos de inicio de sesion</h3></Row>
                                <Row>
                                    <Col>
                                        <Form.Label>Correo</Form.Label>
                                        <Form.Control defaultValue={user.email} ref={email} />
                                    </Col>

                                    <Col>
                                        <Form.Label>Nombre de usuario</Form.Label>
                                        <Form.Control defaultValue={user.userName} ref={userName} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control defaultValue={user.password} ref={password} />
                                    </Col>
                                    <Col>
                                        <Form.Label>Elija el rol</Form.Label>
                                        <Row>
                                            <select defaultValue={user.role.id} onChange={(selected) => setSelectedRole(selected)} ref={selectRole}>
                                                {
                                                    roles.map((role) =>
                                                        <option value={role.id} key={role.id}>{role.name}</option>
                                                    )
                                                }
                                            </select>
                                        </Row>
                                    </Col>
                                </Row>
                            </Form>
                        ) : ("")
                    }

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" size='sm' onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" size='sm' onClick={handleUpdateUser}>Guardar</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default updateEmployeeUser