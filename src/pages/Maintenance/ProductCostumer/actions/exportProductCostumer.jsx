import React, { useRef, useState, useEffect } from 'react';
import { Modal, Row, Col, Button, Form } from 'react-bootstrap';
import { useMutation, useQuery } from 'react-query';
import { QueryClient } from 'react-query';
import { createProductCostumer } from '../../../../services/productCostumerService.js';
import { getCostumers } from '../../../../services/costumerService';
import './exportProductCostumer.css';
import { LuListChecks } from 'react-icons/lu';
import '../../../../css/Pagination.css';
import '../../../../css/StylesBtn.css';
import { Tooltip } from '@mui/material';

export const exportProductCostumer = (props) => {
    const queryClient = new QueryClient();
    const [show, setShow] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [CostumersArray, setCostumersArray] = useState([]);
    const [checkedList, setCheckedList] = useState([]);
    const { data: costumers } = useQuery('costumer', getCostumers);

    useEffect(() => {
        if (costumers) {
            FillCostumers();
        }
    }, [costumers]);

    const FillCostumers = async () => {
        if (costumers) {
            let costumerOptions = [];
            for (const costumer of costumers) {
                let costumerOption = {
                    id: costumer.id,
                    name: costumer.name,
                };
                costumerOptions.push(costumerOption);
            }
            setCostumersArray(costumerOptions);
        }
    };

    const handleSelect = (event) => {
        let costumer = {
            id: event.target.value,
            name: event.target.name,
        };
        const isChecked = event.target.checked;

        if (isChecked) {
            setCheckedList([...checkedList, costumer]);
        } else {
            const filteredList = checkedList.filter((item) => item.id !== costumer.id);
            setCheckedList(filteredList);
        }
    };

    const mutation = useMutation('productcostumer', createProductCostumer, {
        onSettled: () => queryClient.invalidateQueries('productcostumer'),
        mutationKey: 'productcostumer',
        onSuccess: () => {
            swal({
                title: 'Exportado!',
                text: 'La cotización ha sido exportada',
                icon: 'success',
            }).then(function () {
                window.location.reload();
            });
        },
    });

    const saveProductCostumer = async () => {
        if (checkedList.length > 0) {
            const exportedCotizacion = props.props;
            for (const costumer of checkedList) {
                let productcostumer = {
                    productId: exportedCotizacion.productId,
                    costumerId: costumer.id,
                    purchasePrice: exportedCotizacion.purchasePrice,
                    description: exportedCotizacion.description,
                    margin: exportedCotizacion.margin,
                    unit: exportedCotizacion.productUnit,
                };
                mutation.mutateAsync(productcostumer);
            }
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredCostumers = CostumersArray.filter((costumer) =>
        costumer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            

            <Tooltip title="Exportar">
            <Button className="BtnBrown" onClick={handleShow} size="sm">
                <LuListChecks />
            </Button>
            </Tooltip>

            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header className="HeaderModal" closeButton>
                    <Modal.Title>Exportar cotización</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col>
                                <div className="search-container text-center">
                                    <Form.Control
                                        type="text"
                                        placeholder="Buscar cliente..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                                <br/>
                                <div className="card-body">
                                    {filteredCostumers.length > 0 ? (
                                        filteredCostumers.map((costumer) => {
                                            return (
                                                <div key={costumer.id} className="checkbox-container">
                                                    <input
                                                        type="checkbox"
                                                        name={costumer.name}
                                                        value={costumer.id}
                                                        onChange={handleSelect}
                                                    />
                                                    <label>{costumer.name}</label>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p>No se encontraron clientes</p>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="BtnSave" size="sm" onClick={saveProductCostumer}>
                        Exportar
                    </Button>
                    <Button className="BtnClose" size="sm" onClick={handleClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default exportProductCostumer;
