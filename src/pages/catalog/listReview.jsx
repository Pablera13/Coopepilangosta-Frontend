import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import { format } from 'date-fns';
import {useMutation} from 'react-query';
import {getReviewById} from '../../services/reviewService';
import {getCostumerByIdNoState} from '../../services/costumerService';

import {createReview} from '../../services/reviewService';
import {deleteReview} from '../../services/reviewService';
import ReviewEdit from './actions/updateReview'
import { MdDelete } from "react-icons/md";

import { es } from 'date-fns/locale';

import './listReview.css';

const listReview = (productid) => {

  const [reviewRequest, setReviewRequest] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [costumerId, setCostumerId] = useState([]);
  const [reviewAs, setReviewAs] = useState([]);
  const [verified, setVerified] = useState([]);
  const [validated, setValidated] = useState(false);

  const description = useRef();
  const [starsChecked, setStarsChecked] = useState(false);


  useEffect(() => {
    const User = localStorage.getItem('user');
    if (User) {
    const UserObjet = JSON.parse(User)
    if (UserObjet.role.name == 'Cliente') {
      const UserId = UserObjet.costumer.id
      const verified = UserObjet.costumer.verified
      ///const name = UserObjet.costumer.name
      const name = "Comentar como " + UserObjet.costumer.name + ". Tu dirección de correo electrónico no será publicada."
      setCostumerId(UserId)
      setVerified(verified)
      setReviewAs(name)
    } else {
      //console.log("No es cliente")
    } //console.log("No habia usuario")
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
        });  setTimeout(function () {
          window.location.reload();
        }, 2000);
    },
});

  const saveReview = async(event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    } else {
        setValidated(true);

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
};

async function star1Checked() {setStarsChecked(1)}
async function star2Checked() {setStarsChecked(2)}
async function star3Checked() {setStarsChecked(3)}
async function star4Checked() {setStarsChecked(4)}
async function star5Checked() {setStarsChecked(5)}

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
        console.log("Review eliminada" + id)
        window.location.reload();
      }, 2000);
    }
  });
};

  return (
    <Container className="mt-3">

{verified == true? 
<Card className="mb-3">                   
<Card.Body>
          <Form validated={validated} onSubmit={saveReview}>
            <Form.Group controlId="reviewTextArea">

              <Form.Label>¿Recibiste y probaste nuestro producto? En Coopepilangosta R.L. nos encantaría conocer tu opinión. Comparte tus pensamientos y ayúdanos a mejorar. ¡Tu feedback importa!</Form.Label>
              <br>
              </br>
              <br>
              </br>
              <form>
                                <p className="clasificacion">
                                  <input id="radio11" type="radio" name="estrellas" value="5" onChange={star5Checked} />
                                  <label className='Star' htmlFor="radio11">★</label>
                                  <input id="radio12" type="radio" name="estrellas" value="4" onChange={star4Checked}/>
                                  <label className='Star' htmlFor="radio12">★</label>
                                  <input id="radio13" type="radio" name="estrellas" value="3" onChange={star3Checked}/>
                                  <label className='Star' htmlFor="radio13">★</label>
                                  <input id="radio14" type="radio" name="estrellas" value="2" onChange={star2Checked}/>
                                  <label className='Star' htmlFor="radio14">★</label>
                                  <input id="radio15" type="radio" name="estrellas" value="1" onChange={star1Checked}/>
                                  <label className='Star' htmlFor="radio15">★</label>
                                </p>
              </form>

              <Form.Control
                as="textarea"
                rows={3}
                placeholder={reviewAs}
                ref={description}
                required
                //value={newReview}
                //onChange={(e) => setNewReview(e.target.value)}
              />
            </Form.Group>
                             

            <Button className='BtnStar' variant="primary"  type="submit" 
            >
              Enviar Reseña

              
            </Button>
          </Form>
        </Card.Body>
      </Card>
                  : (     
                    <p className="verify warning">Verifica tu usuario para valorar este producto</p>
                  )}


        

      {reviews != null && reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="card mb-3">
            <div className="card-body">
              <Row>
                <Col md={2}>
                  <img src='https://image.ibb.co/jw55Ex/def_face.jpg' 
                    className="img img-rounded img-fluid" 
                    alt="User Avatar" 
                    width={'100px'}/>
                  <p className="text-secondary text-center">{review.reviewDate}</p>
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
                    <strong>{review.customername}</strong>
                  </p>
                  <div className="clearfix"></div>
                  <p>{review.description}</p>

                   {costumerId == review.customerid? 
                   <>
                      
                       <ReviewEdit props={review}/>
                    
                        <Button className="BtnTrash"
                        onClick={() => showAlert(review.id)}>
                          Eliminar <MdDelete/>
                        </Button>
                      </>

                  : (
                    ''
                  )}
                  
                </Col>
              </Row>
            </div>
          </div>
        ))
      ) : (
        <p className="verify warning">No hay valoraciones. Se el primero en valorar este producto</p>
        )}
    </Container>
  );
};

export default listReview;
