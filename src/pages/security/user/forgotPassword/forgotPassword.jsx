import React, { useState, useRef } from 'react';
import { Button, Row, Col, Form, InputGroup, Container, Alert, Card } from 'react-bootstrap';
import emailjs from 'emailjs-com';
import CheckCode from './checkCode';

const forgotPassword = () => {
    const [isSending, setIsSending] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const email = useRef();
    const [toCheck, setToCheck] = useState();

    function generateCode() {
        const length = 7;
        let code = '';
        for (let i = 0; i < length; i++) {
            const digit = Math.floor(Math.random() * 10); // Generate a random digit between 0 and 9
            code += digit;
        }
        return code;
    }

    const handleSubmit = async () => {
        if (email.current.value === "") {
            alert("Ingrese un correo");
        } else {
            const generatedCode = generateCode();
            setToCheck({
                code: generatedCode,
                email: email.current.value
            });

            let contact = email.current.value;
            setIsSending(true);

            await emailjs.send('service_segj454', 'template_4bv71ze', { message: generatedCode, emailto: contact }, 'VLTRXG-aDYJG_QYt-')
                .then(() => {
                    setIsSending(false);
                    setIsSuccess(true);
                })
                .catch(() => {
                    setIsError(true);
                });
        }
    };

    return (
        <>
            <Container>
                <Row className="justify-content-center Josefin">
                    <Col md={6}>
                        <Card>
                            <Card.Body className='cardContainerPass text-center'>
                                <h3>Restablecer contraseña</h3>
                                <br></br>

                                <Row className="justify-content-center">
                                    <Col>
                                        <Form className='text-center'>
                                            <Form.Group controlId="formGridEmail" className='text-center'>
                                                <Form.Label className='labelPass'>Correo electrónico</Form.Label>
                                                <Form.Control className='text-center' type="email" placeholder="Ingrese su correo" ref={email} disabled={isSuccess} />
                                            </Form.Group>
                                            <br></br>

                                            <Button onClick={handleSubmit} variant="primary" className="BtnStar" disabled={isSuccess}>
                                                {isSending ? "Enviando correo..." : "Recibir código"}
                                            </Button>
                                        </Form>
                                    </Col>
                                </Row>
                                <Row className="justify-content-center">
                                    <Col>
                                        {isError && <Alert variant="danger">Ocurrió un error al enviar el correo, inténtelo de nuevo más tarde.</Alert>}
                                        {isSuccess && <Alert variant="success">El correo ha sido enviado con el código para restablecer su contraseña.</Alert>}
                                    </Col>
                                </Row>
                                <Row className="justify-content-center">
                                    {isSuccess && <CheckCode props={toCheck} />}
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default forgotPassword;