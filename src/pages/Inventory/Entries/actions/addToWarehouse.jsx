import { React, useRef, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { getWarehouse } from '../../../../services/warehouseService';
import { createEntry } from '../../../../services/entriesService';
import Select from 'react-select';
import { QueryClient, useMutation, useQuery } from 'react-query';
import { Container, Col, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import { updateStock } from '../../../../services/productService';
import { FaWarehouse } from "react-icons/fa";
import { createStockReport } from '../../../../services/reportServices/stockreportService';
import { checkProductStock } from '../../../../services/productService';
import { format } from 'date-fns';
import { getUserLocalStorage } from '../../../../utils/getLocalStorageUser';

const addToWarehouse = (props) => {
  const queryClient = new QueryClient();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [purchase, SetPurchase] = useState();
  const [validated, setValidated] = useState(false);

  const open = () => {
    SetPurchase(props)
    console.log(props)
    handleShow()
  }


  const [selectedWarehouse, setSelectedWarehouse] = useState()
  const { data: warehouse, isLoading: warehouseLoading, isError: warehouseError } = useQuery('warehouse', getWarehouse);

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
        .then(function(){window.location.reload()});
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

  const saveEntry = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();

      } else {

        setValidated(true);
        
        const userEmail = getUserLocalStorage().email;

        let newEntry = {
              quantity: props.props.quantity,
              entryDate: entryDate.current.value,
              expireDate: expireDate.current.value,
              producerOrderId: props.props.producerOrderId,
              productId: props.props.productId,
              warehouseId: selectedWarehouse
            }
            mutationEntry.mutateAsync(newEntry);

            let oldQuantity = await checkProductStock(props.props.productId);
            let newQuantity = oldQuantity + props.props.quantity

            const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd');

        const stockReportData = {
            ProductId: props.props.productId,
            ProductName: props.props.product.name,
            CambioFecha: formattedDate,
            OldStock: oldQuantity,
            NewStock: newQuantity ,
            motive: "Ingreso",
            Email: userEmail,
        };

        await updateStock(props.props.productId, newQuantity)
        await createStockReport(stockReportData)
    };
}

  return (
    <>

<div className="text-center">
<Button className='BtnBrown' onClick={open} size='sm'>
      <FaWarehouse />
      </Button> </div>

     

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="HeaderModal" closeButton>
          <Modal.Title>Agregar a una bodega</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col>
                <span>Seleccione la bodega</span>
                <Select  required options={warehouseOptions} onChange=
                  {(selectedOption) => setSelectedWarehouse(selectedOption.value)} placeholder='Seleccione la bodega'>
                </Select>
                <br/>
              </Col>
            </Row>
            <Row>
              <Col lg={10}>
                <span>Fecha de entrada</span><br />
                <input required type="datetime-local" ref={entryDate}/>
                <br/>
                <br/>

              </Col>
            </Row>
            <Row>
              <Col>
                <span>Fecha de vencimiento</span><br />
                <input required type="datetime-local" ref={expireDate}/>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button  className="BtnClose" variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button className="BtnSave" variant="primary" size='sm' onClick={saveEntry}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default addToWarehouse