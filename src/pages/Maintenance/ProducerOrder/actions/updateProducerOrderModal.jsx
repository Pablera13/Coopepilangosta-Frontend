import React, { useState, useEffect, useRef } from 'react'
import { QueryClient, useMutation, useQuery } from "react-query";
import { useParams } from 'react-router-dom'
import { format } from 'date-fns';
import Select from 'react-select';
import { Button, Modal, Card } from 'react-bootstrap';
import { getProducerOrderById } from '../../../../services/producerorderService';
import { editProducerOrder } from '../../../../services/producerorderService';

import { NavLink } from 'react-router-dom';


import { getProducerOrder } from '../../../../services/producerorderService';
import swal from 'sweetalert';
import { TiEdit } from 'react-icons/ti';


const updateProducerOrderModal = (props) => {
    const queryClient = new QueryClient();

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [idProducerOrder, setIdProducerorder] = useState();

    const open = () => {
        setIdProducerorder(props.props)
        handleShow()

    }



    const [producerorderRequest, setProducerorder] = useState(null)

    const { data, isLoading, isError } = useQuery('producerorder', getProducerOrder);


    useEffect(() => {
        getProducerOrderById(idProducerOrder, setProducerorder)
    }, [idProducerOrder])



    const mutation = useMutation("producerorder", editProducerOrder,
        {
            onSettled: () => queryClient.invalidateQueries("producerorder"),
            mutationKey: "producerorder",
            onSuccess: () => {
                swal('Actualizado!', 'Se actualizo la informacion del pedido.', 'success')
                .then(function(){window.location.reload()})
            }
        })

    const [selectedPaid, setSelectedPaid] = useState(null);
    const [selectedDelivered, setSelectedDelivered] = useState(null);

    const optionsPaid = [
        { value: false, label: "Sin pagar" },
        { value: true, label: "Pagado" },
    ];

    const optionsDelivered = [
        { value: false, label: "No recibido" },
        { value: true, label: "Recibido" },
    ];

    const paid = useRef();
    const delivered = useRef();

    useEffect(() => {
        if (producerorderRequest) {
            const isPaid = producerorderRequest.paidDate !== "0001-01-01T00:00:00";
            setSelectedPaid(optionsPaid.find(option => option.value === isPaid));

            const isDelivered = producerorderRequest.paidDelivered !== "0001-01-01T00:00:00";
            setSelectedDelivered(optionsDelivered.find(option => option.value === isDelivered));
        }
    }, [producerorderRequest]);


    const saveEdit = () => {

        const currentDate = new Date();
        const formattedDate = format(currentDate, 'yyyy-MM-dd');

        console.log("Supuestamente el pedido " + producerorderRequest)

        let edit = {

            id: producerorderRequest.id,
            ProducerId: producerorderRequest.producerId,
            Detail: producerorderRequest.detail,
            Total: producerorderRequest.total,
            ConfirmedDate: producerorderRequest.confirmedDate,
            paidDate: selectedPaid.value == false ? "0001-01-01T00:00:00" : formattedDate,
            deliveredDate: selectedDelivered.value == false ? "0001-01-01T00:00:00" : formattedDate

        };

        console.log(edit)

        mutation.mutateAsync(edit);
        limpiarInput()
    }
    const limpiarInput = () => {
        paid.current.value = "";
        delivered.current.value = "";
    }

    return (
        <>
            <Button onClick={open} className="BtnBrown" size='sm'>
                <TiEdit />
            </Button>
            <Modal show={show} onHide={handleClose}>

                <Modal.Header className="HeaderModal" closeButton>
                    <Modal.Title>Editar estados del pedido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <div>
                                <span>Estado de pago:</span>
                                <Select
                                    options={optionsPaid}
                                    placeholder='Seleccione'
                                    name="state"
                                    id="1"
                                    ref={paid}
                                    onChange={(selectedOption) => setSelectedPaid(selectedOption)}
                                />
                            </div>

                            <div>
                                <span>Estado de entrega:</span>
                                <Select
                                    options={optionsDelivered}
                                    placeholder='Seleccione'
                                    name="state"
                                    id="2"
                                    ref={delivered}
                                    onChange={(selectedOption) => setSelectedDelivered(selectedOption)}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Modal.Body>
                <Modal.Footer>
                   
                    <div className='BtnContainer'>
                        <button onClick={saveEdit} className="BtnSave">ACTUALIZAR PRODUCTO</button>

                    </div>
                </Modal.Footer>

            </Modal>
        </>
    );
};

export default updateProducerOrderModal