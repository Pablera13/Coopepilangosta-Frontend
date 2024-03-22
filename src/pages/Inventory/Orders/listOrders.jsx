import React, { useRef, useState, useEffect } from 'react';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import ListProducerOrder from '../../Maintenance/ProducerOrder/listProducerOrder';
import ListEntries from '../Entries/listEntries';
import Select from 'react-select';
import { NavLink, Navigate, useNavigate   } from 'react-router-dom';

const ListOrders = () => {
   

    const optionsSelect = [
        { value: 'all', label: 'Todos los pedidos' },
        { value: 'paid', label: 'Pedidos pagados' },
        { value: 'notpaid', label: 'Pedidos sin pagar' },
        { value: 'delivered', label: 'Pedidos recibidos' },
        { value: 'notdelivered', label: 'Pedidos sin recibir' }
    ];

    const [selectedOption, setSelectedOption] = useState();

    const navigate = useNavigate()

    useEffect(() => {
        if (selectedOption != null) {

            navigate(`/listProducerOrder/${selectedOption.value}`)

            console.log("Entro al effect")
        }
    }, [selectedOption]);

    return (
        <Container>
            <Row className="justify-content-md-center" lg={10}>
                
                <Col lg={3}>
                    <span>Seleccione los pedidos que desea ver:</span>
                </Col>
                <Col lg={3}>
                    <Select onChange={(selected) => setSelectedOption(selected)} options={optionsSelect} />
                </Col>
                
                <Col>
                    <NavLink to="/addProducerOrder">Agregar nuevo pedido</NavLink>
                </Col>
            </Row>
        </Container>
    );
};

export default ListOrders;
