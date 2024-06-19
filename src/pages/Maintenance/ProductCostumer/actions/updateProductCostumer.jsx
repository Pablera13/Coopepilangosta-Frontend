import React, { useRef, useState } from "react";
import { Modal, Col, Row, Container, Button, Form, InputGroup } from "react-bootstrap";
import { QueryClient, useMutation, useQuery } from "react-query";
import { editProductCostumerById } from "../../../../services/productCostumerService";
import { TiEdit } from "react-icons/ti";
import { Tooltip } from '@mui/material';

const updateProductCostumer = (cotizacion) => {
  const queryClient = new QueryClient();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [validated, setValidated] = useState(false);

  const [Cotizacion, setCotizacion] = useState(null);
  const handleOpen = () => {
    handleShow();
    setCotizacion(cotizacion.props);

  };

  const PurchasePrice = useRef();
  const Description = useRef();
  const Margin = useRef();
  const Unit = useRef();

  const updateProductCostumer = useMutation(
    "productcostumer",
    editProductCostumerById,
    {
      onSettled: () => queryClient.invalidateQueries("productcostumer"),
      mutationKey: "productcostumer",
      onSuccess: () => {
        swal({
          title: "Editado!",
          text: "Se editó la cotización",
          icon: "success",
        }).then(function () { window.location.reload() });
      },
    }
  );

  const handleUpdate = async (event) => {

    event.preventDefault();
    const formFields = [PurchasePrice, Description, Margin, Unit];
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

    let ProductCostumerEdit = {
      id: Cotizacion.id,
      productId: Cotizacion.productId,
      costumerId: Cotizacion.costumerId,
      purchasePrice: PurchasePrice.current.value,
      description: Description.current.value,
      margin: Margin.current.value,
      unit: Unit.current.value,
    };

    updateProductCostumer.mutateAsync(ProductCostumerEdit);
  };


  return (
    <>

      <Tooltip title="Editar">
        <Button className="BtnBrown" onClick={handleOpen}>
          <TiEdit />
        </Button>
      </Tooltip>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="HeaderModal" closeButton>
          <Modal.Title>Actualizar cotización</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Cotizacion != null ? (
            <Form validated={validated} onSubmit={handleUpdate}>
              <Row>
                <Col>
                  <Form.Label>Precio inicial</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    defaultValue={Cotizacion.purchasePrice}
                    placeholder="Ingrese el precio inicial"
                    ref={PurchasePrice}
                  />
                </Col>

                <Col>
                  <Form.Label>Margen de ganancia</Form.Label>
                  <InputGroup>
                      <InputGroup.Text>%</InputGroup.Text>
                  <Form.Control
                    required
                    type="number"
                    defaultValue={Cotizacion.margin}
                    placeholder="Ingrese el margen de ganancia"
                    ref={Margin}
                  />
                  </InputGroup>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Label>Unidad Comercial</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    defaultValue={Cotizacion.productUnit}
                    placeholder="Ingrese la unidad comercial"
                    ref={Unit}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    required
                    type="textarea"
                    rows={3}
                    defaultValue={Cotizacion.description}
                    placeholder="Ingrese la descripción"
                    ref={Description}
                  />
                </Col>
              </Row>
            </Form>
          ) : (
            ""
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="BtnSave" size="sm" onClick={handleUpdate}>
            Guardar
          </Button>
          <Button className="BtnClose" size="sm" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default updateProductCostumer;
