import React, { useRef, useState, useEffect } from 'react';
import { QueryClient, useMutation, useQuery } from 'react-query';
import { Modal, Button, Form, Row, Col, Table } from 'react-bootstrap';
import { editProduct } from '../../../../services/productService';
import { getVolumeDiscount } from '../../../../services/volumeDiscount';
import { createVolumeDiscount } from '../../../../services/volumeDiscount';
import {deleteVolumeDiscount} from '../../../../services/volumeDiscount';

import swal from 'sweetalert';
import './volumeDiscountStyle.css';

const volumeDiscountModal = (props) => {

    const [cotizacionRequest, setCotizacion] = useState([]);

    useEffect(() => {
        console.log("Cotizacion id" + props.props)
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
            });
            handleClose()
            setTimeout(function () {
                window.location.reload();
            }, 2000)
        },
        onError: () => {
            swal('Error', 'Algo salio mal...', 'error')
        }
    });

    const price = useRef();
    const volume = useRef();

    const save = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            setValidated(true);
        }
        if (form.checkValidity() === true) {

            let newvolumediscount = {
                price: price.current.value,
                volume: volume.current.value,
                productCostumerId: props.props,
            };

            mutation.mutateAsync(newvolumediscount);
        }
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
            });
            setTimeout(function () {
              window.location.reload();
            }, 2000);
          }
        });
      };

    return (
        <>
            <Button className='BtnAdd' onClick={handleShow} size='sm'>
                Volúmenes
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header className='HdVolume' closeButton>
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
                                        ref={volume} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            
                        </Row>

                        {cotizacionRequest != null && cotizacionRequest.length > 0? (
                            <Row>
                                <Col md={8}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Lista de descuentos por volúmenes</Form.Label>

                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>Precio</th>
                                                    <th>Volumen</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cotizacionRequest.map((object, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                        ₡{object.price}
                                                        </td>
                                                        <td>
                                                            {object.volume}
                                                        </td>
                                                        <td>
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

                <Button className='BtnSaveVolume' variant="primary" size="sm" onClick={save}>
                                Guardar
                            </Button>
                    <Button className='BtnReturnVolume' variant="secondary" size="sm" onClick={handleClose}>
                        Cerrar
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    );
};

export default volumeDiscountModal;

