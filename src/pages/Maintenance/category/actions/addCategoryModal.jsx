import { React, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { Col, InputGroup, Row } from 'react-bootstrap';
import { QueryClient, useMutation } from 'react-query';
import { createCategory } from '../../../../services/categoryService';
import { useRef } from 'react';
import swal from 'sweetalert';
import './addCategoryModal.css'

const addCategoryModal = () => {
  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const queryClient = new QueryClient();

  const buttonStyle = {
    borderRadius: '5px',
    backgroundColor: '#e0e0e0',
    color: '#333',
    border: '1px solid #e0e0e0',
    padding: '8px 12px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    minWidth: '100px',
    fontWeight: 'bold',
    hover: {
      backgroundColor: '#c0c0c0', 
    },
  };

  const mutation = useMutation('category', createCategory, {
    onSettled: () => queryClient.invalidateQueries('category'),
    mutationKey: 'category',
    onSuccess: () => {
        swal({
            title: 'Agregado!',
            text: 'Se agregó la categoria',
            icon: 'success',
        });
        handleClose()

            setTimeout(function () {
                window.location.reload();
            }, 2000)
    },
});

  const categoryName = useRef()

  const save = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    setValidated(true);

    if (form.checkValidity() === true) {
      let newCategory = {
        name: categoryName.current.value,
      };
      setIsSaving(true); 
      mutation.mutateAsync(newCategory).then(() => {
        setIsSaving(false); 
      });
    }
  };

  return (
    <>
                  <Button
                  onClick={handleShow}
                  size='sm'
                  style={{...buttonStyle, marginLeft: '5px',}}
                  onMouseOver={(e) => e.target.style.backgroundColor = buttonStyle.hover.backgroundColor}
                  onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                  >
                  Agregar Categoría
                  </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header className='HdAddCategory' closeButton>
          <Modal.Title>Agregar nueva categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form validated={validated} onSubmit={save}>

            <Form.Group className="mb-3" controlId="validationCustom01">
              
                <Row>
                  <Col>
                <Form.Label>Nombre</Form.Label>
                </Col>
                </Row>

                <Row>
                <Col md={8}>
                <Form.Control
                  required
                  type="text"
                  placeholder="Ingrese el nombre de la categoría"
                  autoFocus
                  ref={categoryName}
                />
                <Form.Control.Feedback>Ingrese el nombre de la categoría</Form.Control.Feedback>
                </Col>
                </Row>

            </Form.Group>
            
          </Form>
        </Modal.Body>
        <Modal.Footer>
        <Button className='BtnSaveCategory' variant="primary" size='sm' onClick={save}>
              Guardar categoría
            </Button>
          <Button className='BtnCloseCategory' variant="secondary" size='sm' onClick={handleClose}>
            Cerrar
          </Button>

        </Modal.Footer>
      </Modal>
    </>
  );
}

export default addCategoryModal