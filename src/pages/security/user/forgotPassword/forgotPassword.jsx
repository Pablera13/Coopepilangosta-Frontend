import React, { useState, useRef } from 'react'
import { Button, Row, Col, Form, InputGroup, Container, Alert, Card } from 'react-bootstrap'
import emailjs from 'emailjs-com'
import CheckCode from './checkCode'
import ChangePassword from './changePassword'
import './forgotPassword.css'


const forgotPassword = () => {

    const [isSending, setIsSending] = useState(false);
    const [isError, setIsError] = useState(false)
    const [isSucces, setIsSucces] = useState(false);

    function generateCode() {
        const lenght = 7;
        let code = '';
        for (let i = 0; i < lenght; i++) {
            const digit = Math.floor(Math.random() * 10); // Genera un dígito aleatorio entre 0 y 9
            code += digit;
        }
        return code;
    }
    const email = useRef()
    const [toCheck, setToCheck] = useState()
    const handleSubmit = async () => {
        if (email.current.value == "") {
            return alert("Ingrese un correo")
        } else {
            const generatedCode = generateCode();

            setToCheck({
                code: generatedCode,
                email: email.current.value
            })

            let contact = email.current.value

            setIsSending(true)
            await emailjs.send('service_segj454', 'template_4bv71ze', { message: generatedCode, emailto: contact }, 'VLTRXG-aDYJG_QYt-')
                .then((response) => {
                    setIsSending(false)
                    setIsSucces(true)
                }, (err) => {
                    setIsError(true)
                    
                });

        }
    }

    return (
        <>
                    <div class="imagen-de-fondo"></div>

            
            <Container className='passContainer text-center"'>
                
                    <h3 style={{paddingLeft:'32px',paddingTop:'10px'}}>Restablecer contraseña</h3>
                    <br></br>
                    <Card.Body >
                        <Row>
                            <Form>
                                <Row className="mb-3 text-center">
                                    <Form.Group as={Col} controlId="formGridEmail">
                                        <Form.Label className='labelPass'>Correo electrónico</Form.Label>
                                        <Form.Control type="email" placeholder="Ingrese su correo" ref={email} disabled={isSucces}/>
                                    </Form.Group>
                                </Row>
                                <Button onClick={handleSubmit} className='BtnStar text-center"' disabled={isSucces}>
                                    Recibir código
                                </Button>
                            </Form>
                        </Row>
                        <Row>
                            <br />
                            <Col>
                                {isSending ?
                                    (
                                        <Alert variant={'info'}>
                                            Enviando correo...
                                        </Alert>
                                    ) : ("")}

                                {isSucces ? (
                                    <Alert variant={'success'}>
                                        El correo a sido enviado con el código para restaurar su contraseña.
                                    </Alert>)
                                    : ("")}
                                    {
                                        isError?(<Alert variant={'danger'}>
                                        Ocurrio un error al enviar el correo, intentelo mas tarde.
                                    </Alert>):("")
                                    }
                            </Col>
                        </Row>
                        <Row>
                            {
                                isSucces ? (
                                    <CheckCode props={toCheck} />
                                ) : ("")
                            }
                        </Row>

                    
                    </Card.Body>

            </Container>
        </>
    )
}

export default forgotPassword