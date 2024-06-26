import React, { useRef, useState } from 'react';
import { QueryClient, useMutation } from 'react-query';
import { Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import swal from 'sweetalert';
import { updateProducer } from '../../../../services/producerService';
import { LettersOnly, NumbersOnly } from '../../../../utils/validateFields'
import { locations } from '../../../../utils/provinces'
import Select from 'react-select'
import { TiEdit } from "react-icons/ti";
import '../../../../css/StylesBtn.css'
import { Tooltip } from '@mui/material';

const editProducerModal = (props) => {
    const [show, setShow] = useState(false);
    const queryClient = new QueryClient();
    const producer = props.props;

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [validated, setValidated] = useState(false);

    const mutation = useMutation('producer', updateProducer, {
        onSettled: () => queryClient.invalidateQueries('producer'),
        mutationKey: 'producer',
        onSuccess: () => {
            swal({
                title: 'Editado!',
                text: 'Se editó el productor',
                icon: 'success',
            }).then(function () { window.location.reload() });

        }
    });

    const cedula = useRef();
    const name = useRef();
    const lastname1 = useRef();
    const lastname2 = useRef();
    const phoneNumber = useRef();
    const email = useRef();
    const address = useRef();
    const bankAccount = useRef();

    const saveProducer = async (event) => {

        event.preventDefault();
        const formFields = [cedula, name, lastname1, lastname2, phoneNumber, email, address, bankAccount];
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

        let newProducer = {
            id: producer.id,
            cedula: cedula.current.value,
            name: name.current.value,
            lastname1: lastname1.current.value,
            lastname2: lastname2.current.value,
            phoneNumber: phoneNumber.current.value,
            email: email.current.value,
            province: selectedProvincia != null ? (selectedProvincia.label) : (producer.province),
            canton: selectedCanton ? (selectedCanton.label) : (producer.canton),
            district: selectedDistrito ? (selectedDistrito.label) : (producer.district),
            address: address.current.value,
            bankAccount: bankAccount.current.value,
        };


        mutation.mutateAsync(newProducer);
    };

    const handleNameChange = (event) => {
        event.target.value = event.target.value.replace(/[^a-zA-Z ]/g, '');
    };

    const handleLastNameChange = (event) => {
        event.target.value = event.target.value.replace(/[^a-zA-Z ]/g, '');
    };

    const handlePhoneChange = (event) => {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
    };

    const [selectedProvincia, setSelectedProvincia] = useState(null);
    const [selectedCanton, setSelectedCanton] = useState(null)
    const [selectedDistrito, setSelectedDistrito] = useState(null);


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

            <Tooltip title="Editar">
                <Button className='BtnBrown' onClick={handleShow} size='sm'>
                    <TiEdit />
                </Button>
            </Tooltip>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header className='HeaderModal' closeButton>
                    <Modal.Title>Editar productor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form validated={validated} onSubmit={saveProducer}>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="cedula">
                                    <Form.Label>Cédula</Form.Label>
                                    <Form.Control
                                        required
                                        min={1}
                                        readOnly={true}
                                        type="number"
                                        defaultValue={producer.cedula}
                                        placeholder="Ingrese la cédula"
                                        ref={cedula}
                                        onKeyDown={NumbersOnly}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="phoneNumber">
                                    <Form.Label>Teléfono</Form.Label>
                                    <InputGroup>
                                    <InputGroup.Text>+506</InputGroup.Text>
                                    <Form.Control
                                        required
                                        type="number"
                                        min={1}
                                        defaultValue={producer.phoneNumber}
                                        placeholder="Ingrese el teléfono"
                                        ref={phoneNumber}
                                        onChange={handlePhoneChange}
                                        onKeyDown={NumbersOnly}
                                    />
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="name">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        defaultValue={producer.name}
                                        placeholder="Ingrese el nombre"
                                        ref={name}
                                        onChange={handleNameChange}
                                        onKeyDown={LettersOnly}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="lastname1">
                                    <Form.Label>Primer Apellido</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        defaultValue={producer.lastname1}
                                        placeholder="Ingrese el primer apellido"
                                        ref={lastname1}
                                        onChange={handleLastNameChange}
                                        onKeyDown={LettersOnly}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="lastname2">
                                    <Form.Label>Segundo Apellido</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        defaultValue={producer.lastname2}
                                        placeholder="Ingrese el segundo apellido"
                                        ref={lastname2}
                                        onChange={handleLastNameChange}
                                        onKeyDown={LettersOnly}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        required
                                        type="email"
                                        defaultValue={producer.email}
                                        placeholder="Ingrese el email"
                                        ref={email}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <Form.Group controlId="validationCustom03">
                                    <Form.Label>Provincia</Form.Label>
                                    <Select placeholder={producer.province} options={provinciasArray}
                                        onChange={(selected) => { handleProvinciasSelectChange(selected.value); setSelectedProvincia(selected); }}
                                        on
                                    ></Select>
                                    <Form.Control.Feedback type="invalid">
                                        Ingrese su provincia
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="validationCustom04">
                                    <Form.Label>Canton</Form.Label>
                                    <Select placeholder={producer.canton} options={cantonesOptions}
                                        onChange={(selected) => { setSelectedCanton(selected); handlecantonesSelectChange(selected.value); }}
                                    ></Select>
                                    <Form.Control.Feedback type="invalid">
                                        Por favor indique el cantón
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="validationCustom05">
                                    <Form.Label>Distrito</Form.Label>
                                    <Select placeholder={producer.district} options={distritosOptions}
                                        onChange={(selected) => setSelectedDistrito(selected)}
                                    ></Select>
                                    <Form.Control.Feedback type="invalid">
                                        Indique su distrito!.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId="address">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                defaultValue={producer.address}
                                placeholder="Ingrese la dirección"
                                ref={address}
                            />
                        </Form.Group>
                        <Form.Group controlId="bankAccount">
                            <Form.Label>Cuenta IBAN</Form.Label>
                            <InputGroup>
                            <InputGroup.Text>CR</InputGroup.Text>
                            <Form.Control
                                required
                                min={1}
                                type="number"
                                defaultValue={producer.bankAccount}
                                placeholder="Ingrese la cuenta bancaria"
                                ref={bankAccount}
                            />
                            </InputGroup>
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='BtnSave' variant="primary" size="sm" onClick={saveProducer}>
                        Actualizar productor
                    </Button>
                    <Button className='BtnClose' variant="secondary" size="sm" onClick={handleClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default editProducerModal;
