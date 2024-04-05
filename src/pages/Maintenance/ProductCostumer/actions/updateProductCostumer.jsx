import React, { useRef, useState } from "react";
import { Modal, Col, Row, Container, Button, Form } from "react-bootstrap";
import { QueryClient, useMutation, useQuery } from "react-query";
import { format } from "date-fns";
import { editProductCostumerById } from "../../../../services/productCostumerService";
import { TiEdit } from "react-icons/ti";

const updateProductCostumer = (cotizacion) => {
  const queryClient = new QueryClient();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
        }).then(function(){window.location.reload()});
      },
    }
  );

  const handleUpdate = () => {
    let ProductCostumerEdit = {
      id: Cotizacion.id,
      productId: Cotizacion.productId,
      costumerId: Cotizacion.costumerId,
      purchasePrice: PurchasePrice.current.value,
      description: Description.current.value,
      margin: Margin.current.value,
      unit: Unit.current.value,
    };
    console.log(ProductCostumerEdit);

    updateProductCostumer.mutateAsync(ProductCostumerEdit);
  };
  return (
    <>
      <Button className="BtnBrown" onClick={handleOpen}>
        <TiEdit />
      </Button>

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
            <Form>
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
                  <Form.Control
                    required
                    type="number"
                    defaultValue={Cotizacion.margin}
                    placeholder="Ingrese el margen de ganancia"
                    ref={Margin}
                  />
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
