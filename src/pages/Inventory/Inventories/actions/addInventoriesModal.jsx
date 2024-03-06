import React, { useRef, useState, useEffect } from 'react';
import { QueryClient, useMutation } from 'react-query';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import swal from 'sweetalert';
import { createStockReport } from '../../../../services/reportServices/stockreportService';
import { editProduct } from '../../../../services/productService';
import { TiEdit } from "react-icons/ti";

const addInventoriesModal = (props) => {

    const product = props.props;
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

    const mutationProduct = useMutation('product', editProduct, {
        onSettled: () => queryClient.invalidateQueries('product'),
        mutationKey: 'product',
        onSuccess: () => {
            swal({
                title: 'Editado!',
                text: 'Las existencias han sido modificadas',
                icon: 'success',
            })
            handleClose()
            setTimeout(function () {
                window.location.reload();
            }, 2000);
        },
    });

    useEffect(() => {
        setInitialStock(product.stock);
    }, []);

    const mutationStock = useMutation('stock', createStockReport, {
        onSettled: () => queryClient.invalidateQueries('stock'),
        mutationKey: 'stock',
    });

    const stock = useRef();
    const userEmail = JSON.parse(localStorage.getItem('user')).email;
    const [selectedMotive, setSelectedMotive] = useState('');
    const [initialStock, setInitialStock] = useState(0);
    const [cambioFecha, setCambioFecha] = useState('');

    const saveEdit = async (event) => {
        console.log("dx")


        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            console.log("No esta entrando")
        } else {
            setValidated(true);

            console.log("No esta entrando")
            const editProductData = {
                id: product.id,
                code: product.code,
                name: product.name,
                description: product.description,
                stock: stock.current.value,
                unit: product.unit,
                price: product.price,
                margin: product.margin,
                iva: product.iva,
                state: product.state,
                categoryId: product.categoryId,
                image: product.image,
            };

            const stockReportData = {
                ProductId: product.id,
                ProductName: product.name,
                CambioFecha: new Date(cambioFecha),
                OldStock: initialStock,
                NewStock: stock.current.value,
                motive: selectedMotive,
                Email: userEmail,
            };

            mutationProduct.mutateAsync(editProductData)
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
                Editar <TiEdit />
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header className='HeaderModal'closeButton>
                    <Modal.Title>Movimiento de inventario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form validated={validated} onSubmit={saveEdit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="cedula">
                                    <Form.Label>Stock</Form.Label>
                                    <Form.Control
                                        required
                                        type="number"
                                        placeholder="Ingrese el nuevo stock"
                                        defaultValue={product.stock}
                                        min={0}
                                        ref={stock}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="phoneNumber">
                                    <Form.Label>Motivo</Form.Label>
                                    <select value={selectedMotive}
                                        placeholder="Seleccionar motivo"
                                        required
                                        onChange={(e) => setSelectedMotive(e.target.value)}>
                                        <option value="regalía">Regalía</option>
                                        <option value="venta">Venta</option>
                                        <option value="devolución">Devolución</option>
                                        <option value="producto dañado">Producto Dañado</option>
                                        <option value="aumento">Aumento de Existencias</option>
                                        <option value="prueba de mercado">Prueba de mercado</option>
                                    </select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <br></br>
                                <Form.Group controlId="name">
                                    <Form.Label>Fecha del movimiento</Form.Label>
                                    <input
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
