import React, { useRef, useState } from "react";
import { QueryClient, useMutation } from "react-query";
import { Modal, Button, Form } from "react-bootstrap";
import { LettersOnly, NumbersOnly } from '../../../../utils/validateFields'
import { NavLink } from "react-router-dom";
import swal from "sweetalert";
import { Tooltip } from '@mui/material';

import {
  updateWarehouse,
  checkWarehouseCodeAvailability,
} from "../../../../services/warehouseService";
import { TiEdit } from "react-icons/ti";
import "../../../../css/Pagination.css";
import "../../../../css/StylesBtn.css";
const editWarehouseModal = (props) => {
  const warehouse = props.props;
  const queryClient = new QueryClient();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [validated, setValidated] = useState(false);
  const mutation = useMutation("warehouse", updateWarehouse, {
    onSettled: () => queryClient.invalidateQueries("warehouse"),
    mutationKey: "warehouse",
    onSuccess: () => {
      swal({
        title: "Editado!",
        text: "Se editó la bodega",
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
      id: warehouse.id,
      code: code.current.value,
      description: description.current.value,
      address: address.current.value,
      state: state.current.value,
    };
    mutation.mutateAsync(newWarehouse);
  };


  return (
    <>

      <Tooltip title="Editar">
        <Button className="BtnBrown" onClick={handleShow} size="sm">
          <TiEdit />
        </Button>
      </Tooltip>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header className="HeaderModal" closeButton>
          <Modal.Title>Editar bodega</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form validated={validated} onSubmit={saveWarehouse}>
            <Form.Group className="mb-3">
              <Form.Label>Código:</Form.Label>
              <Form.Control
                required
                type="number"
                min={1}
                readOnly={true}
                defaultValue={warehouse.code}
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
                defaultValue={warehouse.description}
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
                defaultValue={warehouse.address}
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
            Editar Bodega
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

export default editWarehouseModal;
