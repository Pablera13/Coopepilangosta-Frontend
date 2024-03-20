import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap'
import { getChangePasswordT, changePasswordT } from '../../../../services/loginService';
import { useQuery, useMutation, QueryClient } from 'react-query';
import swal from 'sweetalert';
import './forgotPassword.css'

const changePassword = (props) => {
    const queryClient = new QueryClient()
    const email = props.props.email;
    const [token, setToken] = useState(null)
    console.log(props.props.email)
    useEffect(() => {
        getChangePasswordT(email, setToken)
    }, [])



    const [isOk, setIsOk] = useState(false);

    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")

    const changePasswordMutation = useMutation('Authentication', changePasswordT, {
        onSettled: () => queryClient.invalidateQueries('Authentication'),
        onSuccess: () => {
            swal({
                title: 'Actualizado!',
                text: 'Se actualizo la contraseña!, Volverá al inicio de sesión.',
                icon: 'success',
            });
            setTimeout(() => {
                localStorage.clear();
                window.location = '/login';
            }, 1500);

        },
    });

    const confirmChange = () => {
        if (password == "" || passwordConfirm == "") {
            swal('Complete ambas claves.', 'Debe llenar ambos espacios para continuar', 'warning')
        }
        if (password != passwordConfirm || passwordConfirm != password) {
            setIsOk(false)
            swal('Las claves no coinciden.', 'Las claves deben coincidir.', 'warning')

        }
        if (password.length < 8 || passwordConfirm.length < 8) {
            setIsOk(false)
            swal('Formato no valido.', 'La clave debe tener minimo 8 caracteres', 'warning')
        }
        if (password == passwordConfirm && password.length >= 8) {
            setIsOk(true)
            if (token) {
                localStorage.setItem('bearer', token)
            }
            let newCredentials = {
                email: email,
                password: passwordConfirm
            }
            changePasswordMutation.mutateAsync(newCredentials);
        }
    }

    return (
        <>
            <Row>
                <Form>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label className='labelPass'
                            style={{color:'white'}}
                            >Nueva contraseña: </Form.Label>
                            <Form.Control required type="password" placeholder="Ingrese su nueva contraseña" onChange={(text) => setPassword(text.target.value)} />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label className='labelPass'
                            style={{color:'white'}}
                            >Confirmar contraseña: </Form.Label>
                            <Form.Control required type="password" placeholder="Confirme su nueva contraseña" onChange={(text) => setPasswordConfirm(text.target.value)} />
                        </Form.Group>
                    </Row>
                    <Button onClick={confirmChange} className='BtnStar'>
                        Confirmar
                    </Button>
                </Form>
            </Row>
        </>
    )
}

export default changePassword