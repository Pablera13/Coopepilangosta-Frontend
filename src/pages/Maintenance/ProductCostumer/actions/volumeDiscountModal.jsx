import React, { useRef, useState, useEffect } from 'react';
import { QueryClient, useMutation } from 'react-query';
import { Modal, Button, Form, Row, Col, Table } from 'react-bootstrap';
import { getVolumeDiscount } from '../../../../services/volumeDiscount';
import { createVolumeDiscount } from '../../../../services/volumeDiscount';
import { deleteVolumeDiscount } from '../../../../services/volumeDiscount';
import { Tooltip } from '@mui/material';

import swal from 'sweetalert';

import "../../../../css/Pagination.css";
import "../../../../css/StylesBtn.css";

import { MdPercent } from "react-icons/md";
const volumeDiscountModal = (props) => {

    const [cotizacionRequest, setCotizacion] = useState([]);

    useEffect(() => {
        const cotizacionId = props.props;
        if (cotizacionId) {
            getVolumeDiscount(cotizacionId, setCotizacion)
        }
    }, [props]);

    const [validated, setValidated] = useState(false);
    const queryClient = new QueryClient();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const mutation = useMutation('volumediscount', createVolumeDiscount, {
        onSettled: () => queryClient.invalidateQueries('volumediscount'),
        mutationKey: 'volumediscount',
        onSuccess: () => {
            swal({
                title: 'Creado!',
                text: 'Se creó el descuento de volumen',
                icon: 'success',
            }).then(function () { window.location.reload() });
        },
        onError: () => {
            swal('Error', 'Algo salio mal...', 'error')
        }
    });

    const price = useRef();
    const volume = useRef();

    const save = async (event) => {

        event.preventDefault();
        const formFields = [price, volume];
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

        let newvolumediscount = {
            price: price.current.value,
            volume: volume.current.value,
            productCostumerId: props.props,
        };

        mutation.mutateAsync(newvolumediscount);
    };

    const showAlert = (id) => {
        swal({
            title: 'Eliminar',
            text: '¿Está seguro de que desea eliminar este volumen?',
            icon: 'warning',
            buttons: ['Cancelar', 'Aceptar'],
        }).then((answer) => {
            if (answer) {
                deleteVolumeDiscount(id);
                swal({
                    title: 'Eliminado',
                    text: 'El descuento ha sido eliminado',
                    icon: 'success',
                }).then(function () { window.location.reload() });
            }
        });
    };

    return (
        <>


            <Tooltip title="Descuentos">
                <Button className='BtnAdd' onClick={handleShow} size='sm'>
                    <MdPercent />
                </Button>
            </Tooltip>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header className='HeaderModal' closeButton>
                    <Modal.Title>Descuentos por volumen</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form validated={validated} onSubmit={save}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Precio unitario</Form.Label>
                                    <Form.Control
                                        required
                                        type="number"
                                        placeholder="Ingrese el precio unitario"
                                        autoFocus
                                        min={1}
                                        ref={price} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Volumen</Form.Label>
                                    <Form.Control
                                        required
                                        type="number"
                                        placeholder="Ingrese el volumen"
                                        min={1}
                                        ref={volume} />

                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>

                        </Row>

                        {cotizacionRequest != null && cotizacionRequest.length > 0 ? (
                            <Row>
                                <Col md={8}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Lista de descuentos por volúmenes</Form.Label>

                                        <Table className='Table' striped bordered hover size='sm'>
                                            <thead>
                                                <tr>
                                                    <th style={{ textAlign: 'center' }}>Precio</th>
                                                    <th style={{ textAlign: 'center' }}>Volumen</th>
                                                    <th style={{ textAlign: 'center' }}>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cotizacionRequest.map((object, index) => (
                                                    <tr key={index}>
                                                        <td style={{ textAlign: 'center' }}>₡{object.price}</td>
                                                        <td style={{ textAlign: 'center' }}>{object.volume}</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            <Button className='BtnDeleteVolume' variant='danger' onClick={() => showAlert(object.id)}>
                                                                Eliminar
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>

                                    </Form.Group>
                                </Col>
                            </Row>
                        ) : "No existen descuentos por volúmenes"}

                    </Form>
                </Modal.Body>

                <Modal.Footer>

                    <Button className='BtnSave' variant="primary" size="sm" onClick={save}>
                        Guardar
                    </Button>
                    <Button className='BtnClose' variant="secondary" size="sm" onClick={handleClose}>
                        Cerrar
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    );
};

export default volumeDiscountModal;

