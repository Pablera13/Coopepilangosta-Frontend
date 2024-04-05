import React, { useState, useEffect, useRef } from 'react'
import { QueryClient, useMutation, useQuery } from "react-query";
import { useParams } from 'react-router-dom'
import { format } from 'date-fns';
import Select from 'react-select';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { editProducerOrder } from '../../../../services/producerorderService';
import swal from 'sweetalert';
import { TiEdit } from 'react-icons/ti';


const updateProducerOrderModal = (props) => {

    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const producerorder = props.props;

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleOpen = () => {
        handleShow()
    }

    const queryClient = new QueryClient();
    const mutation = useMutation("producerorder", editProducerOrder,
        {
            onSettled: () => queryClient.invalidateQueries("producerorder"),
            mutationKey: "producerorder",
            onSuccess: () => {
                swal('Actualizado exitosamente!', 'El pedido fue actualizado de correctamente', 'success').then(function(){window.location.reload()});
                
            },
            onError:()=>{
                swal('Error','Verifique los campos seleccionados','error')
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
        if (producerorder) {
            const isPaid = producerorder.paidDate !== "0001-01-01T00:00:00";
            setSelectedPaid(optionsPaid.find(option => option.value === isPaid));

            const isDelivered = producerorder.paidDelivered !== "0001-01-01T00:00:00";
            setSelectedDelivered(optionsDelivered.find(option => option.value === isDelivered));
        }
    }, [producerorder]);


    const saveEdit = async (event) => {

        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {

            setValidated(true);
        const currentDate = new Date();
        const formattedDate = format(currentDate, 'yyyy-MM-dd');

        let edit = {
           id: producerorder.id,
            ProducerId: producerorder.producerId,
            Detail: producerorder.detail,
            Total: producerorder.total,
            ConfirmedDate: producerorder.confirmedDate,
            paidDate: selectedPaid.value == false ? "0001-01-01T00:00:00" : formattedDate,
            deliveredDate: selectedDelivered.value == false ? "0001-01-01T00:00:00" : formattedDate
        }

        mutation.mutateAsync(edit);
        console.log(edit)
        limpiarInput()
    }}
    
    return (
<>
        
        <Button className='BtnBrown' onClick={handleOpen} size='sm' >
        <TiEdit />
   </Button>
   

   <Modal show={show} onHide={handleClose}>
       <Modal.Header className='HeaderModal' closeButton>
           <Modal.Title>Editar pedido</Modal.Title>
       </Modal.Header>
       <Modal.Body>
       <Form validated={validated} onSubmit={saveEdit}>
               <Row>
                   <Col md={6}>
                       <Form.Group controlId="cédula">
                           <Form.Label>Estado de pago</Form.Label>
                           <Select
                           options={optionsPaid}
                           required
                           placeholder=
                           {producerorder.paidDate === "0001-01-01T00:00:00"
                           ? "Sin pagar"
                           : format(new Date(producerorder.paidDate), 'yyyy-MM-dd')}

                           defaultValue={producerorder.paidDate}
                           name="state"
                           id="1"
                           ref={paid}
                           onChange={(selectedOption) => setSelectedPaid(selectedOption)}
                       />
                       </Form.Group>
                   </Col>
               </Row>

               <Row>
                   <Col md={6}>
                       <Form.Group controlId="name">
                           <Form.Label>Estado de entrega</Form.Label>
                           <Select
                           options={optionsDelivered}
                           required
                           placeholder=
                           {producerorder.deliveredDate === "0001-01-01T00:00:00"
                           ? "Sin entregar"
                           : format(new Date(producerorder.deliveredDate), 'yyyy-MM-dd')}

                           name="state"
                           defaultValue={producerorder.deliveredDate}
                           id="2"
                           ref={delivered}
                           onChange={(selectedOption) => setSelectedDelivered(selectedOption)}
                       />
                       </Form.Group>
                   </Col>
               </Row> 
           </Form>
       </Modal.Body>
       <Modal.Footer>
       <Button className='BtnSave' variant="primary" size="sm" onClick={saveEdit}>
                   Actualizar pedido
               </Button>
           <Button className='BtnClose' variant="secondary" size="sm" onClick={handleClose}>
               Cerrar
           </Button>
       </Modal.Footer>
   </Modal>
</>
    );
};

export default updateProducerOrderModal