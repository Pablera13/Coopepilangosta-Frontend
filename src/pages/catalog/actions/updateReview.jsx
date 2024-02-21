import React, { useRef, useState } from 'react'
import { Modal, Col, Row, Container, Button, Form } from 'react-bootstrap'
import {ReviewUpdate} from '../../../services/reviewService';
import {QueryClient, useMutation, useQuery } from 'react-query';
import { format } from 'date-fns';
import { TiEdit } from "react-icons/ti";
import './updateReview.css';

const updateReview = (props) => {

const queryClient = new QueryClient();


  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [review, setReview] = useState(null);
  const handleOpen = () => {
    handleShow()
    setReview(props.props);
    console.log(props.props)
  }

  const description = useRef();

  const updateReviewMutation = useMutation('review', ReviewUpdate, 
    {
      onSettled: () => queryClient.invalidateQueries('review'),
      mutationKey: 'review',
      onSuccess: () => window.location.reload(),
    })

    const [starsChecked, setStarsChecked] = useState(false);


async function star1Checked() {setStarsChecked(1)}
async function star2Checked() {setStarsChecked(2)}
async function star3Checked() {setStarsChecked(3)}
async function star4Checked() {setStarsChecked(4)}
async function star5Checked() {setStarsChecked(5)}

  const handleUpdate = () =>{

    const today = new Date();
    const formattedDate = format(today, 'yyyy-MM-dd')

    let toUpdaterReview={
      id: review.id,
      description:description.current.value,
      stars: starsChecked,
      productId: review.productid,
      costumerId:review.customerid,
      reviewDate:formattedDate,
    }
    console.log(toUpdaterReview)
    updateReviewMutation.mutateAsync(toUpdaterReview);
  }
  return (
    <>
      <Button onClick={handleOpen} 
      className="BtnEditReview"
     >
        Editar <TiEdit/>
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className='HdEditReview' closeButton>
          <Modal.Title>Actualizar valoración del producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            review != null ? (
              <Form>
                    <Form.Label>Valoración</Form.Label>
                <p className="clasificacion">
                                  <input id="radio6" type="radio" name="estrellas" value="5" onChange={star5Checked} />
                                  <label className='Star' htmlFor="radio6">★</label>
                                  <input id="radio7" type="radio" name="estrellas" value="4" onChange={star4Checked}/>
                                  <label className='Star' htmlFor="radio7">★</label>
                                  <input id="radio8" type="radio" name="estrellas" value="3" onChange={star3Checked}/>
                                  <label className='Star' htmlFor="radio8">★</label>
                                  <input id="radio9" type="radio" name="estrellas" value="2" onChange={star2Checked}/>
                                  <label className='Star' htmlFor="radio9">★</label>
                                  <input id="radio10" type="radio" name="estrellas" value="1" onChange={star1Checked}/>
                                  <label className='Star' htmlFor="radio10">★</label>
                                </p>
                <Row>
                  <Col>
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control  as="textarea"
                    rows={7}placeholder="Ingrese su nombre" defaultValue={review.description} ref={description}/>
                  </Col>
                </Row>
              </Form>
            ) : ("")
          }

        </Modal.Body>
        <Modal.Footer>
          <Button className='BtnSaveReview' variant="primary" size='sm' onClick={handleUpdate}>Guardar</Button>
          <Button className='BtnReturnReview' variant="secondary" size='sm' onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default updateReview