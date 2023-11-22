import React,{useState} from 'react'
import { useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap'
import { useMutation, QueryClient } from 'react-query';
import { editCostumerContact } from '../../../../services/CostumerContactService';
const updateContact = (props) => {
    const queryClient = new QueryClient()
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [validated, setValidated] = useState(false);
    const contactCostumer = props.props;
    //console.log(contactCostumer)
    const name = useRef()
    const department = useRef()
    const contact = useRef()

    const editContactMutation = useMutation('CostumerContact', editCostumerContact,
        {
            onSettled: () => queryClient.invalidateQueries('CostumerContact'),
            mutationKey: 'CostumerContact',
            onSuccess: () => {
               
                swal({
                    title: 'Editado!',
                    text: 'Se edito el contacto',
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
            let editContact = {
                id: contactCostumer.id,
                name: name.current.value,
                department: department.current.value,
                contact: contact.current.value,
                costumerId: contactCostumer.costumerId
            }
             editContactMutation.mutateAsync(editContact).then(setValidated(true))
             //await editCostumerContact(editContact).then(setValidated(true))
        }        
    }

  return (
    <>
            <Button variant="primary" onClick={handleShow} size='sm'>
                Editar
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar</Modal.Title>
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
                                defaultValue={contactCostumer.name}
                                ref={name}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Departamento: </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese el departamento"
                                required
                                defaultValue={contactCostumer.department}
                                ref={department}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Medio de contacto: : </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Puede ser correo o teléfono"
                                required
                                defaultValue={contactCostumer.contact}
                                ref={contact}
                            />
                        </Form.Group>
                        <Button type='submit'>Guardar</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    
                </Modal.Footer>
            </Modal>
        </>
  )
}

export default updateContact