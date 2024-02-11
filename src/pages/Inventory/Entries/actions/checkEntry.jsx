import { React, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProducerOrderById } from '../../../../services/producerorderService'
import { Table, Button, Col, Row, Container, Card, ListGroup, Accordion } from 'react-bootstrap'
import { checkEntryStatus } from '../../../../services/entriesService'
import './checkEntry.css'
import AddToWarehouse from './addToWarehouse'


const checkEntry = () => {
  let prodOrder = useParams()
  const [prodOrderById, setProdOrder] = useState()

  useEffect(() => {
    getProducerOrderById(prodOrder.producerorder, setProdOrder).then(
      (data) => {
        data.purchases.forEach(element => {
          checkStatus(data.id, element.product.id, element)
        });
      }
    )
  }, [])

  const [NotAdded, setNotAdded] = useState([])
  const checkStatus = async (idProdOrder, idProduct, element) => {
    let existing = await checkEntryStatus(idProdOrder, idProduct).then(data => data)
    console.log(existing)
    if (existing == 0) {
      setNotAdded((prev) => [...prev, element])
    }
    console.log(NotAdded)
  }

  if (prodOrderById != null) {



  }

  return (
    <>
      <Container className='containerProd'>
        <div className='title'><h1>Detalles del pedido al productor</h1></div>
        {
          prodOrderById != null ? (
            <>
              <Row className='cards-order-producer'>
                <Card style={{ width: '22rem' }} className='cardsinfo'>
                  {/* <Card.Img variant="top" src="holder.js/100px180?text=Image cap" /> */}
                  <Card.Body>
                    <Card.Title className='card-info-title'>Información general del pedido</Card.Title>
                    <Card.Text>

                    </Card.Text>
                  </Card.Body>
                  <ListGroup className="list-group-flush">
                    <ListGroup.Item>Numero de pedido: {prodOrderById.id}</ListGroup.Item>
                    <ListGroup.Item>Fecha del pedido: {prodOrderById.confirmedDate.slice(0, 10)}</ListGroup.Item>
                    <ListGroup.Item>Fecha de recibido: {prodOrderById.deliveredDate.slice(0, 10)}</ListGroup.Item>
                    <ListGroup.Item>Total del pedido: {prodOrderById.total}</ListGroup.Item>
                  </ListGroup>
                  <Card.Body>

                  </Card.Body>
                </Card>

                <Card style={{ width: '22rem' }} className='cardsinfo'>
                  {/* <Card.Img variant="top" src="holder.js/100px180?text=Image cap" /> */}
                  <Card.Body>
                    <Card.Title className='card-info-title'>Información del productor</Card.Title>
                    <Card.Text>

                    </Card.Text>
                  </Card.Body>
                  <ListGroup className="list-group-flush">
                    <ListGroup.Item>Cédula: {prodOrderById.producer.cedula}</ListGroup.Item>
                    <ListGroup.Item>Nombre: {prodOrderById.producer.name + " " + prodOrderById.producer.lastname1 + " " + prodOrderById.producer.lastname2}</ListGroup.Item>
                    <ListGroup.Item>Provincia: {prodOrderById.producer.province}</ListGroup.Item>
                    <ListGroup.Item>Cantón: {prodOrderById.producer.canton}</ListGroup.Item>
                    <ListGroup.Item>Distrito: {prodOrderById.producer.district}</ListGroup.Item>
                    <ListGroup.Item>Teléfono: {prodOrderById.producer.phoneNumber}</ListGroup.Item>
                  </ListGroup>
                  <Card.Body>

                  </Card.Body>
                </Card>
              </Row>

              <Row>
                <Col>
                  <div className='purchaseProductsInformation'>
                    <div><h3>Productos del pedido aun no agregados a bodega</h3></div>
                    <div className='purchaseProducts'>
                      <Table bordered>
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>

                          </tr>
                          {

                            NotAdded.map((purchases) =>
                              <tr key={purchases.id}>
                                <td>{purchases.product.name}</td>
                                <td>{purchases.quantity}</td>
                                <td>
                                  <AddToWarehouse props={purchases} />
                                </td>
                              </tr>
                            )
                          }
                        </thead>
                      </Table>
                      <br />
                      <div>
                        <Accordion>
                          <Accordion.Item eventKey="0">
                            <Accordion.Header>Todos los productos del pedido (Incluyendo ya en bodega)</Accordion.Header>
                            <Accordion.Body>
                              <table>
                                <thead>
                                  <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    prodOrderById.purchases.map((purchases) =>
                                      <tr key={purchases.id}>
                                        <td>{purchases.product.name}</td>
                                        <td>{purchases.quantity}</td>                                    

                                      </tr>)
                                  }
                                </tbody>
                              </table>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>

                      </div>
                    </div>
                  </div>
                </Col>
              </Row>


              <Row className="actions-container">
                <div className='title'>
                  <h3>Acciones</h3>
                </div>
                
                <Col lg={4}>
                  <div className='btn'>
                    <Button onClick={() => history.back()} size='sm'>Volver a la lista de pedidos</Button>
                  </div>
                </Col>
              </Row>
            </>
          ) :
            ("Cargando...")
        }
      </Container>
    </>
  )
}

export default checkEntry