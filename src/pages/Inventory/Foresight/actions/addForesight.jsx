import { React, useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Select from 'react-select';
import { Row, Col, Container } from 'react-bootstrap';
import { QueryClient, useMutation, useQuery } from 'react-query';
import { createForesightProducer } from '../../../../services/foresightProducerService';
import swal from 'sweetalert';
import { createForesight } from '../../../../services/foresightService';
import { getProducts } from '../../../../services/productService';
import { getProducers } from '../../../../services/producerService';
import "../../../../css/Pagination.css";
import "../../../../css/StylesBtn.css";
import { GrAddCircle } from "react-icons/gr";
const addForesight = () => {
  const queryClient = new QueryClient();

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false)
    setIsProductDisabled(false)
    setProducersAdded([])
  };
  const handleShow = () => setShow(true);

  
  const { data: producers, isLoading: producersLoading, isError: producersError } = useQuery('producer', getProducers);
  let optionsProducer = []
  const [selectedProducer, setSelecterProducer] = useState();

  const { data: products, isLoading: productsLoading, isError: productsError } = useQuery('product', getProducts);
  let optionsProduct = []
  const [selectedProduct, setSelectedProduct] = useState();
  if (products != null && producers != null) {
    optionsProduct = products.map((product) => ({
      value: product.id,
      label: product.name + " " + product.unit,
    }));
    optionsProducer = producers.map((producers) => ({
      value: producers.id,
      label: producers.name + " " + producers.lastname1,
    }));
  }

  
  const [isProductDisabled, setIsProductDisabled] = useState()
  useEffect(() => {
    if (selectedProduct) {
      setIsProductDisabled(true)
    }
  }, [selectedProduct]);

  const [producersAdded, setProducersAdded] = useState([])

  const handleProducerAdded = (producer) => {

    let existing = false;
    producersAdded.forEach(prod => {
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
      setProducersAdded((prevProducers) => [...prevProducers, newProducer])
      console.log(producersAdded)
    }

  }

  const handleRemovedProducer = (producer) => {
    console.log(producer)
    setProducersAdded(producersAdded.filter(p => p.id != producer))
  }
 
  const mutationForesight = useMutation("Foresight", createForesight,
    {
      onSettled: () => queryClient.invalidateQueries("Foresight"),
      mutationKey: "Foresight",
      onSuccess: () => console.log("foresight added")
    })

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
      }
    })

  const saveForesight = async () => {
    
    const miliseconds = Date.now();
    const today = new Date(miliseconds);
    today.setDate(today.getDate() - 1)

    let initialDate = today.toISOString()
    console.log("inicial: " + initialDate)

    let nextWeek = new Date(today.setDate(today.getDate() + 7))
    let endDate = nextWeek.toISOString()
    console.log("final: " + endDate)

    let newForesight = {
      initialDate: initialDate,
      endDate: endDate,
      idProduct: selectedProduct.value
    }
    const foresightAdded = await mutationForesight.mutateAsync(newForesight).finally(data => data)
    console.log(foresightAdded)

    producersAdded.map((newFproducer) => {
      let newforesightProducer = {
        producerId: newFproducer.id,
        foresightId: foresightAdded.id,
      };
      console.log(newFproducer)
      mutationForesightProd.mutateAsync(newforesightProducer)
    }
    )

  }

  return (
    <>
      <Button className='BtnSave' onClick={handleShow}>
        Agregar
      </Button>

      <Modal show={show} onHide={handleClose} size='lg' scrollable backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Agregar nueva prevision</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Row>
                <Col xs={12} md={8} lg={12}>
                  <h3 className="text-center">Seleccione un producto</h3><hr />
                  <Select options={optionsProduct} onChange=
                    {(selectedOption) => setSelectedProduct(selectedOption)} placeholder='Seleccione un producto'>
                  </Select>
           
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Row>
                <Col xs={12} md={8} lg={12}>
                  <h3 className="text-center">Seleccione el productor</h3><hr />
                  <Select options={optionsProducer} onChange=
                    {(selectedOption) => setSelecterProducer(selectedOption)} placeholder='Busqueda'>
                  </Select>
                  <br />
                  <Button className='BtnAdd' variant='secondary' size='sm' onClick={handleProducerAdded}><GrAddCircle /></Button>

                </Col>
              </Row>
            </Form.Group>
          </Form>
          <Row>
            <h3>Productores que seran agregados: </h3>
            <Col>
              <Table striped bordered hover variant="light" size='sm'>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    producersAdded != null ? (
                      producersAdded.map((producs) =>
                        <tr key={producs.id}>
                          <td>{producs.name}</td>
                          <td><Button size='sm' variant='danger' onClick={() => handleRemovedProducer(producs.id)}>Remover</Button></td>
                        </tr>
                      )
                    )
                      : ("Sin productores")
                  }

                </tbody>
              </Table>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button className='BtnClose' variant="secondary" size='sm' onClick={handleClose}>
            Cerrar
          </Button>
          <Button className='BtnSave' variant="primary" size='sm' onClick={saveForesight}>
            Guardar prevision
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default addForesight 