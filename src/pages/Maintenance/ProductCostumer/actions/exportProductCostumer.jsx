import React, { useRef, useState, useEffect } from 'react'
import { Modal, Row, Col, Button, Form } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query';
import { QueryClient } from 'react-query';
import { createProductCostumer } from '../../../../services/productCostumerService.js';
import {getCostumers} from '../../../../services/costumerService';
import './exportProductCostumer.css'

export const exportProductCostumer = (props) => {

    const queryClient = new QueryClient();
    const [show, setShow] = useState(false);
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
            let costumerOptions = []
            for (const costumer of costumers) {
                let costumerOption = {
                    id: costumer.id,
                    name: costumer.name
                }
                costumerOptions.push(costumerOption)
            } setCostumersArray(costumerOptions)
        }
    };


    const handleSelect = (event) => {

        let costumer = {
            id: event.target.value,
            name: event.target.name
        }
        const isChecked = event.target.checked;

        if (isChecked) {
            setCheckedList([...checkedList, costumer]);

        } else {
            const filteredList = checkedList.filter((costumer) => costumer.id !== costumer.id);
            setCheckedList(filteredList);
        }

        console.log("checkedList :" + checkedList)
    };


    const mutation = useMutation('productcostumer', createProductCostumer, {
        onSettled: () => queryClient.invalidateQueries('productcostumer'),
        mutationKey: 'productcostumer',
        onSuccess: () => {
            swal({
                title: 'Agregado!',
                text: 'Gracias por su tiempo',
                icon: 'success',
            }); setTimeout(function () {
                window.location.reload();
            }, 2000);
        },
    });

    const saveProductCostumer = async () => {

        if (checkedList.length > 0) {

            const exportedCotizacion = props.props
            for (const costumer of checkedList) {

                let productcostumer = {
                    productId: exportedCotizacion.productId,
                    costumerId: costumer.id,
                    purchasePrice: exportedCotizacion.purchasePrice,
                    description: exportedCotizacion.description,
                    margin: exportedCotizacion.margin,
                    unit: exportedCotizacion.productUnit,
                }
                mutation.mutateAsync(productcostumer);
            }
        }
    };


    return (
        <>
            <Button variant="info" onClick={handleShow} size='sm'>
                Exportar
            </Button>


            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header className='HeaderModal' closeButton>
                    <Modal.Title>Exportar cotización</Modal.Title>
                </Modal.Header>
                <Modal.Body>


                    {CostumersArray.length > 0 ?

                        <Form>
                            <Row>
                                <Col>

                                    {/* <div className="list-container">

                                        <Modal.Title>Su selección:</Modal.Title>
                                        <br/>
                                        {checkedList.map((costumer) => {
                                            return (
                                                <div>
                                                    <label>{costumer.name}</label>
                                                    
                                                </div>
                                                
                                            );
                                        })}

                                    </div> */}

                                    <div className="card-body">
                                        {CostumersArray.map((costumer) => {
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
                                        })}
                                    </div>

                                </Col>
                            </Row>
                        </Form>

                        : "Cargando..."}

                </Modal.Body>
                <Modal.Footer>
                   
                    <Button className='BtnSave' size='sm' onClick={saveProductCostumer}>Exportar</Button>
                    <Button className='BtnClose' size='sm' onClick={handleClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default exportProductCostumer
