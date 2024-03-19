import React, { useRef, useState } from 'react'
import { Modal, Button, Row, Col, Form, InputGroup, Alert } from 'react-bootstrap'
import emailjs from 'emailjs-com'
const forgotPassword = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [validated, setValidated] = useState(false);

    const [isSending, setIsSending] = useState(false);
    const [isSucces, setIsSucces] = useState(false);

    const email = useRef()

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        let contact = email.current.value

        if (form.checkValidity() == true) {
            setValidated(true);
            setIsSending(true)
            
                await emailjs.send('service_segj454', 'template_4bv71ze', { message: "www.google.com", emailto: contact }, 'VLTRXG-aDYJG_QYt-')
                    .then((response) => {
                        console.log('SUCCESS!', response.status, response.text);
                        setIsSending(false)
                        setIsSucces(true)
                    }, (err) => {
                        console.log('FAILED...', err);
                        console.log(contact)
                    });         
        }
    }

    return (
        <>

            <Button variant="outline-secondary" onClick={handleShow} size='sm' >
                ¿Olvido su contraseña?
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>

                    <Modal.Title>Recuperar contraseña</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form validated={validated} onSubmit={handleSubmit}>
                        <Row>
                            <Form.Group className="mb-3" controlId="validationCustom01" as={Row}>
                                <InputGroup hasValidation>
                                    <Form.Label as={Row}>Correo electrónico: </Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Ingrese su correo"
                                        autoFocus
                                        ref={email}
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Row>

                        <Button variant="primary" size='sm' type='submit'>
                            Enviar correo para restablecer
                        </Button>
                    </Form>
                    <Row>
                        {
                            isSending == true ? (
                                <Alert variant={'info'}>
                                    Espere...
                                </Alert>
                            ) : ("")
                        }
                        {
                            isSucces == true ? (
                                <Alert variant={'success'}>
                                    Se envió el correo para restablecer la contraseña.
                                </Alert>
                            ) : (
                                ""
                            )
                        }
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

export default forgotPassword