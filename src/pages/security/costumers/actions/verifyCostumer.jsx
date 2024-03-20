import React, { useState } from 'react';
import { useMutation, QueryClient } from 'react-query';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { editCostumer } from '../../../../services/costumerService';
import { useRef } from 'react';
import Select from 'react-select';
import { RiPassValidLine } from "react-icons/ri";


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
            swal({
              title: "Editado!",
              text: "Se editó el cliente",
              icon: "success",
            }).then(function(){window.location.reload()});
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
                name: costumer.name,
                province: costumer.province,
                canton: costumer.canton,
                district: costumer.district,
                address: costumer.address,
                postalCode: costumer.postalCode,
                bankAccount: costumer.bankAccount,
                verified: selectedState.value,
                phoneNumber: costumer.phoneNumber,
                email: costumer.email,
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
            <Button className='BtnBrown' variant="primary" onClick={handleShow}>
            <RiPassValidLine />
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header className="HeaderModal" closeButton>
                    <Modal.Title>Verificación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form validated={validated} onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId="validationCustom01">
                                    <Form.Label>Estado de Verificación</Form.Label>
                                    <Select
                                        required
                                        options={options}
                                        placeholder={costumer.verified==true? "Verificado": "No verificado"}
                                        defaultValue={costumer.verified}
                                        name="state"
                                        ref={verification}
                                        onChange={(selectedOption) => setSelectedState(selectedOption)}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button className="BtnSave" onClick={handleSubmit}
                        type="submit">Guardar</Button>
                    <Button className="BtnClose"
                        variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    

                </Modal.Footer>
            </Modal>
        </>
    );
};

export default verifyCostumer;
