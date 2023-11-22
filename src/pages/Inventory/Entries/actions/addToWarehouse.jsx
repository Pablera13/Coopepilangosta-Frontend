import { React, useRef, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { getWarehouse } from '../../../../services/warehouseService';
import { createEntry } from '../../../../services/entriesService';
import Select from 'react-select';
import { QueryClient, useMutation, useQuery } from 'react-query';
import { Container, Col, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import moment from 'moment/moment';

import { getDate } from 'date-fns';
const addToWarehouse = (props) => {
  const queryClient = new QueryClient();
  //Metodos del modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //Capturar el el pedido de las props
  const [purchase, SetPurchase] = useState();

  const open = () => {
    SetPurchase(props)
    console.log(props)
    handleShow()
  }

  //console.log(producerOrder.purchases.length)
  //Conocer la bodega seleccionado con un usestate
  const [selectedWarehouse, setSelectedWarehouse] = useState()
  const { data: warehouse, isLoading: warehouseLoading, isError: warehouseError } = useQuery('warehouse', getWarehouse);
  //Llenar las opciones del select
  let warehouseOptions = []
  if (warehouse != null) {
    warehouseOptions = warehouse.map((warehouse) => ({
      value: warehouse.id,
      label: warehouse.description,
    }));
  }

  const mutationEntry = useMutation("entries", createEntry,
    {
      onSettled: () => queryClient.invalidateQueries("entries"),
      mutationKey: "entries",
      onSuccess: () => {
        swal('Guardado!', 'Se agrego el pedido a la bodega!', 'success')
        setTimeout(() => {
          handleClose()
        }, 1500);
        console.log("entries added")
      },
      onError:(data)=>{
        switch (data.response.status){
          case 409: swal('Registro ya creado','Este producto del pedido ya fue agregado.','error')
        }
      }
    })

  const entryDate = useRef();
  const expireDate = useRef()
  const saveEntry = () => {
    let newEntry = {
      quantity: props.props.quantity,
      entryDate: entryDate.current.value,
      expireDate: expireDate.current.value,
      producerOrderId: props.props.producerOrderId,
      productId: props.props.productId,
      warehouseId: selectedWarehouse
    }
    console.log(newEntry)
    mutationEntry.mutateAsync(newEntry);
  }

  var now = new Date();

  const currentDate = now.toISOString();
  console.log(moment(now).format("yyyy-MM-ddThh:mm"))
  const dateInput = moment(now).format("yyyy-MM-ddThh:mm:ss.SSS")
  return (
    <>
      <Button variant="primary" onClick={open} size='sm'>
        Agregar a una bodega
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Agregar el pedido a una bodega</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col>
                <span>Seleccione la bodega a la que se agregara el pedido: </span>
                <Select options={warehouseOptions} onChange=
                  {(selectedOption) => setSelectedWarehouse(selectedOption.value)} placeholder='Seleccione la bodega'>
                </Select>

              </Col>
            </Row>
            <Row>
              <Col lg={10}>
                <span>Ingrese la fecha de entrada</span><br />
                <input type="datetime-local" ref={entryDate}/>
              </Col>
            </Row>
            <Row>
              <Col>
                <span>Ingrese la fecha de vencimiento</span><br />
                <input type="datetime-local" ref={expireDate} min={currentDate}/>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" size='sm' onClick={saveEntry}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default addToWarehouse