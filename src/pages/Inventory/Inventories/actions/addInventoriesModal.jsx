import React, { useRef, useState, useEffect } from 'react';
import { QueryClient, useMutation } from 'react-query';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import swal from 'sweetalert';
import { createStockReport } from '../../../../services/reportServices/stockreportService';
import { updateStock } from '../../../../services/productService';
import { NumbersOnly } from '../../../../utils/validateFields'
import { TiEdit } from "react-icons/ti";

const addInventoriesModal = (props) => {

    const product = props.props;
    const [show, setShow] = useState(false);
    const queryClient = new QueryClient();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [validated, setValidated] = useState(false);

    useEffect(() => {
        setInitialStock(product.stock);
    }, []);

    const mutationStock = useMutation('stock', createStockReport, {
        onSettled: () => queryClient.invalidateQueries('stock'),
        mutationKey: 'stock',
        onSuccess: () => {
            swal({
                title: 'Editado!',
                text: 'Las existencias han sido modificadas',
                icon: 'success',
            }).then(function () { window.location.reload() })

        },
    });

    const stock = useRef();
    const userEmail = JSON.parse(localStorage.getItem('user')).email;
    const [selectedMotive, setSelectedMotive] = useState(null);
    const [initialStock, setInitialStock] = useState(0);
    const [cambioFecha, setCambioFecha] = useState('');

    const motive = useRef()

    const saveEdit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {

            setValidated(true);
            await updateStock(product.id, stock.current.value)

            const stockReportData = {
                ProductId: product.id,
                ProductName: product.name,
                CambioFecha: new Date(cambioFecha),
                OldStock: initialStock,
                NewStock: stock.current.value,
                motive: motive.current.value,
                Email: userEmail,
            };

            mutationStock.mutateAsync(stockReportData)
        };
    }

    return (
        <>
            <Button
                onClick={handleShow}
                size='sm'
                className='BtnBrown
'
            >
                <TiEdit />
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header className='HeaderModal' closeButton>
                    <Modal.Title>Movimiento de inventario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form validated={validated} onSubmit={saveEdit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="cedula">
                                    <Form.Label>Stock Inicial</Form.Label>
                                    <Form.Control
                                        required
                                        type="number"
                                        defaultValue={product.stock}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>

                                <Form.Group controlId="cedula">
                                    <Form.Label>Nuevo Stock</Form.Label>
                                    <Form.Control
                                        required
                                        type="number"
                                        placeholder="Ingrese el nuevo stock"
                                        defaultValue={product.stock}
                                        min={0}
                                        ref={stock}
                                        onKeyDown={NumbersOnly}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <br></br>

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="phoneNumber">
                                    <Form.Label>Motivo</Form.Label>
                                    <Form.Select value={selectedMotive}
                                        placeholder="Seleccionar motivo"
                                        required
                                        onChange={(e) => { setSelectedMotive(e.target.value) }} ref={motive}>
                                        <option value="Venta">Venta</option>
                                        <option value="Regalía">Regalía</option>
                                        <option value="Devolución">Devolución</option>
                                        <option value="Producto Dañado">Producto Dañado</option>
                                        <option value="Ingreso">Aumento de Existencias</option>
                                        <option value="Prueba de mercado">Prueba de mercado</option>
                                        <option value="Otro">Otro</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="name">
                                    <Form.Label>Fecha del movimiento</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        required
                                        value={cambioFecha}
                                        onChange={(e) => setCambioFecha(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>

                        </Row>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="BtnSave" variant="primary" size="sm" onClick={saveEdit}>
                        Crear movimiento
                    </Button>
                    <Button className="BtnClose" variant="secondary" size="sm" onClick={handleClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default addInventoriesModal;
