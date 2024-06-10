import React, { useRef, useState } from "react";
import { QueryClient, useMutation } from "react-query";
import { LettersOnly, NumbersOnly } from '../../../../utils/validateFields'
import { Modal, Button, Form } from "react-bootstrap";
import swal from "sweetalert";
import {
  createWarehouse,
  checkWarehouseCodeAvailability,
} from "../../../../services/warehouseService";
import "../../../../css/Pagination.css";
import "../../../../css/StylesBtn.css";
import { GrAddCircle } from "react-icons/gr";
import { Tooltip } from '@mui/material';

const addWarehouseModal = () => {
  const queryClient = new QueryClient();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [validated, setValidated] = useState(false);

  const mutation = useMutation("warehouse", createWarehouse, {
    onSettled: () => queryClient.invalidateQueries("Warehouse"),
    mutationKey: "warehouse",
    onSuccess: () => {
      swal({
        title: "Agregado!",
        text: "Se agregó la bodega",
        icon: "success",
      }).then(function () { window.location.reload() });
    },
  });

  const code = useRef();
  const description = useRef();
  const address = useRef();
  const state = useRef();

  const saveWarehouse = async (event) => {

    event.preventDefault();
    const formFields = [code, description, address, state];
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

    let newWarehouse = {
      code: code.current.value,
      description: description.current.value,
      address: address.current.value,
      state: state.current.value,
    };

    let codeAvailability = await checkWarehouseCodeAvailability(
      code.current.value
    )
      .then((data) => data)



    if (codeAvailability == true) {
      mutation.mutateAsync(newWarehouse);
    } else {
      event.preventDefault();
      swal(
        "Advertencia",
        "Este código de bodega se encuentra en uso.",
        "warning"
      );
    }
  };


  return (
    <>

      <Tooltip title="Agregar">
        <Button onClick={handleShow} className="BtnAdd">
          <GrAddCircle />
        </Button>
      </Tooltip>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header className="HeaderModal" closeButton>
          <Modal.Title>Agregar nueva bodega</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form validated={validated} onSubmit={saveWarehouse}>
            <Form.Group className="mb-3">
              <Form.Label>Código:</Form.Label>
              <Form.Control
                required
                type="number"
                placeholder="Ingrese el código"
                ref={code}
                onKeyDown={NumbersOnly}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción:</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Ingrese la descripción"
                ref={description}
                onKeyDown={LettersOnly}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Dirección:</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Ingrese la dirección"
                ref={address}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado:</Form.Label>
              <Form.Select ref={state}>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="BtnSave"
            variant="primary"
            size="sm"
            onClick={saveWarehouse}
          >
            Guardar Bodega
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

export default addWarehouseModal;
