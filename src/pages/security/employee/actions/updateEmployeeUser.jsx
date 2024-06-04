import React, { useRef, useState } from 'react'
import { Form, Col, Row, Button, Modal } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query';
import { getRoles } from '../../../../services/rolesService';
import { editUser } from '../../../../services/userService';
import { QueryClient } from 'react-query';
import swal from 'sweetalert';
import { FaUserLock } from "react-icons/fa";
import { Tooltip } from '@mui/material';

const updateEmployeeUser = (props) => {
    const queryClient = new QueryClient();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [validated, setValidated] = useState(false);
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
        if (selectedRole == null) {
            let currentRole = rolesOptions.filter((role) => role.value == 1)
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
            onError: () => {
                swal({
                    title: 'Error!',
                    text: 'Ocurrió un error al actualizar la información',
                    icon: 'error',
                });
            }
        })

    const save = async (event) => {

        event.preventDefault();
        const formFields = [email, userName, password, selectRole];
        let fieldsValid = true;
    
        formFields.forEach((fieldRef) => {
            if (!fieldRef.current.value) {
                fieldsValid = false;}
        });
    
        if (!fieldsValid) {
            setValidated(true);
            return;
        } else {
            setValidated(false);
        }

            let toUpdateUser = {
                id: user.id,
                email: email.current.value,
                userName: userName.current.value,
                password: password.current.value,
                idRole: selectRole.current.value
            }

            let emailAvailability = await checkEmailAvailability(email.current.value).then(data => data)
            if (email.current.value != user.email) {
                if (emailAvailability) {
                    editUserEmployeeMutation.mutateAsync(toUpdateUser)
                } else {
                    swal('Advertencia', 'El correo se encuentra en uso', 'warning')
                }
            } else {
                editUserEmployeeMutation.mutateAsync(toUpdateUser)
            }

        }

    return (
        <>

            <Tooltip title="Editar usuario">
                <Button className="BtnPrint" onClick={handleOpen} size='sm'>
                    <FaUserLock />
                </Button>
            </Tooltip>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header className="HeaderModal" closeButton>
                    <Modal.Title>Actualizar usuario</Modal.Title>
                </Modal.Header>

                {
                    user != null ? (
                        <><Modal.Body>
                            <Form validated={validated} onSubmit={save}>
                                <Row>
                                    <Col>
                                        <Form.Label>Correo</Form.Label>
                                        <Form.Control required defaultValue={user.email} ref={email} type='email' />
                                    </Col>

                                    <Col>
                                        <Form.Label>Nombre de usuario</Form.Label>
                                        <Form.Control required defaultValue={user.userName} ref={userName} />
                                    </Col>
                                </Row>
                                <br />
                                <Row>
                                    <Col>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control required defaultValue={user.password} ref={password} disabled />
                                    </Col>
                                    <Col>
                                        <Form.Label>Elija el rol</Form.Label>
                                        <Row>
                                            <Form.Select defaultValue={user.role.id} onChange={(selected) => setSelectedRole(selected)} ref={selectRole}>
                                                {roles.map((role) => <option value={role.id} key={role.id}>{role.name}</option>
                                                )}
                                            </Form.Select>
                                        </Row>
                                    </Col>
                                </Row>

                            </Form>
                        </Modal.Body><Modal.Footer>
                                <Button className="BtnSave" variant="primary" size='sm' onClick={save}>Actualizar empleado</Button>
                                <Button className="BtnClose" variant="secondary" size='sm' onClick={handleClose}>
                                    Cerrar
                                </Button>

                            </Modal.Footer></>

                    ) : ("")
                }

            </Modal>
        </>
    )
}

export default updateEmployeeUser