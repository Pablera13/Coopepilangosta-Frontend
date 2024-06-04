import React, { useState, useEffect, useRef } from 'react'
import { QueryClient, useMutation, useQuery } from "react-query";
import { format } from 'date-fns';
import Select from 'react-select';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { editCostumerOrder } from '../../../../services/costumerorderService';
import { TiEdit } from "react-icons/ti";
import { Tooltip } from '@mui/material';

import swal from 'sweetalert';

const updateCustomerOrderModal = (props) => {

    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const customerorder = props.props;

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleOpen = () => {
        handleShow()
    }

    const queryClient = new QueryClient();
    const mutation = useMutation("producerorder", editCostumerOrder,
        {
            onSettled: () => queryClient.invalidateQueries("producerorder"),
            mutationKey: "producerorder",
            onSuccess: () => {
                swal('Actualizado exitosamente!', 'El pedido fue actualizado correctamente', 'success').then(function(){window.location.reload()});
                
            },
            onError:()=>{
                swal('Error','Verifique los campos seleccionados','error')
            }
            
        })

    const [selectedPaid, setSelectedPaid] = useState(null);
    const [selectedDelivered, setSelectedDelivered] = useState(null);
    const [selectedStage, setSelectedStage] = useState(null);

    const optionsPaid = [
        { value: false, label: "Sin pagar" },
        { value: true, label: "Pagado" },
    ];

    const optionsDelivered = [
        { value: false, label: "No recibido" },
        { value: true, label: "Recibido" },
    ];



    const optionsStage = [
        { value: 1, label: "Sin confirmar" },
        { value: 2, label: "Confirmado" },
        { value: 3, label: "En preparación" },
        { value: 4, label: "En ruta de entrega" },
        { value: 5, label: "Entregado" },
        { value: 6, label: "Cancelado" },
        { value: 7, label: "Devuelto" },
    ];

    const paid = useRef();
    const delivered = useRef();
    const stage = useRef();


    const [optionStageFiltered, setStagesFiltered] = useState(null)

    useEffect(() => {
        if (customerorder) {
            const isPaid = customerorder.paidDate !== "0001-01-01T00:00:00";
            setSelectedPaid(optionsPaid.find(option => option.value === isPaid));

            const isDelivered = customerorder.paidDelivered !== "0001-01-01T00:00:00";
            setSelectedDelivered(optionsDelivered.find(option => option.value === isDelivered));

            const findCurrentStage = optionsStage.find(optionsStage => optionsStage.label == customerorder.stage)
            setSelectedStage(findCurrentStage.label);

            let currentState = optionsStage.find(stage => stage.label == customerorder.stage)
            setStagesFiltered(optionsStage.filter(stage => stage.value <= (currentState.value + 1) && stage.value >= currentState.value))

        }
    }, [customerorder]);


    const saveEdit = async (event) => {

        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {

            setValidated(true);
        const currentDate = new Date();
        const formattedDate = format(currentDate, 'yyyy-MM-dd');

        let edit = {
            id: customerorder.id,
            Total: customerorder.total,
            CostumerId: customerorder.costumerId,
            ConfirmedDate: customerorder.confirmedDate,
            paidDate: selectedPaid.value == false ? "0001-01-01T00:00:00" : formattedDate,
            deliveredDate: selectedDelivered.value == false ? "0001-01-01T00:00:00" : formattedDate,
            Detail: customerorder.detail,
            Stage: selectedStage != null ? selectedStage.label : customerorder.stage,
            address: customerorder.address
        };

        mutation.mutateAsync(edit);
        console.log(edit)
        limpiarInput()
    }}

    return (
        <>
        <Tooltip title="Editar">

        <Button className='BtnBrown' onClick={handleOpen} size='sm' >
                 <TiEdit />
            </Button>
</Tooltip>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header className='HeaderModal' closeButton>
                    <Modal.Title>Editar pedido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form validated={validated} onSubmit={saveEdit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="cedula">
                                    <Form.Label>Estado de pago</Form.Label>
                                    <Select
                                    options={optionsPaid}
                                    required
                                    placeholder=
                                    {customerorder.paidDate === "0001-01-01T00:00:00"
                                    ? "Sin pagar"
                                    : format(new Date(customerorder.paidDate), 'yyyy-MM-dd')}

                                    defaultValue={customerorder.paidDate}
                                    name="state"
                                    id="1"
                                    ref={paid}
                                    onChange={(selectedOption) => setSelectedPaid(selectedOption)}
                                />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="name">
                                    <Form.Label>Estado de entrega</Form.Label>
                                    <Select
                                    options={optionsDelivered}
                                    required
                                    placeholder=
                                    {customerorder.deliveredDate === "0001-01-01T00:00:00"
                                    ? "Sin entregar"
                                    : format(new Date(customerorder.deliveredDate), 'yyyy-MM-dd')}

                                    name="state"
                                    defaultValue={customerorder.deliveredDate}
                                    id="2"
                                    ref={delivered}
                                    onChange={(selectedOption) => setSelectedDelivered(selectedOption)}
                                />
                                </Form.Group>
                            </Col>
                        </Row> 

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="name">
                                    <Form.Label>Seguimiento del pedido</Form.Label>
                                    <Select
                                    options={optionStageFiltered}
                                    required
                                    placeholder=
                                    {customerorder.stage}

                                    name="state"
                                    id="3"
                                    defaultValue={customerorder.stage}
                                    ref={stage}
                                    onChange={(selectedOption) => setSelectedStage(selectedOption)}
                                />
                                </Form.Group>
                            </Col>
                        </Row> 

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button className='BtnSave' variant="primary" size="sm" onClick={saveEdit}>
                            Actualizar pedido
                        </Button>
                    <Button className='BtnClose' variant="secondary" size="sm" onClick={handleClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default updateCustomerOrderModal;
