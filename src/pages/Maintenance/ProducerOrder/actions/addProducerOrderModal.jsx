import React from 'react'
import { useRef, useState, useEffect } from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import { format } from 'date-fns';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { Col, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import Select from 'react-select';
import { createProducerOrder } from '../../../../services/producerorderService';
import { createPurchase } from '../../../../services/purchaseService';
import { getProducers } from '../../../../services/producerService';
import { getProducts } from '../../../../services/productService';
import { getProductProducer } from '../../../../services/productProducerService';
import { createProductProducer } from '../../../../services/productProducerService';
import { editProductProducer } from '../../../../services/productProducerService';

import { getProductById } from '../../../../services/productService';
import { GrAddCircle } from "react-icons/gr";

const addProducerOrderModal = () => {
    const [show, setShow] = useState(false);
    const queryClient = new QueryClient();

    const handleClose = () => {
        setShow(false);
        Quantity.current.value = ""
        PurchasePrice.current.value = ""
        IVA.current.value = ""
        PurchaseTotal.current.value = ""
        setPurchases([]);
        setIsProducerSelectDisabled(false)
    }

    const handleShow = () => setShow(true);

    const [validated, setValidated] = useState(false);

    const ProducerId = useRef()
    const ProductId = useRef()
    const Quantity = useRef()
    const PurchasePrice = useRef()
    const IVA = useRef()
    const PurchaseTotal = useRef()
    const Detail = useRef()

    const [productRequest, setProduct] = useState(null)

    const [purchases, setPurchases] = useState([]);

    const [isProducerSelectDisabled, setIsProducerSelectDisabled] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedProducer, setSelectedProducer] = useState(null);
    const [selectedQuantity, setSelectedQuantity] = useState(null);

    const { data: producers, isLoading: producersLoading, isError: producersError } = useQuery('producer', getProducers);
    const { data: products, isLoading: productsLoading, isError: productsError } = useQuery('product', getProducts);

    function handleQuantityChange(event) {
        const currentQuantityValue = event.target.value;
        setSelectedQuantity(currentQuantityValue);
    }

    const ObtainPurchasePrice = async (productId, producerId) => {
        try {
            let purchaseprice = await getProductProducer(productId, producerId);
            PurchasePrice.current.value = purchaseprice;
        } catch (error) {
            console.error("Error al obtener purchase price en el componente ", error);
        }
    };

    const ObtainIVA = async (productId) => {
        try {
            let productiva = await await getProductById(productId, setProduct)
            console.log("productiva = " + productiva.iva);
            IVA.current.value = productiva.iva;
        } catch (error) {
            console.error("Error al obtener productiva en el componente ", error);
        }
    };

    const mutationPurchase = useMutation("purchase ", createPurchase,
        {
            onSettled: () => queryClient.invalidateQueries("purchases"),
            mutationKey: "purchase"
        })

    const mutationProductProducer = useMutation("productproducer ", createProductProducer,
        {
            onSettled: () => queryClient.invalidateQueries("productproducers"),
            mutationKey: "productproducer"
        })

    const mutationProductProducerEdit = useMutation("producerorder", editProductProducer,
        {
            onSettled: () => queryClient.invalidateQueries("producerorder"),
            mutationKey: "producerorder",
        })

    useEffect(() => {
        if (selectedProduct && selectedProducer) {
            ObtainIVA(selectedProduct.value);
            console.log(selectedProduct.value);
        }
    }, [selectedProduct, selectedProducer]);

    useEffect(() => {
        if (selectedProduct && selectedProducer) {
            ObtainPurchasePrice(selectedProduct.value, selectedProducer.value);
            console.log(selectedProduct.value + " , " + selectedProducer.value);
        }
    }, [selectedProduct, selectedProducer]);

    useEffect(() => {
        if (selectedProducer) {
            setIsProducerSelectDisabled(true)
        }
    }, [selectedProducer]);

    useEffect(() => {
        if (selectedQuantity) {
            let realiva = IVA.current.value / 100
            let totaliva = PurchasePrice.current.value * realiva
            let total = parseInt(PurchasePrice.current.value) + totaliva
            PurchaseTotal.current.value = (total * selectedQuantity).toFixed(2);
        }
    }, [selectedQuantity]);

    const isLoading = producersLoading || productsLoading;
    const isError = producersError || productsError;


    const savePurchase = async (event) => {

        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();

        } else {
            setValidated(true);

            const productId = selectedProduct.value;
            const Product = await getProductById(productId, setProduct)
            const PurchaseTotalText = PurchaseTotal.current.value;
            const PurchaseTotalDouble = parseFloat(PurchaseTotalText);

            let Purchase = {
                ProductName: Product.name,
                ProductImage: Product.image,
                ProductUnit: Product.unit,
                ProductId: productId,
                Quantity: Quantity.current.value,
                PurchaseInitial: PurchasePrice.current.value * Quantity.current.value,
                Iva: IVA.current.value,
                PurchaseTotal: PurchaseTotalDouble,
                
            };

            setPurchases((prevPurchases) => [...prevPurchases, Purchase]);

            const IsPurchasePrice = await getProductProducer(productId, selectedProducer.value)

            if (IsPurchasePrice != null) {

                let EditPurchasePrice = {
                    productId: productId,
                    producerId: selectedProducer.value,
                    purchasePrice: PurchasePrice.current.value,
                };

                mutationProductProducerEdit.mutateAsync(EditPurchasePrice);

            } else {

                let NewPurchasePrice = {
                    productId: productId,
                    producerId: selectedProducer.value,
                    purchasePrice: PurchasePrice.current.value,
                };
                mutationProductProducer.mutateAsync(NewPurchasePrice);
            }
        }

        Quantity.current.value = ""
            PurchasePrice.current.value = ""
            IVA.current.value = ""
            PurchaseTotal.current.value = ""
    };

    const mutationProducerOrder = useMutation('proproducerorderduct', createProducerOrder, {
        onSettled: () => queryClient.invalidateQueries('producerorder'),
        mutationKey: 'producerorder',
        onSuccess: () => {
            swal({
                title: 'Agregado!',
                text: 'El pedido ha sido agregado',
                icon: 'success',
            }).then(function(){window.location.reload()});
            
        },
        onError: () => {
            swal('Error', 'Algo salio mal...', 'error')
        }
    });

    const saveProducerOrder = async () => {

        if (purchases.length > 0) {

        let PricesSummatory = 0
        purchases.map((purchase) => {
            PricesSummatory = PricesSummatory + purchase.PurchaseTotal
        })

        const currentDate = new Date();
        const formattedDate = format(currentDate, 'yyyy-MM-dd');

        let newProducerOrder = {
            ProducerId: selectedProducer.value,
            Total: PricesSummatory,
            ConfirmedDate: formattedDate,
            PaidDate: "0001-01-01T00:00:00",
            DeliveredDate: "0001-01-01T00:00:00",
            Detail: Detail.current.value,
        };

        const producerOrder = await mutationProducerOrder.mutateAsync(newProducerOrder).finally(data => data)

        producerOrder != null ? (console.log(producerOrder)) : (console.log("Empty"))

        purchases.map((purchase) => {

            let NewPurchase = {
                ProductId: purchase.ProductId,
                Quantity: purchase.Quantity,
                PurchaseTotal: purchase.PurchaseTotal,
                ProducerOrderId: producerOrder.id,
            };

            mutationPurchase.mutateAsync(NewPurchase);
        })

        setSelectedProducer(null);
        setPurchases([]);

    } handleClose();}

    const RemoveOrder = (productId) => {

        const updatedPurchases = purchases.filter((purchase) => purchase.ProductId !== productId);
        setPurchases(updatedPurchases);
    }

    if (isLoading)
        return <div>Loading...</div>

    if (isError)
        return <div>Error</div>

    const optionsProducer = producers.map((producer) => ({
        value: producer.id,
        label: producer.name + " " + producer.lastname1 + " " + producer.lastname2,
    }));

    const optionsProduct = products.map((product) => ({
        value: product.id,
        label: product.name + " (" + product.unit + ")",
    }));

    return (
        <>

            <Button
                onClick={handleShow}
                className="BtnAdd"
            >
                     <GrAddCircle />

            </Button>

            <Modal show={show} onHide={handleClose} size='lg'>
                <Modal.Header className='HdNewOrder' closeButton>
                    <Modal.Title>Agregar nuevo pedido</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form validated={validated} onSubmit={savePurchase}>
                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Productor</Form.Label>
                                    <Select
                                        options={optionsProducer}
                                        placeholder='Seleccione el productor'
                                        ref={ProducerId}
                                        onChange={(selectedOption) => setSelectedProducer(selectedOption)}
                                        isDisabled={isProducerSelectDisabled}
                                        className="small-input"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Producto</Form.Label>
                                    <Select
                                        options={optionsProduct}
                                        placeholder='Seleccione el producto'
                                        ref={ProductId}
                                        onChange={(selectedOption) => setSelectedProduct(selectedOption)}
                                        className="small-input"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Precio inicial</Form.Label>
                                    <Form.Control
                                        type='number'
                                        placeholder='Precio por unidad'
                                        ref={PurchasePrice}
                                        min='1'
                                        className="small-input"
                                        required
                                    />
                                </Form.Group>
                            </Col>


                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>IVA</Form.Label>
                                    <Form.Control
                                        placeholder='IVA del producto'
                                        ref={IVA}
                                        type='number'
                                        min='1'
                                        onChange={handleQuantityChange}
                                        className="small-input"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Cantidad</Form.Label>
                                    <Form.Control
                                        placeholder='Ingrese la cantidad'
                                        ref={Quantity}
                                        type='number'
                                        min='1'
                                        onChange={handleQuantityChange}
                                        className="small-input"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Total de la orden</Form.Label>
                                    <Form.Control
                                        placeholder='Total de la orden'
                                        ref={PurchaseTotal}
                                        type='double'
                                        min='1'
                                        className="small-input"
                                        required
                                    />
                                </Form.Group>
                                <br />
                                <Button
                                    size='sm'
                                    className='BtnAddOrder'
                                    type="submit"
                                >
                                    Agregar orden
                                </Button>
                            </Col>
                        </Row>
                        </Form>
                        <br />

                        <Row>
                            <Col md={10}>
                                <Form.Group>
                                    <Form.Label>Resumen del pedido</Form.Label>
                                    {purchases.length > 0 ? (
                                        <Table responsive striped bordered hover size='lg'>
                                            <thead>
                                                <tr>
                                                    <th>Producto</th>
                                                    <th>Unidad</th>
                                                    <th>Cantidad</th>
                                                    <th>Precio</th>
                                                    <th>IVA</th>
                                                    <th>Total</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {purchases.map((purchase, index) => (
                                                    <tr key={index}>
                                                        <td>{purchase.ProductName}</td>
                                                        <td>{purchase.ProductUnit}</td>
                                                        <td>{purchase.Quantity}</td>
                                                        <td>₡{purchase.PurchaseInitial}</td>
                                                        <td>{purchase.Iva}%</td>
                                                        <td>₡{purchase.PurchaseTotal}</td>
                                                        <td>
                                                            <Button className='BtnDeleteOrder' variant='danger' onClick={() => RemoveOrder(purchase.ProductId)}>
                                                                Eliminar
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>

                                    ) : (
                                        ": No hay productos agregados"
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Detalle del pedido</Form.Label>
                                    <Form.Control
                                        placeholder='Detalle'
                                        ref={Detail}
                                        size='lg'
                                        type='text area'
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                </Modal.Body>
                <Modal.Footer>
                    <Button className='BtnSave' variant="primary" size="sm" onClick={saveProducerOrder} >
                        Guardar Pedido
                    </Button>
                    <Button className='BtnReturn' variant="secondary" size="sm" onClick={handleClose}
                    >
                        Cerrar
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    );
};

export default addProducerOrderModal;
