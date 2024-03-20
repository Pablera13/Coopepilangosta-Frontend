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

    const costumer = props.props || {};

    const [selectedProvincia, setSelectedProvincia] = useState();
    const [selectedCanton, setSelectedCanton] = useState()
    const [selectedDistrito, setSelectedDistrito] = useState();
    const name = useRef();
    const address = useRef();
    const postalCode = useRef();
    const bankAccount = useRef();

    const editCostumerMutation = useMutation('Costumer', editCostumer, {
        onSettled: () => queryClient.invalidateQueries('Costumer'),
        mutationKey: 'Costumer',
        onSuccess: () => {
            swal({
                title: "Editado!",
                text: "Se editó el perfil",
                icon: "success",
            }) .then(function(){window.location.reload()});
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
                province: selectedProvincia?(selectedProvincia.label):(costumer.province),
                canton: selectedCanton?(selectedCanton.label):(costumer.canton),
                district: selectedDistrito?(selectedDistrito.label):(costumer.district),
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
    };

    

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
            <Button className="BtnBrown" onClick={handleShow} size="sm">
                <TiEdit/>
            </Button>

            <Modal show={show} onHide={handleClose}>
            <Form validated={validated} onSubmit={handleSubmit}>

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

                        <Row className="mb-3">
                            <Col lg={4}>
                            <Form.Group controlId="validationCustom03">
                                <Form.Label>Provincia</Form.Label>
                                <Select placeholder={costumer.province} defaultValue={costumer.province} options={provinciasArray}
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
                                <Select placeholder={costumer.canton} defaultValue={costumer.canton} options={cantonesOptions}
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
                                <Select placeholder={costumer.district}  defaultValue={costumer.district} options={distritosOptions}
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
                                    <Form.Control type="text-area" placeholder="Indique la dirección" ref={address} defaultValue={costumer.address} />
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
                                <Form.Control type="number" placeholder="Ingrese una cuenta bancaria" required ref={bankAccount}
                                    defaultValue={costumer.bankAccount} />
                                <Form.Control.Feedback type="invalid">
                                    Indique su código postal
                                </Form.Control.Feedback>
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
