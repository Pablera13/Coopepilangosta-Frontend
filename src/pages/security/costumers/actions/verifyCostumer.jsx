import React, { useState } from 'react';
import { useMutation, QueryClient } from 'react-query';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { editCostumer } from '../../../../services/costumerService';
import { useRef } from 'react';
import Select from 'react-select';

const verifyCostumer = (props) => {
    const queryClient = new QueryClient();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [validated, setValidated] = useState(false);
    const [selectedState, setSelectedState] = useState(null);
    const options = [
        { value: false, label: "No verificado" },
        { value: true, label: "Verificado" },
      ];

    const costumer = props.props || {}; 

    const verification = useRef();

    const editCostumerMutation = useMutation('Costumer', editCostumer, {
        onSettled: () => queryClient.invalidateQueries('Costumer'),
        mutationKey: 'Costumer',
        onSuccess: () => {
            console.log('Edit successful');
        },
        onError: () => {
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
                name: costumer.name,
                province: costumer.province,
                canton: costumer.canton,
                district: costumer.district,
                address: costumer.address,
                postalCode: costumer.postalCode,
                bankAccount: costumer.bankAccount,
                verified: selectedState.value,
                userId: costumer.userId,
            };
            editCostumerMutation.mutateAsync(editCostumer).then(() => {
                setValidated(true);
                handleClose();
            });
        }
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow} size="sm">
                Verificación
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Verificación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form validated={validated} onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={4}>
                                <Form.Group controlId="validationCustom01">
                                    <Form.Label>Estado de Verificación</Form.Label>
                                        <Select
                                            options={options}
                                            placeholder='Seleccione'
                                            name="state"
                                            id="1"
                                            ref={verification}
                                            onChange={(selectedOption) => setSelectedState(selectedOption)}
                                        />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
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

export default verifyCostumer;
