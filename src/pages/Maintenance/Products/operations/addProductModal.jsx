import React, { useRef, useState } from 'react';

import { QueryClient, useMutation, useQuery } from 'react-query';
// import { Container, Row, Col, Button, Form, Modal, InputGroup } from 'react-bootstrap';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

import { createProduct } from '../../../../services/productService';
import { getCategories } from '../../../../services/categoryService';
import swal from 'sweetalert';
import './addProductModal.css';

const addProductModal = () => {
    const [validated, setValidated] = useState(false);
    const queryClient = new QueryClient();
    const [show, setShow] = useState(false);

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

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { data: Categories, isLoading: CategoriesLoading, isError: CategoriesError } = useQuery('category', getCategories);

    const [imageUrl, setImageUrl] = useState('');
    const apiKey = 'c401b6d5b22b0888799f01ee6c69edca';

    const handleImageUpload = async (e) => {
        const imageInput = e.target.files[0];

        if (imageInput) {
            const formData = new FormData();
            formData.append('image', imageInput);

            try {
                const response = await fetch(
                    `https://api.imgbb.com/1/upload?key=${apiKey}`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    const uploadedImageUrl = data.data.url;
                    setImageUrl(uploadedImageUrl);
                    console.log('Url = ', uploadedImageUrl);
                } else {
                    console.error('Error al subir la imagen');
                }
            } catch (error) {
                console.error('Error de solicitud', error);
            }
        }
    };

    const mutation = useMutation('product', createProduct, {
        onSettled: () => queryClient.invalidateQueries('product'),
        mutationKey: 'product',
        onSuccess: () => {
            swal({
                title: 'Agregado!',
                text: 'Se agregó el producto',
                icon: 'success',
            });
            handleClose()

            setTimeout(function () {
                window.location.reload();
            }, 2000)
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

    const save = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            setValidated(true);
        }
        if (form.checkValidity() === true) {
            let newProduct = {
                code: code.current.value,
                name: name.current.value,
                description: description.current.value,
                unit: unit.current.value,
                margin: margin.current.value,
                iva: iva.current.value,
                state: state.current.value,
                categoryId: categoryId.current.value,
                image: imageUrl,
            };

            mutation.mutateAsync(newProduct);
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
                Agregar Producto
                  </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar nuevo producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form validated={validated} onSubmit={save}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Código:</Form.Label>
                                    <Form.Control
                                        required
                                        type="number"
                                        placeholder="Ingrese el código"
                                        autoFocus
                                        ref={code}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre:</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Ingrese el nombre"
                                        ref={name}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Descripción:</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Ingrese la descripción"
                                        ref={description}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Unidad Comercial:</Form.Label>                               
                                    <div className="custom-select-container">
                                        <select className="custom-select" id="unitOptions" ref={unit}>
                                            <option value="Kilogramo">Kilogramo</option>
                                            <option value="Rollo">Rollo</option>
                                            <option value="Unidad">Unidad</option>
                                            <option value="Paquete 200g">Paquete 200g</option>
                                            <option value="Paquete 250g">Paquete 250g</option>
                                            <option value="Paquete 270g">Paquete 270g</option>
                                            <option value="Paquete 340g">Paquete 340g</option>
                                            <option value="Barra">Barra</option>
                                            <option value="Litro">Litro</option>
                                            <option value="Galon">Galón</option>
                                            <option value="Botella 750ml">Botella 750ml</option>
                                        </select>
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Margen de Ganancia:</Form.Label>
                                    <Form.Control
                                        required
                                        type="number"
                                        placeholder="Ingrese el margen de ganancia"
                                        ref={margin}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>IVA:</Form.Label>
                                    <Form.Control
                                        required
                                        type="number"
                                        placeholder="Ingrese el IVA"
                                        ref={iva}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Estado:</Form.Label>
                                    <Form.Select required ref={state}>
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Categoría:</Form.Label>
                                    <Form.Select required ref={categoryId}>
                                        {Categories != null ? (
                                            Categories.map((category) => (
                                                <option value={category.id} key={category.id}>
                                                    {category.name}
                                                </option>
                                            ))
                                        ) : (
                                            'Espere'
                                        )}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Imagen:</Form.Label>
                                    <div className="custom-file">
                                        <input
                                            type="file"
                                            className="custom-file-input"
                                            id="customFile"
                                            onChange={handleImageUpload}
                                        />
                                        <label className="custom-file-label" htmlFor="customFile">
                                            {/* Seleccionar archivo */}
                                        </label>
                                    </div>
                                    {imageUrl && <img src={imageUrl} alt="Imagen subida" className="uploadedImg" />}
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" size="sm" onClick={save}>
                        Guardar producto
                    </Button>
                    <Button variant="secondary" size="sm" onClick={handleClose}>
                        Cerrar
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    );
};

export default addProductModal;

