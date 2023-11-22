import React, { useState } from 'react'
import { useRef } from 'react'
import { Container, Form, Button, InputGroup,Row,Col} from 'react-bootstrap'
import ChangePassword from './changePassword'
const checkCode = (props) => {
    console.log(props)
    const email = props.props.email;
    const [emailProps,setEmailProps] = useState()

    const codeGenerated = props.props.code;
    const [isChecked, setChecked] = useState(false)
    console.log("Codigo "+ codeGenerated +" EMail "+email)
    const code = useRef();

    const verifyCode = () => {
        if (code.current.value == codeGenerated) {
            setEmailProps({
                email:email
            })
            setChecked(true)          
        }
        else {
            return alert("Código incorrecto!")
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
                                <Form.Label>Ingrese el código que recibio: </Form.Label>
                                <Form.Control type="text" placeholder="Ingrese el código" ref={code} />
                            </Form.Group>
                        </Row>
                        <Button onClick={verifyCode}>
                            Confirmar
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