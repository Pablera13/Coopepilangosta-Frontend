import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap'
import { getChangePasswordT, changePasswordT } from '../../../../services/loginService';
import { useQuery, useMutation, QueryClient } from 'react-query';

const changePassword = (props) => {
    const queryClient = new QueryClient()
    const email = props.props.email;
    const [token, setToken] = useState(null)
    console.log(props.props.email)
    useEffect(() => {
        getChangePasswordT(email, setToken)
    }, [])

    if (token) {
        localStorage.setItem('bearer', token)
    }

    const [isOk, setIsOk] = useState(false);

    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")

    const changePasswordMutation = useMutation('Authentication', changePasswordT, {
        onSettled: () => queryClient.invalidateQueries('Authentication'),
        onSuccess: () => {
            swal({
                title: 'Actualización!',
                text: 'Se actualizo la contraseña!, Volverá al inicio de sesión.',
                icon: 'success',
            });
            setTimeout(() => {
                window.location = '/login';
            }, 1500);
            
        },
    });

    const confirmChange = () => {
        if (password == "" || passwordConfirm == "") {
            alert("Complete ambas claves")
        } else if (password != passwordConfirm) {
            setIsOk(false)
            alert("Las claves no coinciden")
        } else {
            setIsOk(true)
            let newCredentials = { 
                email: email, 
                password: passwordConfirm 
            }
            console.log(newCredentials)
            changePasswordMutation.mutateAsync(newCredentials);
        }
    }

    return (
        <>
            <Row>
                <Form>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Nueva contraseña: </Form.Label>
                            <Form.Control required type="email" placeholder="Ingrese el código" onChange={(text) => setPassword(text.target.value)} />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Confirmar contraseña: </Form.Label>
                            <Form.Control required type="text" placeholder="Ingrese el código" onChange={(text) => setPasswordConfirm(text.target.value)} />
                        </Form.Group>
                    </Row>
                    <Button onClick={confirmChange}>
                        Confirmar
                    </Button>
                </Form>
            </Row>
        </>
    )
}

export default changePassword