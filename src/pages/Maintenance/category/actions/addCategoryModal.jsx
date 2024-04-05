import { React, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from "react-bootstrap";
import { QueryClient, useMutation } from "react-query";
import { createCategory } from "../../../../services/categoryService";
import { useRef } from "react";
import swal from "sweetalert";
import "../../../../css/Pagination.css";
import "../../../../css/StylesBtn.css";
import { GrAddCircle } from "react-icons/gr";

const addCategoryModal = () => {
  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const queryClient = new QueryClient();
  const mutation = useMutation("category", createCategory, {
    onSettled: () => queryClient.invalidateQueries("category"),
    mutationKey: "category",
    onSuccess: () => {
      swal({
        title: "Agregado!",
        text: "Se agregó la categoría",
        icon: "success",
      }).then(function(){window.location.reload()});
      
    },
  });

  const categoryName = useRef();

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
      <Button onClick={handleShow} className="BtnAdd">
        <GrAddCircle />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header className="HeaderModal" closeButton>
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
                  <Form.Control.Feedback>
                    Ingrese el nombre de la categoría
                  </Form.Control.Feedback>
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="BtnSave"
            variant="primary"
            size="sm"
            onClick={save}
          >
            Guardar categoría
          </Button>
          <Button
            className="BtnClose"
            variant="secondary"
            size="sm"
            onClick={handleClose}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default addCategoryModal;
