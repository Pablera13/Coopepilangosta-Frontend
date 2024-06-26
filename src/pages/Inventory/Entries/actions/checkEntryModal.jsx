import { React, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProducerOrderById } from '../../../../services/producerorderService'
import { Table, Button, Col, Row, Container, Card, ListGroup, Accordion, Modal } from 'react-bootstrap'
import { checkEntryStatus } from '../../../../services/entriesService'
import './checkEntry.css'
import AddToWarehouse from './addToWarehouse'
import { TiArchive } from 'react-icons/ti'
import { FaWarehouse } from "react-icons/fa";
import { Tooltip } from '@mui/material';

const checkEntryModal = (props) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const open = () => {
        setProdOrderProps(props.props.id)
        console.log(prodOrder)
        console.log(props.props.id)
        handleShow()

    }

    const [prodOrder, setProdOrderProps] = useState()
    const [prodOrderById, setProdOrder] = useState()

    useEffect(() => {
        getProducerOrderById(prodOrder, setProdOrder).then(
            (data) => {
                data.purchases.forEach(element => {
                    checkStatus(data.id, element.product.id, element)
                });
            }
        )
    }, [prodOrder])

    const [NotAdded, setNotAdded] = useState([])
    const checkStatus = async (idProdOrder, idProduct, element) => {
        let existing = await checkEntryStatus(idProdOrder, idProduct).then(data => data)
        console.log(existing)
        if (existing == 0) {
            setNotAdded((prev) => [...prev, element])
        }
        console.log(NotAdded)
    }

    return (
        <>

            <Tooltip title="Ingresar">
                <Button className="BtnAdd" variant="primary" onClick={open}>
                    <FaWarehouse />
                </Button>
            </Tooltip>


            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                keyboard={false}
            >
                <Modal.Header className="HeaderModal" closeButton>
                    <Modal.Title>Ingreso de pedido</Modal.Title>
                </Modal.Header>

                {
                    prodOrderById != null ? (
                        <>
                            <Modal.Body>
                                <Row className='cards-order-producer'>
                                    <Col>
                                        <Card xs={6}>
                                            <Card.Body className='text-center'>
                                                <Card.Title className='card-info-title'>Pedido #{prodOrderById.id}</Card.Title>
                                                <Card.Text>

                                                </Card.Text>
                                            </Card.Body>
                                            <ListGroup className="list-group-flush text-center">
                                                <ListGroup.Item>Fecha del pedido: {prodOrderById.confirmedDate.slice(0, 10)}</ListGroup.Item>
                                                <ListGroup.Item>Fecha de recibido: {prodOrderById.deliveredDate.slice(0, 10)}</ListGroup.Item>
                                                <ListGroup.Item>Total del pedido: ₡{prodOrderById.total}</ListGroup.Item>
                                            </ListGroup>
                                            <Card.Body>

                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <Col xs={6}>
                                        <Card>

                                            <Card.Body className='text-center'>
                                                <Card.Title className='card-info-title '>Productor</Card.Title>
                                                <Card.Text>

                                                </Card.Text>
                                            </Card.Body>
                                            <ListGroup className="list-group-flush text-center">
                                                <ListGroup.Item>Cédula: {prodOrderById.producer.cedula}</ListGroup.Item>
                                                <ListGroup.Item>Nombre: {prodOrderById.producer.name + " " + prodOrderById.producer.lastname1 + " " + prodOrderById.producer.lastname2}</ListGroup.Item>
                                                <ListGroup.Item>Teléfono: {prodOrderById.producer.phoneNumber}</ListGroup.Item>
                                            </ListGroup>
                                            <Card.Body>

                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <div className='purchaseProductsInformation'>
                                            <div><Card.Title className='card-info-title text-center'>Productos sin ingresar</Card.Title>
                                            </div>
                                            <br />
                                            <div className='purchaseProducts'>
                                                <Table className='Table table-striped table-bordered table-hover table-sm'>
                                                    <thead className='thead-dark'>
                                                        <tr>
                                                            <th className='text-center'>Producto</th>
                                                            <th className='text-center'>Unidad</th>
                                                            <th className='text-center'>Cantidad</th>
                                                            <th className='text-center'>Acciones</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {NotAdded.map((purchases) => (
                                                            <tr key={purchases.id}>
                                                                <td className='text-center'>{purchases.product.name}</td>
                                                                <td className='text-center'>{purchases.product.unit}</td>
                                                                <td className='text-center'>{purchases.quantity}</td>
                                                                <td className='text-center'>
                                                                    <AddToWarehouse props={purchases} />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>

                                                <br />
                                                <div>
                                                    <Accordion>
                                                        <Accordion.Item eventKey="0">
                                                            <Accordion.Header className='text-center'>Todos los productos</Accordion.Header>
                                                            <Accordion.Body>
                                                                <Table className='Table table-striped table-bordered table-hover table-sm'>
                                                                    <thead className='thead-dark'>
                                                                        <tr>
                                                                            <th className='text-center'>Producto</th>
                                                                            <th className='text-center'>Unidad</th>
                                                                            <th className='text-center'>Cantidad</th>

                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {prodOrderById.purchases.map((purchases) => (
                                                                            <tr key={purchases.id}>
                                                                                <td className='text-center'>{purchases.product.name}</td>
                                                                                <td className='text-center'>{purchases.product.unit}</td>
                                                                                <td className='text-center'>{purchases.quantity}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </Table>

                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    </Accordion>

                                                </div>

                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                            </Modal.Body>
                            <Modal.Footer>
                                <Button className="BtnClose" variant="secondary" onClick={handleClose}>
                                    Cerrar
                                </Button>

                            </Modal.Footer>
                        </>
                    ) :
                        ("Cargando...")
                }
            </Modal>
        </>
    )
}

export default checkEntryModal