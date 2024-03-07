import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Card, ListGroup, CardGroup } from 'react-bootstrap'
import swal from 'sweetalert'
import CostumerProfile from './costumerProfile'
import EmployeeProfile from './employeeProfile'

import { MdDelete } from "react-icons/md";

export const UserProfile = () => {
    const [isCostumer, setIsCostumer] = useState(false);
    const [isEmployee, setIesEmployee] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (user.costumer != null) {
            setIsCostumer(true)
        }
        if (user.employee != null) {
            setIesEmployee(true)
        }
    }, [])

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
            </Container>
        </>
    )
}
