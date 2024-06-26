import React from "react";
import {
  Container,
  Col,
  Row,
  Button,
  Card,

} from "react-bootstrap";
import AddContact from "../costumers/actions/addContact";
import UpdateContact from "../costumers/actions/updateContact";
import { Tooltip } from '@mui/material';

import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import { getUserById } from "../../../services/userService";
import { useQuery } from "react-query";
import { deleteCostumerContact } from "../../../services/CostumerContactService";
import swal from "sweetalert";
import { MdLogout } from "react-icons/md";

import UpdateCostumer from "../costumers/actions/updateCostumer";

import { getCostumerOrder } from "../../../services/costumerorderService";

import "./costumerProfile.css";
import { getUserLocalStorage } from "../../../utils/getLocalStorageUser";

const costumerProfile = () => {
  const userStorage = getUserLocalStorage()
  const [user, setUser] = useState(null);
  const {
    data: customerorderData,
    isLoading,
    isError,
  } = useQuery("customerorder", getCostumerOrder);

  useEffect(() => {
    if (customerorderData) {
      getUserById(userStorage.id, setUser);
    }
  }, [customerorderData]);

  const handleLogout = () => {
    swal({
      title: "Cerrar sesión",
      text: "Está seguro?",
      icon: "warning",
      buttons: ["Cancelar", "Aceptar"],
    }).then((answer) => {
      if (answer) {
        swal({
          title: "Se cerró la sesión!",
          text: `Volverá al sitio principal`,
          icon: "success",
        });
        setTimeout(function () {
          localStorage.clear()
          window.location = "/";
        }, 2000);
      }
    });
  };

  const deleteContact = (id) => {
    deleteCostumerContact(id).finally(() => window.location.reload());
  };

  const showAlert = (id) => {
    swal({
      title: "Eliminar",
      text: "¿Está seguro de que desea eliminar este contacto?",
      icon: "warning",
      buttons: ["Cancelar", "Aceptar"],
    }).then((answer) => {
      if (answer) {
        swal({
          title: "Eliminado!",
          text: "El contacto ha sido eliminado",
          icon: "success",
        });
        setTimeout(() => {
          deleteContact(id);
        }, 1500);
      }
    });
  };

  return (
    <Container>
      {user != null && customerorderData != null ? (
        <>
          <Row>
            <Col xl={3} lg={3} md={12} sm={12} xs={12}>
              <Card className="h-100">
                <Card.Body>
                  <div className="account-settings">
                    <div className="user-profile">
                      <div className="user-avatar">
                        <img
                          src="https://image.ibb.co/jw55Ex/def_face.jpg"
                          alt="User Avatar"
                        />
                      </div>
                      <h5 className="user-name">{user.costumer.name}</h5>
                      <h6 className="user-email">{user.email}</h6>
                    </div>
                    <div className="about">
                      <h5>
                        {user.costumer.verified == true
                          ? "Verificado"
                          : "No verificado"}
                      </h5>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={9} lg={9} md={12} sm={12} xs={12}>
              <Card className="h-100">
                <Card.Body>
                  <Row className="gutters">
                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                      <h6 className="ProfileText">Información general</h6>
                      <br />
                    </Col>
                    <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                      <div className="CostumerLabel">
                        <h5 className="ProfileLabels">Nombre</h5>
                        <input
                          type="text"
                          className="form-control"
                          id="fullName"
                          placeholder={user.costumer.name}
                          readOnly
                        />
                      </div>
                    </Col>
                    <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                      <div className="CostumerLabel">
                        <h5 className="ProfileLabels">Cédula Jurídica</h5>
                        <input
                          type="text"
                          className="form-control"
                          id="eMail"
                          placeholder={user.costumer.cedulaJuridica}
                          readOnly
                        />
                      </div>
                    </Col>
                    <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                      <div className='CostumerLabel'>
                        <h5 className="ProfileLabels">Correo Electrónico</h5>
                        <input type='text' className='form-control' id='fullName' placeholder={user.costumer.email} readOnly />
                      </div>
                    </Col>
                    <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                      <div className='CostumerLabel'>
                        <h5 className="ProfileLabels">Línea Telefónica</h5>
                        <input type='text' className='form-control' id='eMail' placeholder={`+506 ${user.costumer.phoneNumber}`} readOnly />
                      </div>
                    </Col>
                    <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                      <div className="CostumerLabel">
                        <h5 className="ProfileLabels">Provincia</h5>
                        <input
                          type="text"
                          className="form-control"
                          id="phone"
                          placeholder={user.costumer.province}
                          readOnly
                        />
                      </div>
                    </Col>
                    <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                      <div className="CostumerLabel">
                        <h5 className="ProfileLabels">Cantón</h5>
                        <input
                          type="text"
                          className="form-control"
                          id="website"
                          placeholder={user.costumer.canton}
                          readOnly
                        />
                      </div>
                    </Col>

                    <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                      <div className="CostumerLabel">
                        <h5 className="ProfileLabels">Distrito</h5>
                        <input
                          type="text"
                          className="form-control"
                          id="website"
                          placeholder={user.costumer.district}
                          readOnly
                        />
                      </div>
                    </Col>

                    <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                      <div className="CostumerLabel">
                        <h5 className="ProfileLabels">Dirección</h5>
                        <input
                          type="text"
                          className="form-control"
                          id="website"
                          placeholder={user.costumer.address}
                          readOnly
                        />
                      </div>
                    </Col>

                    <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                      <div className="CostumerLabel">
                        <h5 className="ProfileLabels">Código Postal</h5>
                        <input
                          type="text"
                          className="form-control"
                          id="website"
                          placeholder={user.costumer.postalCode}
                          readOnly
                        />
                      </div>
                    </Col>

                    <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                      <div className="CostumerLabel">
                        <h5 className="ProfileLabels">Cuenta IBAN</h5>
                        <input
                          type="text"
                          className="form-control"
                          id="website"
                          placeholder={
                            user.costumer.bankAccount !== "0"
                              ? `CR ${user.costumer.bankAccount}`
                              : "No ingresado"
                          }                          readOnly
                        />
                      </div>
                    </Col>

                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                      <br />
                      <h6 className="ProfileText">Información de Usuario</h6>
                      <br />
                    </Col>
                    <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                      <div className="CostumerLabel">
                        <h5 className="ProfileLabels">Correo Electrónico</h5>
                        <input
                          type="text"
                          className="form-control"
                          id="Street"
                          placeholder={user.email}
                          readOnly
                        />
                      </div>
                    </Col>
                    <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                      <div className="CostumerLabel">
                        <h5 className="ProfileLabels">Nombre de Usuario</h5>
                        <input
                          type="text"
                          className="form-control"
                          id="ciTy"
                          placeholder={user.userName}
                          readOnly
                        />
                      </div>
                    </Col>

                    <Card.Body>
                      <Row>
                        <Col md={8} sm={8} lg={8}></Col>
                        <Col md={1} sm={1} lg={1}>
                          <UpdateCostumer props={user.costumer} />
                        </Col>
                        <Col md={1} sm={1} lg={1}>
                          <AddContact props={user.costumer.id} />
                        </Col>
                        <Col md={1} sm={1} lg={1}>



                          <Tooltip title="Cerrar sesión">
                            <Button onClick={handleLogout} className="BtnRed">
                              <MdLogout />
                            </Button>
                          </Tooltip>

                        </Col>
                      </Row>
                    </Card.Body>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={3} lg={3} md={12} sm={12} xs={12}>
              {user.costumer.costumersContacts ? (
                <div className="d-flex flex-column">
                  {user.costumer.costumersContacts.map((contact) => (
                    <Card key={contact.id} className="mb-3">
                      <Card.Header>Información de contacto</Card.Header>
                      <Card.Body>
                        <Card.Title>{contact.name}</Card.Title>
                        <Card.Text>Contacto: {contact.contact}</Card.Text>
                        <div className="d-flex justify-content-between">
                          <UpdateContact props={contact} />


                          <Tooltip title="Eliminar contacto">
                          <Button
                            className="BtnRed"
                            onClick={() => showAlert(contact.id)}
                            size="sm"
                          >
                            <MdDelete />
                          </Button>
                          </Tooltip>


                          
                        </div>
                        <hr />
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <Card.Body>Aún no se han agregado contactos</Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        </>
      ) : (
        <div className="Loading">
          <ul>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
      )}
    </Container>
  );
};

export default costumerProfile;
