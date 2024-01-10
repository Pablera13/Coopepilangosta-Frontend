import React, { useRef, useState } from 'react';
import { QueryClient, useMutation } from 'react-query';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import swal from 'sweetalert';
import { createProducer,CheckCedulaProducerAvailability } from '../../../../services/producerService';

const addProducerModal = () => {
    const [show, setShow] = useState(false);
    const queryClient = new QueryClient();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const buttonStyle = {
        borderRadius: '5px',
        backgroundColor: '#e0e0e0',
        color: '#333',
        border: '1px solid #e0e0e0',
        padding: '8px 12px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        minWidth: '100px',
        fontWeight: 'bold',
        hover: {
          backgroundColor: '#c0c0c0', 
        },
      };

    const [validated, setValidated] = useState(false);

    const mutation = useMutation('producer', createProducer, {
        onSettled: () => queryClient.invalidateQueries('producer'),
        mutationKey: 'producer',
        onSuccess: () => {
            swal({
                title: 'Agregado!',
                text: 'El productor ha sido agregado',
                icon: 'success',
            });
            

            
        },
    });

    const cedula = useRef();
    const name = useRef();
    const lastname1 = useRef();
    const lastname2 = useRef();
    const phoneNumber = useRef();
    const email = useRef();
    const province = useRef();
    const canton = useRef();
    const district = useRef();
    const address = useRef();
    const bankAccount = useRef();

    const saveProducer = async(event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            setValidated(true);
            let newProducer = {
                cedula: cedula.current.value,
                name: name.current.value,
                lastname1: lastname1.current.value,
                lastname2: lastname2.current.value,
                phoneNumber: phoneNumber.current.value,
                email: email.current.value,
                province: province.current.value,
                canton: canton.current.value,
                district: district.current.value,
                address: address.current.value,
                bankAccount: bankAccount.current.value,
            };

            let cedulaAvailability = await CheckCedulaProducerAvailability(cedula.current.value).then(data=>data)
            console.log(cedulaAvailability)
            
            if (cedulaAvailability == true) {              
                mutation.mutateAsync(newProducer);
            }else{
                event.preventDefault()
                swal('Advertencia','Ya existe un productor con el numero de cedula ingresado.','warning')
            }

        }
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

    return (
        <>
                <Button
                  onClick={handleShow}
                  size='sm'
                  style={{...buttonStyle, marginLeft: '5px',}}
                  onMouseOver={(e) => e.target.style.backgroundColor = buttonStyle.hover.backgroundColor}
                  onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                  >
                Agregar Productor
                  </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar nuevo productor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form validated={validated} onSubmit={saveProducer}>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="cedula">
                                    <Form.Label>Cédula</Form.Label>
                                    <Form.Control
                                        required
                                        type="number"
                                        placeholder="Ingrese la cédula"
                                        ref={cedula}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="phoneNumber">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control
                                        required
                                        type="number"
                                        placeholder="Ingrese el teléfono"
                                        ref={phoneNumber}
                                        onChange={handlePhoneChange}
                                    />
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
                                        placeholder="Ingrese el nombre"
                                        ref={name}
                                        onChange={handleNameChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="lastname1">
                                    <Form.Label>Primer Apellido</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Ingrese el primer apellido"
                                        ref={lastname1}
                                        onChange={handleLastNameChange}
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
                                        placeholder="Ingrese el segundo apellido"
                                        ref={lastname2}
                                        onChange={handleLastNameChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        required
                                        type="email"
                                        placeholder="Ingrese el email"
                                        ref={email}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <Form.Group controlId="province">
                                    <Form.Label>Provincia</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Ingrese la provincia"
                                        ref={province}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="canton">
                                    <Form.Label>Cantón</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Ingrese el cantón"
                                        ref={canton}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="district">
                                    <Form.Label>Distrito</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Ingrese el distrito"
                                        ref={district}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId="address">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Ingrese la dirección"
                                ref={address}
                            />
                        </Form.Group>
                        <Form.Group controlId="bankAccount">
                            <Form.Label>Cuenta Bancaria</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                placeholder="Ingrese la cuenta bancaria"
                                ref={bankAccount}
                            />
                        </Form.Group>

                        <Button variant="primary" size="sm" type="submit">
                            Guardar productor
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" size="sm" onClick={handleClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default addProducerModal;
