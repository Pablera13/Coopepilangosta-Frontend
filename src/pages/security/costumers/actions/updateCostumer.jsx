import React, { useState } from 'react';
import { useMutation, QueryClient } from 'react-query';
import { Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { editCostumer } from '../../../../services/costumerService';
import { useRef } from 'react';
import { TiEdit } from "react-icons/ti";
import { Tooltip } from '@mui/material';

import { locations } from '../../../../utils/provinces';
import Select from 'react-select';

const updateCostumer = (props) => {
    const queryClient = new QueryClient();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [validated, setValidated] = useState(false);

    const costumer = props.props || {};

    const [selectedProvincia, setSelectedProvincia] = useState();
    const [selectedCanton, setSelectedCanton] = useState()
    const [selectedDistrito, setSelectedDistrito] = useState();
    const name = useRef();
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
                title: "Editado!",
                text: "Se editó el perfil",
                icon: "success",
            }).then(function () { window.location.reload() });
        },
        onError: () => {

            swal("Error", "Algo salio mal...", "error");
        },
    });

    const handleSubmit = async (event) => {

        event.preventDefault();
        const formFields = [name, address, postalCode, bankAccount, phoneNumber, email];
        let fieldsValid = true;

        formFields.forEach((fieldRef) => {
            if (!fieldRef.current.value) {
                fieldsValid = false;
            }
        });

        if (!fieldsValid) {
            setValidated(true);
            return;
        } else {
            setValidated(false);
        }

        const editCostumer = {
            id: costumer.id,
            cedulaJuridica: costumer.cedulaJuridica,
            name: name.current.value,
            province: selectedProvincia ? (selectedProvincia.label) : (costumer.province),
            canton: selectedCanton ? (selectedCanton.label) : (costumer.canton),
            district: selectedDistrito ? (selectedDistrito.label) : (costumer.district),
            address: address.current.value,
            postalCode: postalCode.current.value,
            bankAccount: bankAccount.current.value,
            verified: costumer.verified,
            phoneNumber: phoneNumber.current.value,
            email: email.current.value,
            userId: costumer.userId,
        };

        console.log(editCostumer)



        editCostumerMutation.mutateAsync(editCostumer).then(() => {
            setValidated(true);
            handleClose();
        });
    }


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
        let distritos = locations.provincias[selectedProvincia.value].cantones[cantonIndex].distritos
        const distritosOpt = Object.keys(distritos).map((index) => {
            const indexNumber = parseInt(index, 10);

            return {
                value: indexNumber,
                label: distritos[index].toString()
            };
        });
        setDistritosOptions(distritosOpt)
    }

    return (
        <>

            <Tooltip title="Editar perfil">
                <Button className="BtnBrown" onClick={handleShow} size="sm">
                    <TiEdit />
                </Button>
            </Tooltip>

            <Modal show={show} onHide={handleClose} size='lg'>
                <Form validated={validated} onSubmit={handleSubmit}>

                    <Modal.Header className="HeaderModal" closeButton>
                        <Modal.Title>Editar</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="validationCustom01">
                                    <Form.Label>Teléfono</Form.Label>
                                    <InputGroup>
                                    <InputGroup.Text>+506</InputGroup.Text>
                                    <Form.Control
                                        required
                                        type="number"
                                        placeholder="Ingrese el teléfono"
                                        defaultValue={costumer.phoneNumber}
                                        ref={phoneNumber}
                                    />
                                    </InputGroup>
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
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col lg={4}>
                                <Form.Group controlId="validationCustom03">
                                    <Form.Label>Provincia</Form.Label>
                                    <Select placeholder={costumer.province} defaultValue={costumer.province} options={provinciasArray}
                                        onChange={(selected) => { handleProvinciasSelectChange(selected.value); setSelectedProvincia(selected); }}
                                        on
                                    ></Select>
                                </Form.Group>
                            </Col>

                            <Col lg={4}>
                                <Form.Group md="4" controlId="validationCustom04">
                                    <Form.Label>Canton</Form.Label>
                                    <Select placeholder={costumer.canton} defaultValue={costumer.canton} options={cantonesOptions}
                                        onChange={(selected) => { setSelectedCanton(selected); handlecantonesSelectChange(selected.value); }}
                                    ></Select>
                                </Form.Group>
                            </Col>

                            <Col lg={4}>
                                <Form.Group md="4" controlId="validationCustom05">
                                    <Form.Label>Distrito</Form.Label>
                                    <Select placeholder={costumer.district} defaultValue={costumer.district} options={distritosOptions}
                                        onChange={(selected) => setSelectedDistrito(selected)}
                                    ></Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>
                                <Form.Group controlId="validationCustom06">
                                    <Form.Label>Dirección</Form.Label>
                                    <Form.Control required type="text-area" placeholder="Indique la dirección" ref={address} defaultValue={costumer.address} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="validationCustom07">
                                    <Form.Label>Código postal</Form.Label>
                                    <Form.Control type="number" placeholder="Ingrese el código postal"
                                        required ref={postalCode} defaultValue={costumer.postalCode} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>
                                <Form.Group controlId="validationCustom08">
                                    <Form.Label>Cuenta IBAN</Form.Label>
                                    <InputGroup>
                                    <InputGroup.Text>CR</InputGroup.Text>
                                    <Form.Control 
                                    type="number" 
                                    required 
                                    ref={bankAccount}

                                    // placeholder="Ingrese una cuenta bancaria" 
                                    // defaultValue={costumer.bankAccount} 

                                    placeholder={"Ingrese una cuenta bancaria IBAN"}
                                    defaultValue={costumer.bankAccount === "0" ? "" : costumer.bankAccount}

                                    
                                    />
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                        </Row>


                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="BtnSave" type="submit" onClick={handleSubmit}>Guardar</Button>

                        <Button className="BtnClose" variant="secondary" onClick={handleClose}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default updateCostumer;
