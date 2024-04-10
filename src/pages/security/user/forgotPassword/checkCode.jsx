import React, { useState } from 'react'
import { useRef } from 'react'
import { Container, Form, Button, InputGroup,Row,Col} from 'react-bootstrap'
import ChangePassword from './changePassword'
import swal from 'sweetalert'



const checkCode = (props) => {
    const email = props.props.email;
    const [emailProps,setEmailProps] = useState()

    const codeGenerated = props.props.code;
    const [isChecked, setChecked] = useState(false)

    const code = useRef();

    const verifyCode = () => {
        if (code.current.value == codeGenerated) {
            setEmailProps({
                email:email
            })
            setChecked(true)          
        }
        else {
            return swal('El código no coincide.','El código ingresado no coincide con el código enviado.','error')
        }
    }
    return (
        <>
            <Container >
                    <Row className="justify-content-md-center">
                            <Col>
                            <Form.Label className='labelPass'>Ingrese el código que recibió</Form.Label>
                            <Form.Group controlId="formGridEmail">
                                <Form.Control type="text" placeholder="Ingrese el código" ref={code} disabled={isChecked}/>
                            </Form.Group>
                            </Col>
                        </Row>
                        <br></br>
                        <Button onClick={verifyCode} className='BtnStar' disabled={isChecked}>
                            Verificar
                        </Button>

                <Row>
                    {
                        isChecked?(
                            <ChangePassword props={emailProps}/>
                        ):("")
                    }
                </Row>

            </Container>
        </>
    )
}

export default checkCode