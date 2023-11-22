import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Card, ListGroup, CardGroup } from 'react-bootstrap'
import swal from 'sweetalert'
import CostumerProfile from './costumerProfile'
import EmployeeProfile from './employeeProfile'
export const UserProfile = () => {
    const [isCostumer, setIsCostumer] = useState(false);
    const [isEmployee, setIesEmployee] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));
    // console.log(user)

    useEffect(() => {
        if (user.costumer != null) {
            setIsCostumer(true)
        }
        if (user.employee != null) {
            setIesEmployee(true)
        }
    }, [])

    const handleLogout = () => {
        swal({
            title: "Cerrar session",
            text: "Esta seguro?",
            icon: "warning",
            buttons: ["Cancelar", "Aceptar"]
        }).then(answer => {
            if (answer) {
                swal({
                    title: 'Se cerro la sesión!',
                    text: `Volverá a sitio principal`,
                    icon: "success"

                })
                setTimeout(function () {
                    localStorage.removeItem('user');
                    localStorage.removeItem('bearer');
                    window.location = '/';
                }, 2000)
            }
        })
    }

    return (
        <>
        <Container>
            {
                isCostumer ? (
                    
                        <CostumerProfile />
                    
                ) : (
                    isEmployee ? (
                        <EmployeeProfile />
                    ) : ("")
                )
            }
            <Row>
                <Col>
                    <Button onClick={handleLogout} variant='warning'>Cerrar sesión</Button>
                </Col>
            </Row>
            </Container>
        </>
    )
}
