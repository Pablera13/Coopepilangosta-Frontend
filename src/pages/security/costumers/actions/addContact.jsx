import React, { useRef, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useMutation, QueryClient } from "react-query";
import { createContactCostumer } from "../../../../services/CostumerContactService";
import { FaAddressBook } from "react-icons/fa";
import { Tooltip } from '@mui/material';


const addContact = (props) => {
  const queryClient = new QueryClient();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [validated, setValidated] = useState(false);

  const idCostumer = props.props;

  const name = useRef();
  const department = useRef();
  const contact = useRef();

  const addContactMutation = useMutation(
    "CostumerContact",
    createContactCostumer,
    {
      onSettled: () => queryClient.invalidateQueries("CostumerContact"),
      mutationKey: "CostumerContact",
      onSuccess: () => {
        swal({
          title: "Guardado!",
          text: "Se creó el contacto",
          icon: "success",
        }).then(function () {
          window.location.reload();
        });
      },
      onError: () => {
        console.log("Error creating the costumer");
      },
    }
  );

  const handleSubmit = async (event) => {

    event.preventDefault();
    const formFields = [name, department, contact];
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

    let newContact = {
      name: name.current.value,
      department: department.current.value,
      contact: contact.current.value,
      costumerId: idCostumer,
    };
    addContactMutation.mutateAsync(newContact).then(setValidated(true));
  }

  return (
    <>


      <Tooltip title="Agregar contacto">
        <Button className="BtnBrown" onClick={handleShow}>
          <FaAddressBook />
        </Button>
      </Tooltip>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header className="HeaderModal" closeButton>
          <Modal.Title>Agregar contacto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese nombre y apellido del contacto"
                autoFocus
                required
                ref={name}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Departamento</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el departamento"
                required
                ref={department}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Medio de contacto</Form.Label>
              <Form.Control
                type="text"
                placeholder="Puede ser correo o teléfono"
                required
                ref={contact}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="BtnSave" onClick={handleSubmit} type="submit">
            Guardar
          </Button>

          <Button
            className="BtnClose"
            variant="secondary"
            onClick={handleClose}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default addContact;
