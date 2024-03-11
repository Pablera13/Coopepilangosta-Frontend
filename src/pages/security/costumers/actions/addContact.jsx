import React, { useRef, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useMutation, QueryClient } from 'react-query';
import { createContactCostumer } from '../../../../services/CostumerContactService';
const addContact = (props) => {
    const queryClient = new QueryClient()
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [validated, setValidated] = useState(false);
    
    const idCostumer = props.props;

    const name = useRef()
    const department = useRef()
    const contact = useRef()

    const addContactMutation = useMutation('CostumerContact', createContactCostumer,
        {
            onSettled: () => queryClient.invalidateQueries('CostumerContact'),
            mutationKey: 'CostumerContact',
            onSuccess: () => {
               
                swal({
                    title: 'Guardado!',
                    text: 'Se creo el contacto',
                    icon: 'success',
                });
                         
            },
            onError: () => {
                console.log("Error creating the costumer")
            }
        })

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            let newContact = {
                name: name.current.value,
                department: department.current.value,
                contact: contact.current.value,
                costumerId: idCostumer
            }
             addContactMutation.mutateAsync(newContact).then(setValidated(true))
        }        
    }

    return (
        <>
            <Button className='BtnBrown' onClick={handleShow}>
                Agregar contacto
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header  className="HeaderModal" closeButton>
                    <Modal.Title>Agregar contacto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Nombre: </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese nombre y apellido del contacto"
                                autoFocus
                                required
                                ref={name}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Departamento: </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese el departamento"
                                required
                                ref={department}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Medio de contacto: : </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Puede ser correo o teléfono"
                                required
                                ref={contact}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button className='BtnSave'onClick={handleSubmit}  type='submit'>Guardar</Button>

                    <Button className='BtnClose' variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    
                </Modal.Footer>
            </Modal>
        </>

    )
}

export default addContact