import React, { useState } from 'react'
import { useRef } from 'react'
import { Container, Form, Button, InputGroup,Row,Col} from 'react-bootstrap'
import ChangePassword from './changePassword'
import swal from 'sweetalert'
import './forgotPassword.css'



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
            return swal('El codigo no coincide.','El codigo ingresado no coincide con el codigo enviado.','error')
        }
    }
    return (
        <>
            <br />
            <Container>
                <Row>
                    <Form>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label className='labelPass' style={{color:'white'}}>Ingrese el código que recibio: </Form.Label>
                                <Form.Control type="text" placeholder="Ingrese el código" ref={code} disabled={isChecked}/>
                            </Form.Group>
                        </Row>
                        <Button onClick={verifyCode} className='BtnStar' disabled={isChecked}>
                            Verificar
                        </Button>
                    </Form>
                </Row>

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