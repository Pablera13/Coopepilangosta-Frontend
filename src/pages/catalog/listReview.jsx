import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import { format } from 'date-fns';
import { useMutation } from 'react-query';
import { getReviewById } from '../../services/reviewService';
import { getCostumerByIdNoState } from '../../services/costumerService';
import { createReview, deleteReview } from '../../services/reviewService';
import ReviewEdit from './actions/updateReview';
import { MdDelete } from "react-icons/md";
import { es } from 'date-fns/locale';
import swal from 'sweetalert';
import './listReview.css';

const listReview = (productid) => {
  const [reviewRequest, setReviewRequest] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [costumerId, setCostumerId] = useState([]);
  const [reviewAs, setReviewAs] = useState([]);
  const [verified, setVerified] = useState([]);
  const [validated, setValidated] = useState(false);
  const description = useRef();
  const [starsChecked, setStarsChecked] = useState(0);

  useEffect(() => {
    const User = localStorage.getItem('user');
    if (User) {
      const UserObjet = JSON.parse(User);
      if (UserObjet.role.name === 'Cliente') {
        const UserId = UserObjet.costumer.id;
        const verified = UserObjet.costumer.verified;
        const name = "Comentar como " + UserObjet.costumer.name + ". Tu dirección de correo electrónico no será publicada.";
        setCostumerId(UserId);
        setVerified(verified);
        setReviewAs(name);
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
      });
      setTimeout(function () {
        window.location.reload();
      }, 2000);
    },
  });

  const saveReview = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      setValidated(true);
      const currentDate = new Date();
      const formattedDate = format(currentDate, 'yyyy-MM-dd');
      const newReview = {
        description: description.current.value,
        stars: starsChecked,
        productId: productid.productid,
        costumerId: costumerId,
        reviewDate: formattedDate,
      };
      mutation.mutateAsync(newReview);
    }
  };

  const handleStarChecked = (value) => {
    setStarsChecked(value);
  };

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
        });
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      }
    });
  };

  return (
    <Container className="mt-3">
      {verified ? (
        <Card className="mb-3">
          <Card.Body>
            <Form validated={validated} onSubmit={saveReview}>
              <Form.Group controlId="reviewTextArea">
              <Form.Label>¿Recibiste y probaste nuestro producto? En Coopepilangosta R.L. nos encantaría conocer tu opinión. Comparte tus pensamientos y ayúdanos a mejorar. ¡Tu feedback importa!</Form.Label>
                <br />                <br />

                <form>
                  <p className="clasificacion">
                    {[...Array(5)].map((_, index) => (
                      <React.Fragment key={index}>
                        <input
                          id={`radio${index + 1}`}
                          type="radio"
                          name="estrellas"
                          value={5 - index}
                          onChange={() => handleStarChecked(5 - index)}
                          checked={starsChecked === 5 - index}
                        />
                        <label className='Star' htmlFor={`radio${index + 1}`}>★</label>
                      </React.Fragment>
                    ))}
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
              <br></br>
              <Button className='BtnBrown' variant="primary" type="submit">
                Publicar
              </Button>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <p className="verify warning">Verifica tu usuario para valorar este producto</p>
      )}
      {reviews && reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="card mb-3">
            <div className="card-body">
              <Row>
                <Col md={2}>
                  <img
                    src='https://image.ibb.co/jw55Ex/def_face.jpg'
                    className="img img-rounded img-fluid"
                    alt="User Avatar"
                    width={'100px'}
                  />
                  <p className="text-secondary text-center">{review.reviewDate}</p>
                  <div className="stars-container">
                    {[...Array(review.stars)].map((_, i) => (
                      <span key={i} className="StarReviewed">
                        ★
                      </span>
                    ))}
                  </div>
                </Col>
                <Col md={10}>
                  <p>
                    <strong>{review.customername}</strong>
                  </p>
                  <div className="clearfix"></div>
                  <p>{review.description}</p>
                  {costumerId === review.customerid && (
                    <Row>
                      <Col md={10}></Col>
                      <Col md={1}>
                        <ReviewEdit props={review} />
                      </Col>
                      <Col md={1}>
                        <Button className="BtnRed" onClick={() => showAlert(review.id)}>
                          <MdDelete />
                        </Button>
                      </Col>
                    </Row>
                  )}
                </Col>
              </Row>
            </div>
          </div>
        ))
      ) : (
        <p className="verify warning">No hay valoraciones. Sé el primero en valorar este producto</p>
      )}
    </Container>
  );
};

export default listReview;

