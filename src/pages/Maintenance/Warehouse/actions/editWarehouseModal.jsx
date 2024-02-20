import React, { useRef, useState } from 'react';
import { QueryClient, useMutation } from 'react-query';
import { Modal, Button, Form } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import swal from 'sweetalert';
import { updateWarehouse, checkWarehouseCodeAvailability } from '../../../../services/warehouseService';
import './editWarehouseModal.css'
const editWarehouseModal = (props) => {

    const warehouse = props.props;
    const queryClient = new QueryClient();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [validated, setValidated] = useState(false);
    const mutation = useMutation('warehouse', updateWarehouse, {
        onSettled: () => queryClient.invalidateQueries('warehouse'),
        mutationKey: 'warehouse',
        onSuccess: () => {
            swal({
                title: 'Editado!',
                text: 'Se edito la bodega',
                icon: 'success',
            });
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        },
    });

    const code = useRef();
    const description = useRef();
    const address = useRef();
    const state = useRef();

    const saveWarehouse = async (event) => {
        event.preventDefault()
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            setValidated(true);
            let newWarehouse = {
                id: warehouse.id,
                code: code.current.value,
                description: description.current.value,
                address: address.current.value,
                state: state.current.value,
            };

            // let codeAvailability = await checkWarehouseCodeAvailability(code.current.value).then(data => data)
            // .finally(
            //     setTimeout(() => {
            //     window.location.reload()
            // }, 2000));

            // if (codeAvailability == true){

            mutation.mutateAsync(newWarehouse);

            // }else{
            //     event.preventDefault();
            //     swal('Advertencia','Este codigo de bodega se encuentra en uso.','warning')
            // }

        }
    };

    const limpiarInput = () => {
        code.current.value = '';
        description.current.value = '';
        address.current.value = '';
        state.current.value = '';
    };

    return (
        <>
            <Button className='BtnEditWareHouse' onClick={handleShow}size='sm'>
                Editar
            </Button>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header className='HdEditWarehouse' closeButton>
                    <Modal.Title >Editar bodega</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form validated={validated} onSubmit={saveWarehouse}>
                        <Form.Group className="mb-3">
                            <Form.Label>Código:</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                readOnly={true}
                                defaultValue={warehouse.code}
                                placeholder="Ingrese el código"
                                ref={code}
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
                    <Button className='BtnSaveWarehouse' variant="primary" size="sm" onClick={saveWarehouse}>
                        Editar Bodega
                    </Button>
                    <Button className='BtnReturnWarehouse' variant="secondary" size="sm" onClick={handleClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default editWarehouseModal;
