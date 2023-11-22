import React, { useState } from 'react';
import { useMutation, QueryClient } from 'react-query';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { editCostumer } from '../../../../services/costumerService';
import { useRef } from 'react';
import { provinces } from '../../../../utils/provinces';

const updateCostumer = (props) => {
    const queryClient = new QueryClient();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [validated, setValidated] = useState(false);

    const costumer = props.props || {}; // Provide an empty object as a default value if props.props is undefined.

    const name = useRef();
    const province = useRef();
    const canton = useRef();
    const district = useRef();
    const address = useRef();
    const postalCode = useRef();
    const bankAccount = useRef();

    const editCostumerMutation = useMutation('Costumer', editCostumer, {
        onSettled: () => queryClient.invalidateQueries('Costumer'),
        mutationKey: 'Costumer',
        onSuccess: () => {
            // You can use a different way to provide feedback to the user here.
            console.log('Edit successful');
        },
        onError: () => {
            // Handle the error as needed.
            console.log('Error editing the costumer');
        },
    });

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            const editCostumer = {
                id: costumer.id,
                cedulaJuridica: costumer.cedulaJuridica,
                name: name.current.value,
                province: province.current.value,
                canton: canton.current.value,
                district: district.current.value,
                address: address.current.value,
                postalCode: postalCode.current.value,
                bankAccount: bankAccount.current.value,
                userId: costumer.userId,
            };
            editCostumerMutation.mutateAsync(editCostumer).then(() => {
                setValidated(true);
                handleClose(); // Close the modal after editing.
            });
        }
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow} size="sm">
                Editar
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form validated={validated} onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={4}>
                                <Form.Group controlId="validationCustom01">
                                    <Form.Label>Cédula jurídica</Form.Label>
                                    <Form.Control
                                        required
                                        type="number"
                                        defaultValue={costumer.cedulaJuridica}
                                        disabled
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col lg={5}>
                                <Form.Group controlId="validationCustom02">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Ingrese el nombre"
                                        ref={name}
                                        defaultValue={costumer.name}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} md="4" controlId="validationCustom03">
                                <Form.Label>Provincia</Form.Label>
                                <Form.Select placeholder="Provincia" required ref={province} defaultValue={costumer.province}>
                                    {
                                        provinces.map((province) =>
                                            <option value={province.value} label={province.value} key={province.value}></option>
                                        )
                                    }
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    Ingrese su provincia
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="4" controlId="validationCustom04">
                                <Form.Label>Canton</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese el canton" ref={canton} defaultValue={costumer.canton} />
                                <Form.Control.Feedback type="invalid">
                                    Por favor indique el canton
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="4" controlId="validationCustom05">
                                <Form.Label>Distrito</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese su distrito" ref={district} defaultValue={costumer.district} />
                                <Form.Control.Feedback type="invalid">
                                    Indique su distrito!.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="validationCustom06">
                                    <Form.Label>Dirección</Form.Label>
                                    <Form.Control type="text-area" placeholder="Indique la direccion" ref={address} defaultValue={costumer.address} />
                                    <Form.Control.Feedback type="invalid">
                                        Indique su dirección
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="validationCustom07">
                                    <Form.Label>Código postal</Form.Label>
                                    <Form.Control type="number" placeholder="Ingrese el código postal"
                                        required ref={postalCode} defaultValue={costumer.postalCode} />
                                    <Form.Control.Feedback type="invalid">
                                        Indique su código postal
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                        <Form.Group as={Col} md="5" controlId="validationCustom08">
                            <Form.Label>Cuenta bancaria</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese una cuenta bancaria" required ref={bankAccount}
                                defaultValue={costumer.bankAccount} />
                            <Form.Control.Feedback type="invalid">
                                Indique su código postal
                            </Form.Control.Feedback>
                        </Form.Group>
                        </Row>

                        <Button type="submit">Guardar</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default updateCostumer;
