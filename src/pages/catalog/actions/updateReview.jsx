import React, { useRef, useState } from 'react';
import { Modal, Col, Row, Button, Form } from 'react-bootstrap';
import { ReviewUpdate } from '../../../services/reviewService';
import { QueryClient, useMutation } from 'react-query';
import { format } from 'date-fns';
import { TiEdit } from "react-icons/ti";
import './updateReview.css';
import { Tooltip } from '@mui/material';

import "../../../css/Pagination.css";
import "../../../css/StylesBtn.css";


const updateReview = (props) => {
  const queryClient = new QueryClient();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [validated, setValidated] = useState(false);

  const [review, setReview] = useState(null);
  const description = useRef();
  const [starsChecked, setStarsChecked] = useState(0);

  const updateReviewMutation = useMutation('review', ReviewUpdate, {
    onSettled: () => queryClient.invalidateQueries('review'),
    mutationKey: 'review',
    onSuccess: () => window.location.reload(),
  });

  const handleOpen = () => {
    handleShow();
    setReview(props.props);
  };

  const handleStarChecked = (value) => {
    setStarsChecked(value);
  };

  const handleUpdate = async (event) => {

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


    const today = new Date();
    const formattedDate = format(today, 'yyyy-MM-dd');

    const updatedReview = {
      id: review.id,
      description: description.current.value,
      stars: starsChecked,
      productId: review.productid,
      costumerId: review.customerid,
      reviewDate: formattedDate,
    };

    updateReviewMutation.mutateAsync(updatedReview);
  };

  return (
    <>

      <Tooltip title="Editar">
        <Button onClick={handleOpen} className="BtnBrown">
          <TiEdit />
        </Button>
      </Tooltip>

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
          {review && (
            <Form validated={validated} onSubmit={handleUpdate}>
              <Form.Label>Valoración</Form.Label>
              <p className="clasificación">
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
              <Row>
                <Col>
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={7}
                    placeholder="Ingrese su nombre"
                    defaultValue={review.description}
                    ref={description}
                    required
                  />
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className='BtnSave' variant="primary" size='sm' onClick={handleUpdate}>Guardar</Button>
          <Button className='BtnClose' variant="secondary" size='sm' onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default updateReview;
