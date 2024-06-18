import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import { format } from 'date-fns';
import { useMutation } from 'react-query';
import { getReviewById } from '../../services/reviewService';
import { getCostumerByIdNoState } from '../../services/costumerService';
import { Tooltip } from '@mui/material';

import { createReview } from '../../services/reviewService';
import { deleteReview } from '../../services/reviewService';
import ReviewEdit from './actions/updateReview'
import { MdDelete } from "react-icons/md";

import { es } from 'date-fns/locale';

import './listReview.css';
import { getUserLocalStorage } from '../../utils/getLocalStorageUser';

const listReview = (productid) => {

  const [reviewRequest, setReviewRequest] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [costumerId, setCostumerId] = useState([]);
  const [reviewAs, setReviewAs] = useState([]);
  const [verified, setVerified] = useState([]);
  const [validated, setValidated] = useState(false);

  const description = useRef();
  const [starsChecked, setStarsChecked] = useState(false);
  const [reviewsToShow, setReviewsToShow] = useState(3);
  const [reviewsIncrement, setReviewsIncrement] = useState(3);

  const loadMoreReviews = () => {
    setReviewsToShow(reviewsToShow + reviewsIncrement);
  };

  useEffect(() => {
    const User = getUserLocalStorage()
    if (User) {
      const UserObjet = getUserLocalStorage()
      if (UserObjet.role.name == 'Cliente') {
        const UserId = UserObjet.costumer.id
        const verified = UserObjet.costumer.verified

        const name = "Comentar como " + UserObjet.costumer.name + ". Tu dirección de correo electrónico no será publicada."
        setCostumerId(UserId)
        setVerified(verified)
        setReviewAs(name)
      } else {

      }
    }
  }, []);

  useEffect(() => {
    async function obtainReview() {
      await getReviewById(productid.productid, setReviewRequest);
    }
    obtainReview();
  }, [productid.productid]);

  useEffect(() => {
    async function fetchCostumerNames() {
      if (reviewRequest && reviewRequest.length > 0) {
        const reviewsArray = [];

        for (const review of reviewRequest) {
          const costumer = await getCostumerByIdNoState(review.costumerId);
          const formattedDate = format(new Date(review.reviewDate), 'MMMM dd, yyyy', { locale: es });
          const reviewObject = {
            id: review.id,
            customername: costumer.name,
            customerid: review.costumerId,
            productid: review.productId,
            description: review.description,
            stars: review.stars,
            reviewDate: formattedDate,
          };
          reviewsArray.push(reviewObject);
        }
        setReviews(reviewsArray);
      }
    }
    fetchCostumerNames();
  }, [reviewRequest]);

  const mutation = useMutation('review', createReview, {
    onSettled: () => queryClient.invalidateQueries('review'),
    mutationKey: 'review',
    onSuccess: () => {
      swal({
        title: 'Agregado!',
        text: 'Gracias por su tiempo',
        icon: 'success',
      }).then(function () { window.location.reload() });
    },
  });

  const saveReview = async (event) => {

    event.preventDefault();
    const formFields = [description];
    let fieldsValid = true;

    formFields.forEach((fieldRef) => {
      if (!fieldRef.current.value) {
        fieldsValid = false;
      }
    });

    if (!fieldsValid) {
      setValidated(true);
      return;
    } else {
      setValidated(false);
    }

    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd');

    let newReview = {
      description: description.current.value,
      stars: starsChecked,
      productId: productid.productid,
      costumerId: costumerId,
      reviewDate: formattedDate,
    };

    mutation.mutateAsync(newReview);
  }

  async function star1Checked() { setStarsChecked(1) }
  async function star2Checked() { setStarsChecked(2) }
  async function star3Checked() { setStarsChecked(3) }
  async function star4Checked() { setStarsChecked(4) }
  async function star5Checked() { setStarsChecked(5) }

  const showAlert = (id) => {
    swal({
      title: 'Eliminar',
      text: '¿Está seguro de que desea eliminar esta valoración?',
      icon: 'warning',
      buttons: ['Cancelar', 'Aceptar'],
    }).then((answer) => {
      if (answer) {
        deleteReview(id);
        swal({
          title: 'Eliminado',
          text: 'La valoración ha sido eliminada',
          icon: 'success',
        }).then(function () { window.location.reload() });
      }
    });
  };

  return (
    <Container className="mt-3 ">


      {verified == true ?
        <Card className="mb-3 Josefin">
          <Card.Body>
            <Form validated={validated} onSubmit={saveReview}>
              <Form.Group controlId="reviewTextArea">

                <Form.Label>¿Recibiste y probaste nuestro producto? En Coopepilangosta R.L. nos encantaría conocer tu opinión. Comparte tus pensamientos y ayúdanos a mejorar. ¡Tu feedback importa!</Form.Label>
                <br>
                </br>
                <br>
                </br>
                <form>
                  <p className="clasificacion text-center">
                    <input id="radio11" type="radio" name="estrellas" value="5" onChange={star5Checked} />
                    <label className='Star' htmlFor="radio11">★</label>
                    <input id="radio12" type="radio" name="estrellas" value="4" onChange={star4Checked} />
                    <label className='Star' htmlFor="radio12">★</label>
                    <input id="radio13" type="radio" name="estrellas" value="3" onChange={star3Checked} />
                    <label className='Star' htmlFor="radio13">★</label>
                    <input id="radio14" type="radio" name="estrellas" value="2" onChange={star2Checked} />
                    <label className='Star' htmlFor="radio14">★</label>
                    <input id="radio15" type="radio" name="estrellas" value="1" onChange={star1Checked} />
                    <label className='Star' htmlFor="radio15">★</label>
                  </p>
                </form>

                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder={reviewAs}
                  ref={description}
                  required

                />
              </Form.Group>


              <Button className='BtnBrown' variant="primary" style={{ fontSize: "120%", marginTop: "2%" }} type="submit"
              >
                Publicar


              </Button>
            </Form>
          </Card.Body>
        </Card>
        : (
          <p className="infoReview Josefin">Verifica tu usuario para valorar este producto</p>
        )}



      <div className="review-container">
        {reviews != null && reviews.length > 0 ? (
          reviews.slice(0, reviewsToShow).map((review) => (
            <div key={review.id} className="review-card" >

              <div className="review-card-body">
                <Row>
                  <Col md={2}>
                    <img src='https://image.ibb.co/jw55Ex/def_face.jpg'
                      className="img img-rounded img-fluid"
                      alt="User Avatar"
                      width={'100px'} 
                      />
                    <p className="text-secondary text-center ">{review.reviewDate}</p>
                    <div className="stars-container">
                      {Array.from({ length: review.stars }, (_, i) => (
                        <span key={i} className="StarReviewed">
                          ★
                        </span>
                      ))}
                    </div>
                  </Col>
                  <Col md={10}>
                    <p>
                      <strong className='Josefin'>{review.customername}</strong>
                    </p>
                    <div className="clearfix Josefin"></div>
                    <p>{review.description}</p>










                    {costumerId == review.customerid ?
                      <Row>
                        <Col md={10}>
                        </Col>
                        <Col md={1}>
                          <ReviewEdit props={review} />
                        </Col>
                        <Col md={1}>

                          <Tooltip title="Eliminar">
                            <Button className="BtnRed"
                              onClick={() => showAlert(review.id)}>
                              <MdDelete />
                            </Button>
                          </Tooltip>

                        </Col>
                      </Row>
                      : (
                        ''
                      )}

                  </Col>
                </Row>
              </div>

            </div>
          ))
        ) : (
          <p >No hay valoraciones. Se el primero en valorar este producto</p>
        )}

        {reviewsToShow < reviews.length && (
          <div className="text-center">
            <Button onClick={loadMoreReviews} className="BtnSave" >
              Más valoraciones
            </Button>
          </div>
        )}
        </div>
    </Container>
  );
};

export default listReview;
