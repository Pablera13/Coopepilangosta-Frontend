import React, { useState } from 'react'
import { Modal, Row, Col, Table, Button } from 'react-bootstrap'

const detailsCostumer = (props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [costumerProps, setCostumerProps] = useState(null);

    const handleOpen = () =>{
        handleShow()
        setCostumerProps(props.props);
        
    }
    
    return (
        <>
            <Button variant="outline-primary" onClick={handleOpen} size='sm' >
                Detalles
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Información del cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                    <Table>
                        <thead>
                            <tr>
                                <th>Nombre contacto</th>
                                <th>Medio de contacto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                costumerProps !=null?(costumerProps.costumersContacts.map((contact)=>
                                <>
                                <tr>
                                    <td>{contact.name}</td>
                                    <td>{contact.contact}</td>
                                </tr>
                                </>
                                )):
                                ("Espere...")                                   
                          } 
                        </tbody>
                    </Table>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default detailsCostumer