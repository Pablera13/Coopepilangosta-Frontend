import { React, useEffect, useState } from 'react'
import Select from 'react-select';
import { Modal, Button, Col, Row, Container, Form, ListGroup, Table } from 'react-bootstrap';
import { getProducers } from '../../../../services/producerService';
import { useQuery, QueryClient, useMutation } from 'react-query';
import { createForesightProducer, deleteForesightProducer } from '../../../../services/foresightProducerService';
import { Alert } from 'react-bootstrap';
import { TiEdit } from "react-icons/ti";
import "../../../../css/Pagination.css";
import "../../../../css/StylesBtn.css";

const updateForesight = (props) => {
    const queryClient = new QueryClient();

    let foresight = props.props
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const clear = () => {
        producersInList = []
        handleClose()
    }

    let producersInList = []

    if (foresight.foresightproducers) {
        foresight.foresightproducers.map((item) => {
            producersInList.push(item.producer)
        })
    }


    const [selectedProducer, setSelectedProducer] = useState()
    const { data: producers, isLoading: producersLoading, isError: producersError } = useQuery('producer', getProducers);

    let optionsProducer = [] 

    let optionsSelect = [] 

    if (producers) {
        optionsProducer = producers.map((producers) => ({
            value: producers.id,
            label: producers.name + " " + producers.lastname1,
        }))
    };
   
    if (producersInList.length == 0) {
        optionsSelect = optionsProducer
    } else if (producersInList.length != 0) {
        producersInList.map((inlist) => {
            optionsSelect = optionsProducer.filter((option) => option.value != inlist.id)
        }
        )
    }

  
    const [newProducers, setnewProducers] = useState([])

    const handleNewProducer = () => {

        let existing = false;
        newProducers.forEach(prod => {
            if (prod.id == selectedProducer.value) {
                existing = true
                console.log("This producer has been already added")

            }
        })

        if (existing == false) {
            let newProducer = {
                id: selectedProducer.value,
                name: selectedProducer.label
            }
            setnewProducers((prevProducers) => [...prevProducers, newProducer])

         
        }
    }

    const deleteForesightProducerMutation = useMutation("Foresightproducer", deleteForesightProducer,
        {
            onSettled: () => queryClient.invalidateQueries("Foresightproducer"),
            mutationKey: "Foresightproducer",
            onSuccess: () => {
                swal({
                    title: 'Eliminado!',
                    text: `Se elimino el productor de la lista`,
                    icon: "success"
                })
                
            },
            onError: () => {
                swal('Error', 'No se pudo eliminar el producto', 'error')
            }
        })

    const handleDeleteProducer = (foresightproducerId) => {
        let find = foresight.foresightproducers.find((producer) => producer.producerId = foresightproducerId)

        deleteForesightProducerMutation.mutateAsync(find.id)
    }

    const handleRemoveProducer = (idProducer) => {
        console.log(idProducer)
        setnewProducers(newProducers.filter(p => p.id != idProducer))
    }

    const mutationForesightProd = useMutation("Foresightproducer", createForesightProducer,
        {
            onSettled: () => queryClient.invalidateQueries("Foresightproducer"),
            mutationKey: "Foresightproducer",
            onSuccess: () => {
                swal({
                    title: 'Agregado!',
                    text: `Se agrego la prevision`,
                    icon: "success"
                })
                .then(function(){window.location.reload()});
            },
            onError: () => {
                swal('Error', 'No se guardaron los cambios', 'error')
            }
        })

    const saveChanges = () => {

        newProducers.map((newFproducer) => {
            let newforesightProducer = {
                producerId: newFproducer.id,
                ForesightId: foresight.id,
            };
            console.log(newforesightProducer)
            mutationForesightProd.mutateAsync(newforesightProducer)
        }
        )
    }

    return (
        <>
            <Button className='BtnBrown' onClick={handleShow} size='sm'>
            <TiEdit />
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Editar prevision</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Row>
                            <h3>Productores en lista: </h3>
                            <Col>
                                <Table striped bordered hover variant="light" size='sm'>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            producersInList != null ? (
                                                producersInList.map((producs) =>
                                                    <tr key={producs.id}>
                                                        <td>{producs.name + " "+producs.lastname1   }</td>
                                                        <td>
                                                            <Button size='sm' variant='outline-danger' onClick={() => handleDeleteProducer(producs.id)}>
                                                                Eliminar
                                                            </Button>
                                                            </td>
                                                    </tr>
                                                )
                                            )
                                                : ("Sin productores")
                                        }

                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        
                        <h3 className="text-center">Seleccione al nuevo productor</h3><hr />
                        <Select options={optionsSelect} onChange=
                            {(selectedOption) => setSelectedProducer(selectedOption)} placeholder='Busqueda'>
                        </Select>
                        <Button className='BtnAdd' size='sm' onClick={handleNewProducer}>Agregar agregar a la lista</Button>

                        <Row>
                            <h3>Productores que serán agregados: </h3>
                            <Col>
                                <Table striped bordered hover variant="light" size='sm'>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            newProducers != null ? (
                                                newProducers.map((newProducer) =>
                                                    <tr key={newProducer.id}>
                                                        <td>{newProducer.name }</td>
                                                        <td>
                                                            <Button size='sm' variant='outline-danger' onClick={() => handleRemoveProducer(newProducer.id)}>
                                                                Remover
                                                            </Button>
                                                            </td>
                                                    </tr>
                                                )
                                            )
                                                : ("Sin productores")
                                        }

                                    </tbody>
                                </Table>
                            </Col>
                        </Row>

                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='BtnAdd' onClick={clear}>
                        Cancelar
                    </Button>
                    <Button className='BtnAdd' onClick={saveChanges}>Guardar cambios</Button>
                </Modal.Footer>
            </Modal>
        </>
    );

}

export default updateForesight