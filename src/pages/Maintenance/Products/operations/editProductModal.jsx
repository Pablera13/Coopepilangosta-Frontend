import React, { useRef, useState, useEffect } from 'react';
import { QueryClient, useMutation, useQuery } from 'react-query';
import { Modal, Button, Form, Row, Col, Table } from 'react-bootstrap';
import { editProduct } from '../../../../services/productService';
import { getCategories } from '../../../../services/categoryService';
import swal from 'sweetalert';
import './editProductModal.css';
import { TiEdit } from "react-icons/ti";

const editProductModal = (props) => {


    const [productRequest, setProduct] = useState(null);
    const [newImages, setNewImages] = useState([]);

    useEffect(() => {
        const product = props.props;
        if (product && typeof product.image === 'string') {
            const imagesArray = product.image.split(',');
            product.image = imagesArray;
            setProduct(product);
        }
    }, [props]);

    const [validated, setValidated] = useState(false);
    const queryClient = new QueryClient();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { data: Categories} = useQuery('category', getCategories);

    const apiKey = 'c401b6d5b22b0888799f01ee6c69edca';

    const handleImageUpload = async (e) => {
        const imageInput = e.target.files[0];

        if (imageInput) {
            try {
                const formData = new FormData();
                formData.append('image', imageInput);

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

                    setNewImages((prevImages) => [...prevImages, uploadedImageUrl]);

                    console.log('Url = ', uploadedImageUrl);
                } else {
                    console.error('error al subir la imagen');
                }
            } catch (error) {
                console.error('error de solicitud', error);
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

    const mutation = useMutation('product', editProduct, {
        onSettled: () => queryClient.invalidateQueries('product'),
        mutationKey: 'product',
        onSuccess: () => {
            swal({
                title: 'Editado!',
                text: 'Se editó el producto',
                icon: 'success',
            });
            handleClose()

            setTimeout(function () {
                window.location.reload();
            }, 2000)
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

    const save = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            setValidated(true);
        }
        if (form.checkValidity() === true) {

            const updatedImages = [...productRequest.image, ...newImages];
            const serializedImages = updatedImages.join(',');

            let newProduct = {
                id: productRequest.id,
                code: code.current.value,
                name: name.current.value,
                description: description.current.value,
                unit: unit.current.value,
                margin: margin.current.value,
                iva: iva.current.value,
                state: state.current.value,
                categoryId: categoryId.current.value,
                image: serializedImages,
            };

            // let CodeAvailability = await checkCodeAvailability(code.current.value).then(data=>data);
            // console.log(CodeAvailability)
            // if (CodeAvailability == true) {
            mutation.mutateAsync(newProduct);
            // }else{
            //     swal('Advertnecia','El codigo se encuentra en uso, no es posible guardar un registro con el codigo duplicado','warning')
            // }

        }
    };

    return (
        <>
            <Button className='BtnEditProducts' onClick={handleShow} size='sm'>
                Editar <TiEdit />
            </Button>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header className='HdEditProducts' closeButton>
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
                                                ref={code} />
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
                                                ref={name} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Descripción</Form.Label>
                                            <textarea
                                                required
                                                className='form-control'
                                                rows='4'
                                                defaultValue={productRequest.description}
                                                placeholder="Ingrese la descripción"
                                                ref={description}
                                            ></textarea>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Unidad Comercial</Form.Label>
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
                                            <Form.Label>Margen de Ganancia</Form.Label>
                                            <Form.Control
                                                required
                                                type="number"
                                                defaultValue={productRequest.margin}
                                                placeholder="Ingrese el margen de ganancia"
                                                ref={margin} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>IVA</Form.Label>
                                            <Form.Control
                                                required
                                                type="number"
                                                defaultValue={productRequest.iva}
                                                placeholder="Ingrese el IVA"
                                                ref={iva} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Estado</Form.Label>
                                            <Form.Select required ref={state}>
                                                <option value="true">Activo</option>
                                                <option value="false">Inactivo</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
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
                                </Row>
                                <Row>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Imagen</Form.Label>

                                            <Table>
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
                                                                    style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                                            </td>
                                                            <td>
                                                                <Button className='BtnDeleteImg' variant='danger' onClick={() => removeImage(index)}>
                                                                    Eliminar
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>

                                            <input type='file' accept='image/*' className='form-control-file' onChange={handleImageUpload} />
                                            {newImages.map((imageUrl, index) => (
                                                <div key={index}>Nueva imagen {index + 1}</div>
                                            ))}



                                        </Form.Group>
                                    </Col>
                                </Row>

                            </Form>
                        </Modal.Body>

                        <Modal.Footer className='FtEditProducts' >
                            <Button className='BtnSaveProducts' variant="primary" size="sm" onClick={save}>
                                Editar producto
                            </Button>
                            <Button className='BtnReturnProducts' variant="secondary" size="sm" onClick={handleClose}>
                                Cerrar
                            </Button>

                        </Modal.Footer>
                    </>
                ) : "Cargando..."}
            </Modal>
        </>
    );
};

export default editProductModal;

