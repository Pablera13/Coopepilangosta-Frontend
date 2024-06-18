import React from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'

const NotFound = () => {
    return (
        <Container style={{marginBottom:'14%'}}>
            <Row className='text-center'>
                <Col>
                    <h1 className='text-decoration-underline'>
                        404 - Recurso en encontrado
                    </h1>
                </Col>
            </Row>

            <Row className='text-center'>
                <Col>
                <a href="/">
                    <Button className='BtnSave'>
                        Volver al inicio
                    </Button>
                </a>

                </Col>
            </Row>
        </Container>
    )
}

export default NotFound