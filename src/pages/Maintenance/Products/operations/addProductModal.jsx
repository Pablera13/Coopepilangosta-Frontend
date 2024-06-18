import React, { useRef, useState } from 'react';
import { QueryClient, useMutation, useQuery } from 'react-query';
import { Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { createProduct, checkCodeAvailability } from '../../../../services/productService';
import { getCategories } from '../../../../services/categoryService';
import swal from 'sweetalert';
import {LettersOnly, NumbersOnly} from '../../../../utils/validateFields'
import { Tooltip } from '@mui/material';

import { GrAddCircle } from "react-icons/gr";
const addProductModal = () => {
    const [validated, setValidated] = useState(false);
    const queryClient = new QueryClient();
    const [show, setShow] = useState(false);
    const [customUnit, setCustomUnit] = useState(false);

    const handleUnitChange = (event) => {
        if (event.target.value === "custom") {
            setCustomUnit(true);
        } else {
            setCustomUnit(false);
        }
    };

    const handleClose = () => {setShow(false), setCustomUnit(false)};
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
            }).then(function(){window.location.reload()});
        },
        onError: () => {
            swal('Error', 'Algo salio mal...', 'error')
        }
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
    
        let newProduct = {
            code: code.current.value,
            name: name.current.value,
            description: description.current.value,
            unit: unit.current.value,
            margin: margin.current.value,
            iva: iva.current.value,
            state: state.current.value,
            stockable: stockable.current.value,
            categoryId: categoryId.current.value,
            image: imageUrl,
        };
    
        let CodeAvailability = await checkCodeAvailability(code.current.value).then(data => data);
        console.log(CodeAvailability)
        if (CodeAvailability == true) {
            mutation.mutateAsync(newProduct);
        } else {
            swal('Advertencia', 'El código se encuentra en uso, no es posible guardar un registro con el código duplicado.', 'warning')
        }
    };
    

    return (
        <>
           
            <Tooltip title="Agregar">
            <Button
                onClick={handleShow}
                className="BtnAdd"
            >
                <GrAddCircle />

            </Button>
            </Tooltip>


            <Modal show={show} onHide={handleClose} >
                <Modal.Header className='HeaderModal' closeButton>
                    <Modal.Title>Agregar nuevo producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form validated={validated} onSubmit={save}>
                        <Row>
                            <Col xs={6} md={6} lg={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Código</Form.Label>
                                    <Form.Control
                                        required
                                        type="number"
                                        placeholder="Ingrese el código"
                                        autoFocus
                                        ref={code}
                                        min={1}
                                        onKeyDown={NumbersOnly}                                  
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={4} lg={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Ingrese el nombre"
                                        ref={name}
                                        onKeyDown={LettersOnly}                                  
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4} md={6} lg={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Descripción</Form.Label>
                                    <textarea
                                        required
                                        className='form-control'
                                        rows='4'
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
                                            <Form.Select className="custom-select" id="unitOptions" ref={unit} onChange={handleUnitChange}>
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
                            <Col xs={6} md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Margen de Ganancia</Form.Label>
                                    <InputGroup>
                                    <InputGroup.Text>%</InputGroup.Text>
                                    <Form.Control
                                        required
                                        type="number"
                                        placeholder="Ingrese el margen de ganancia"
                                        ref={margin}
                                        onKeyDown={NumbersOnly}                                  
                                        min={1}
                                    />
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>IVA</Form.Label>
                                    <InputGroup>
                                    <InputGroup.Text>%</InputGroup.Text>
                                    <Form.Control
                                        required
                                        type="number"
                                        placeholder="Ingrese el IVA"
                                        ref={iva}
                                        onKeyDown={NumbersOnly}                                  
                                        min={1}
                                    />
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6} md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Select required ref={state}>
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col xs={6} md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Categoría</Form.Label>
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

                            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Inventario</Form.Label>
                      <Form.Select required ref={stockable}>
                        <option value="false">No</option>
                        <option value="true">Si</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                        </Row>
                        <Row>
                            <Col xs={12} md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Imagen</Form.Label>
                                    <div className="custom-file">
                                        <input
                                            type="file"
                                            className="custom-file-input"
                                            id="customFile"
                                            onChange={handleImageUpload}
                                        />
                                        <label className="custom-file-label" htmlFor="customFile">
                                        </label>
                                    </div>
                                    {imageUrl && <img src={imageUrl} style={{width:'100px',height:'65px'}} alt="Imagen subida" className="uploadedImg" />}
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='BtnSave' variant="primary" size="sm" onClick={save}>
                        Guardar producto
                    </Button>
                    <Button className='BtnClose' variant="secondary" size="sm" onClick={handleClose}>
                        Cerrar
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    );
};

export default addProductModal;

