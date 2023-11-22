import React, { useRef, useState } from 'react'
import { Form, Row, Col, Button, Container, InputGroup, Collapse } from 'react-bootstrap'
import { QueryClient } from 'react-query'
import { createuser } from '../../../services/userService'
import { createCostumer } from '../../../services/costumerService'
import { createContactCostumer } from '../../../services/CostumerContactService'
import '../costumers/register.css'
import { useMutation } from 'react-query'
import { provinces } from '../../../utils/provinces'
const costumerRegister = () => {
    const queryClient = new QueryClient();
    const [validated, setValidated] = useState(false);

    const cedulaJuridica = useRef();
    const name = useRef();
    const province = useRef();
    const canton = useRef();
    const district = useRef();
    const address = useRef();
    const postalCode = useRef();
    const bankAccount = useRef();
    const email = useRef();
    const userName = useRef();
    const password = useRef();

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

    const addCostumerMutation = useMutation('costumer', createCostumer,
        {
            onSettled: () => queryClient.invalidateQueries('costumer'),
            mutationKey: 'costumer',
            onSuccess: () => {
                swal({
                    title: 'Guardado!',
                    text: 'Se creo el usuario',
                    icon: 'success',
                });
            },
            onError: () => {
                console.log("Error creating the costumer")

            }
        })

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            console.log(event);
        } else if (form.checkValidity() === true) {

            let newCostumerUser = {
                email: email.current.value,
                userName: userName.current.value,
                password: password.current.value,
                idRole: 4
            }

            const createdUser = await addUserMutation.mutateAsync(newCostumerUser)

            let newCostumer = {
                cedulaJuridica: cedulaJuridica.current.value,
                name: name.current.value,
                province: province.current.value,
                canton: canton.current.value,
                district: district.current.value,
                address: address.current.value,
                postalCode: postalCode.current.value,
                bankAccount: bankAccount.current.value,
                userId: createdUser.id
            }
            await addCostumerMutation.mutateAsync(newCostumer);

        }
    };

    return (
        <>
            <Container className='registerContainer'>
                <Row>
                    <h2 className='h3register'>Registro</h2>
                </Row>
                <Row>
                    <h3>Información general</h3>
                </Row>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="4" controlId="validationCustom01">
                            <Form.Label>Cédula jurídica</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                placeholder="Ingrese la cédula"
                                ref={cedulaJuridica}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="4" controlId="validationCustom02">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Ingrese el nombre"
                                ref={name}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>

                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="4" controlId="validationCustom03">
                            <Form.Label>Provincia</Form.Label>
                            <Form.Select placeholder="Provincia" required ref={province} >
                                {
                                    provinces.map((province) =>
                                        <option value={province.value} label={province.value}></option>
                                    )
                                }
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Ingrese su provincia
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="4" controlId="validationCustom04">
                            <Form.Label>Canton</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese el canton" ref={canton} />
                            <Form.Control.Feedback type="invalid">
                                Por favor indique el canton
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="4" controlId="validationCustom05">
                            <Form.Label>Distrito</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese su distrito" ref={district} />
                            <Form.Control.Feedback type="invalid">
                                Indique su distrito!.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group as={Col} md="4" controlId="validationCustom06">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control type="text" placeholder="Indique la dirección" ref={address} />
                            <Form.Control.Feedback type="invalid">
                                Indique su dirección
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} md="3" controlId="validationCustom07">
                            <Form.Label>Código postal</Form.Label>
                            <Form.Control type="number" placeholder="Ingrese el código postal" required ref={postalCode} />
                            <Form.Control.Feedback type="invalid">
                                Indique su código postal
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="5" controlId="validationCustom08">
                            <Form.Label>Cuenta bancaria</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese una cuenta bancaria" required ref={bankAccount} />
                            <Form.Control.Feedback type="invalid">
                                Indique su código postal
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Col>
                            <h3>Información de usuario</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="validationCustom09">
                                <Form.Label>Correo</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese su correo" required ref={email} />
                                <Form.Control.Feedback type="invalid">
                                    Indique su correo
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="validationCustom10">
                                <Form.Label>Usuario</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese nombre de usuario" required ref={userName} />
                                <Form.Control.Feedback type="invalid">
                                    Indique su usuario
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control placeholder="Ingrese la contraseña" ref={password} type='password' required />
                        </Col>

                    </Row>
                </Form>
                <Row className='justify-content-md-center'>
                    <Col >
                        <Button onClick={handleSubmit}>Enviar</Button>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default costumerRegister