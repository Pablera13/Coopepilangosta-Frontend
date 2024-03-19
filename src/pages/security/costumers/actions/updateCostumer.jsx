import React, { useState } from 'react';
import { useMutation, QueryClient } from 'react-query';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { editCostumer } from '../../../../services/costumerService';
import { useRef } from 'react';
import { provinces } from '../../../../utils/provinces';
import { TiEdit } from "react-icons/ti";

import { locations } from '../../../../utils/provinces';
import Select from 'react-select';

const updateCostumer = (props) => {
    const queryClient = new QueryClient();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [validated, setValidated] = useState(false);

    const costumer = props.props || {}; // Provide an empty object as a default value if props.props is undefined.

    console.log(costumer)

    const name = useRef();
    const province = useRef();
    const canton = useRef();
    const district = useRef();
    const address = useRef();
    const postalCode = useRef();
    const bankAccount = useRef();
    const phoneNumber = useRef();
    const email = useRef();

    const editCostumerMutation = useMutation('Costumer', editCostumer, {
        onSettled: () => queryClient.invalidateQueries('Costumer'),
        mutationKey: 'Costumer',
        onSuccess: () => {
            swal({
                title: "Creado!",
                text: "Se creó el contacto",
                icon: "success",
            });
            handleClose();

            setTimeout(function () {
                window.location.reload();
            }, 2000);
        },
        onError: () => {
            swal("Error", "Algo salio mal...", "error");
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
                verified: costumer.verified,
                email: email.current.value,
                phoneNumber: phoneNumber.current.value,
                userId: costumer.userId,
            };
            editCostumerMutation.mutateAsync(editCostumer).then(() => {
                setValidated(true);
                handleClose(); 
            });
        }
    };

    const [selectedProvincia, setSelectedProvincia] = useState();
    const [selectedCanton, setSelectedCanton] = useState()
    const [selectedDistrito, setSelectedDistrito] = useState();

    const provinciasArray = Object.keys(locations.provincias).map((index) => {

        const indexNumber = parseInt(index, 10);

        return {
            value: indexNumber,
            label: locations.provincias[index].nombre
        };
    });


    const [cantonesOptions, setCantonesOptions] = useState();
    let cantones = []
    const handleProvinciasSelectChange = (provinceIndex) => {

        let cantones = locations.provincias[provinceIndex].cantones

        const cantonesOptions = Object.keys(cantones).map((index) => {
            const indexNumber = parseInt(index, 10);

            return {
                value: indexNumber,
                label: cantones[index].nombre
            };
        });

        setCantonesOptions(cantonesOptions)
    }

    const [distritosOptions, setDistritosOptions] = useState();
    let distritos = []


    const handlecantonesSelectChange = (cantonIndex) => {
        console.log(cantonIndex)
        let distritos = locations.provincias[selectedProvincia.value].cantones[cantonIndex].distritos
        console.log(selectedProvincia.value)
        const distritosOpt = Object.keys(distritos).map((index) => {
            const indexNumber = parseInt(index, 10);

            return {
                value: indexNumber,
                label: distritos[index].toString()
            };
        });
        console.log(distritosOpt)
        setDistritosOptions(distritosOpt)
    }

    return (
        <>
            <Button className="BtnBrown" onClick={handleShow} size="sm">
                <TiEdit/>
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header className="HeaderModal" closeButton>
                    <Modal.Title>Editar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form validated={validated} onSubmit={handleSubmit}>
                   
                        <Row>
                            <Col lg={6}>
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
                            <Col lg={6}>
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

                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="validationCustom01">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control
                                        required
                                        type="number"
                                        placeholder="Ingrese el teléfono"
                                        defaultValue={costumer.phoneNumber}
                                        ref={phoneNumber}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group controlId="validationCustom02">
                                    <Form.Label>Correo Electrónico</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Ingrese el correo"
                                        ref={email}
                                        defaultValue={costumer.email}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            
                            <Col lg={4}>
                            <Form.Group controlId="validationCustom03">
                                <Form.Label>Provincia</Form.Label>
                                <Select placeholder={costumer.province} options={provinciasArray}
                                    onChange={(selected) => { handleProvinciasSelectChange(selected.value); setSelectedProvincia(selected); }}
                                    on
                                ></Select>
                                <Form.Control.Feedback type="invalid">
                                    Ingrese su provincia
                                </Form.Control.Feedback>
                            </Form.Group>
                            </Col>

                            <Col lg={4}>
                            <Form.Group md="4" controlId="validationCustom04">
                                <Form.Label>Canton</Form.Label>
                                <Select placeholder={costumer.canton} options={cantonesOptions}
                                    onChange={(selected) => { setSelectedCanton(selected); handlecantonesSelectChange(selected.value); }}
                                ></Select>
                                <Form.Control.Feedback type="invalid">
                                    Por favor indique el canton
                                </Form.Control.Feedback>
                            </Form.Group>
                            </Col>

                            <Col lg={4}>
                            <Form.Group md="4" controlId="validationCustom05">
                                <Form.Label>Distrito</Form.Label>
                                <Select placeholder={costumer.district} options={distritosOptions}
                                    onChange={(selected) => setSelectedDistrito(selected)}
                                ></Select>
                                <Form.Control.Feedback type="invalid">
                                    Indique su distrito!.
                                </Form.Control.Feedback>
                            </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>
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
                            <Col lg={12}>
                            <Form.Group controlId="validationCustom08">
                                <Form.Label>Cuenta bancaria (IBAN)</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese una cuenta bancaria" required ref={bankAccount}
                                    defaultValue={costumer.bankAccount} />
                                <Form.Control.Feedback type="invalid">
                                    Indique su código postal
                                </Form.Control.Feedback>
                            </Form.Group>
                            </Col>
                        </Row>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="BtnSave" type="submit">Guardar</Button>

                    <Button className="BtnClose" variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default updateCostumer;
