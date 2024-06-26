import React, { useRef, useState, useEffect } from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import { Modal, Button, Form, Row, Col, Table, InputGroup } from "react-bootstrap";
import { editProduct } from "../../../../services/productService";
import { getCategories } from "../../../../services/categoryService";
import swal from "sweetalert";
import { TiEdit } from "react-icons/ti";
import { MdDelete } from "react-icons/md";
import { Tooltip } from '@mui/material';
import {LettersOnly, NumbersOnly} from '../../../../utils/validateFields'

const editProductModal = (props) => {
  const [productRequest, setProduct] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [customUnit, setCustomUnit] = useState(false);
    
  const handleUnitChange = (event) => {
      if (event.target.value === "custom") {
          setCustomUnit(true);
      } else {
          setCustomUnit(false);
      }
  };
  useEffect(() => {
    const product = props.props;
    if (product && typeof product.image === "string") {
      const imagesArray = product.image.split(",");
      product.image = imagesArray;
      setProduct(product);
    }
  }, [props]);

  const [validated, setValidated] = useState(false);
  const queryClient = new QueryClient();
  const [show, setShow] = useState(false);

  const handleClose = () => {setShow(false), setCustomUnit(false)};
  const handleShow = () => setShow(true);
  const { data: Categories } = useQuery("category", getCategories);

  const apiKey = "c401b6d5b22b0888799f01ee6c69edca";

  const handleImageUpload = async (e) => {
    const imageInput = e.target.files[0];

    if (imageInput) {
      try {
        const formData = new FormData();
        formData.append("image", imageInput);

        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          const uploadedImageUrl = data.data.url;

          setNewImages((prevImages) => [...prevImages, uploadedImageUrl]);

          console.log("Url = ", uploadedImageUrl);
        } else {
          console.error("error al subir la imagen");
        }
      } catch (error) {
        console.error("error de solicitud", error);
      }
    }
  };

  const removeImage = (indexToRemove) => {
    setProduct((prevProduct) => {
      const updatedProduct = { ...prevProduct };
      updatedProduct.image.splice(indexToRemove, 1);

      return updatedProduct;
    });
  };

  const mutation = useMutation("product", editProduct, {
    onSettled: () => queryClient.invalidateQueries("product"),
    mutationKey: "product",
    onSuccess: () => {
      swal({
        title: "Editado!",
        text: "Se editó el producto",
        icon: "success",
      }).then(function(){window.location.reload()});
      
    },
    onError: () => {
      swal("Error", "Algo salio mal...", "error");
    },
  });

  const code = useRef();
  const name = useRef();
  const description = useRef();
  const unit = useRef();
  const margin = useRef();
  const iva = useRef();
  const state = useRef();
  const categoryId = useRef();
  const stockable= useRef();


  const save = async (event) => {

    event.preventDefault();
        const formFields = [code, name, description, unit, margin, iva, state, categoryId, stockable];
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

      const updatedImages = [...productRequest.image, ...newImages];
      const serializedImages = updatedImages.join(",");

      let newProduct = {
        id: productRequest.id,
        code: code.current.value,
        name: name.current.value,
        description: description.current.value,
        unit: unit.current.value,
        margin: margin.current.value,
        iva: iva.current.value,
        state: state.current.value,
        stockable: stockable.current.value,
        categoryId: categoryId.current.value,
        image: serializedImages,
      };
      mutation.mutateAsync(newProduct);
  
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
          <Modal.Title>Editar producto</Modal.Title>
        </Modal.Header>

        {productRequest != null ? (
          <>
            <Modal.Body>
              <Form validated={validated} onSubmit={save}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Código</Form.Label>
                      <Form.Control
                        required
                        type="number"
                        defaultValue={productRequest.code}
                        readOnly={true}
                        placeholder="Ingrese el código"
                        autoFocus
                        ref={code}
                        min={1}
                        onKeyDown={NumbersOnly}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        defaultValue={productRequest.name}
                        placeholder="Ingrese el nombre"
                        ref={name}
                        onKeyDown={LettersOnly}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Descripción</Form.Label>
                      <textarea
                        required
                        className="form-control"
                        rows="4"
                        defaultValue={productRequest.description}
                        placeholder="Ingrese la descripción"
                        ref={description}
                      ></textarea>
                    </Form.Group>
                  </Col>

                  <Col xs={4} md={6} lg={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Unidad Comercial</Form.Label><br />
                                    <div className="custom-select-container">
                                        {customUnit ? (
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="Ingrese la unidad"
                                                ref={unit}
                                            />
                                        ) : (
                                            <Form.Select defaultValue={productRequest.unit} className="custom-select" id="unitOptions" ref={unit} onChange={handleUnitChange}>
                                            <option value="Kilogramo">Kilogramo</option>
                                            <option value="Rollo">Rollo</option>
                                            <option value="Unidad">Unidad</option>
                                            <option value="Paquete 200g">Paquete 200g</option>
                                            <option value="Paquete 250g">Paquete 250g</option>
                                            <option value="Paquete 270g">Paquete 270g</option>
                                            <option value="Paquete 340g">Paquete 340g</option>
                                            <option value="Barra">Barra</option>
                                            <option value="Litro">Litro</option>
                                            <option value="Galón">Galón</option>
                                            <option value="Botella 750ml">Botella 750ml</option>
                                            <option value="custom">Ingresar manualmente</option>
                                            </Form.Select>
                                        )}
                                    </div>
                                </Form.Group>
                            </Col>



                            


                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Margen de Ganancia</Form.Label>
                      <InputGroup>
                      <InputGroup.Text>%</InputGroup.Text>
                      <Form.Control
                        required
                        type="number"
                        defaultValue={productRequest.margin}
                        placeholder="Ingrese el margen de ganancia"
                        ref={margin}
                        min={1}
                        onKeyDown={NumbersOnly}
                      />
                     </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>IVA</Form.Label>
                      <InputGroup>
                      <InputGroup.Text>%</InputGroup.Text>
                      <Form.Control
                        required
                        type="number"
                        defaultValue={productRequest.iva}
                        placeholder="Ingrese el IVA"
                        ref={iva}
                        min={1}
                        onKeyDown={NumbersOnly}
                      />
                       </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Estado</Form.Label>
                      <Form.Select required ref={state}
                        defaultValue={productRequest.state}>
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Categoría</Form.Label>
                      <Form.Select required ref={categoryId} defaultValue={productRequest.categoryId}>
                        {Categories != null
                          ? Categories.map((category) => (
                              <option value={category.id} key={category.id}>
                                {category.name}
                              </option>
                            ))
                          :  <div className="Loading">
                          <ul>
                            <li></li>
                            <li></li>
                            <li></li>
                          </ul>
                        </div>}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Inventario</Form.Label>
                      <Form.Select required ref={stockable}
                      defaultValue={productRequest.stockable}>
                        <option value="true">Si</option>
                        <option value="false">No</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>


                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Imagen</Form.Label>

                      <Table className='Table'>
                        <thead>
                          <tr>
                            <th>Imagen</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productRequest.image.map((imageUrl, index) => (
                            <tr key={index}>
                              <td>
                                <img
                                  src={imageUrl}
                                  alt={`Image ${index}`}
                                  style={{
                                    maxWidth: "100px",
                                    maxHeight: "100px",
                                  }}
                                />
                              </td>
                              <td>
                                <Button
                                className="BtnRed"
                                  variant="danger"
                                  onClick={() => removeImage(index)}
                                >
                                  <MdDelete />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>

                      <input
                        type="file"
                        accept="image/*"
                        className="form-control-file"
                        onChange={handleImageUpload}
                      />
                      {newImages.map((imageUrl, index) => (
                        <div key={index}>Nueva imagen {index + 1}</div>
                      ))}
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>

            <Modal.Footer>
              <Button
                className="BtnSave"
                variant="primary"
                size="sm"
                onClick={save}
              >
                Actualizar producto
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
          </>
        ) : (
          "Cargando..."
        )}
      </Modal>
    </>
  );
};

export default editProductModal;
