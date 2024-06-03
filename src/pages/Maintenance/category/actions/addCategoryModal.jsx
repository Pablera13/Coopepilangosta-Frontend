import React, { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from "react-bootstrap";
import { QueryClient, useMutation } from "react-query";
import { createCategory } from "../../../../services/categoryService";
import swal from "sweetalert";
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
      }).then(function () {
        window.location.reload();
      });
    },
    onError: () => {
      swal("Error", "Algo salió mal...", "error");
    },
  });

  const categoryNameRef = useRef();

  const save = (event) => {
    event.preventDefault();
        const formFields = [categoryNameRef];
        let fieldsValid = true;
    
        formFields.forEach((fieldRef) => {
            if (!fieldRef.current.value) {
                fieldsValid = false;}
        });
    
        if (!fieldsValid) {
            setValidated(true);
            return;
        } else {
            setValidated(false);
        }

      let newCategory = {
        name: categoryNameRef.current.value,
      };

      setIsSaving(true);
      mutation.mutateAsync(newCategory).then(() => {
        setIsSaving(false);
      });
    }

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
          <Form noValidate validated={validated} onSubmit={save}>
            <Form.Group className="mb-3" controlId="categoryName">
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
                    ref={categoryNameRef}
                  />
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
            disabled={isSaving}
          >
            {isSaving ? "Guardando..." : "Guardar categoría"}
          </Button>
          <Button
            className="BtnClose"
            variant="secondary"
            size="sm"
            onClick={handleClose}
            disabled={isSaving}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default addCategoryModal;
