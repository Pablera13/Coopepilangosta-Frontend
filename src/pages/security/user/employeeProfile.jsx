import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import UpdateEmployee from "../employee/actions/updateEmployee";
import "./employeeProfile.css";
import { MdLogout } from "react-icons/md";
import { Tooltip } from '@mui/material';
import { getUserLocalStorage } from "../../../utils/getLocalStorageUser";

const employeeProfile = () => {
  const user = getUserLocalStorage()

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

  return (
    <Container>
      <Row className="gutters">
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
                  <h5 className="user-name">
                    {user.employee.name} {user.employee.lastName1}{" "}
                    {user.employee.lastName2}
                  </h5>
                  <h6 className="user-email">{user.email}</h6>
                </div>
                <div className="about">
                  <h5>
                    {user.role.name}
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
                  <h6 className="ProfileText">Información Personal</h6>
                  <br />
                </Col>
                <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                  <div className="EmployeeLabel">
                    <h5 className="ProfileLabels">Nombre</h5>
                    <input
                      type="text"
                      className="form-control"
                      id="fullName"
                      placeholder={user.employee.name}
                      readOnly
                    />
                  </div>
                </Col>
                <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                  <div className="EmployeeLabel">
                    <h5 className="ProfileLabels">Primer Apellido</h5>
                    <input
                      type="email"
                      className="form-control"
                      id="eMail"
                      placeholder={user.employee.lastName1}
                      readOnly
                    />
                  </div>
                </Col>
                <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                  <div className="EmployeeLabel">
                    <h5 className="ProfileLabels">Segundo Apellido</h5>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      placeholder={user.employee.lastName2}
                      readOnly
                    />
                  </div>
                </Col>
                <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                  <div className="EmployeeLabel">
                    <h5 className="ProfileLabels">Cédula</h5>
                    <input
                      type="url"
                      className="form-control"
                      id="website"
                      placeholder={user.employee.cedula}
                      readOnly
                    />
                  </div>
                </Col>

                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                  <br />
                  <h6 className="ProfileText">Información de Usuario</h6>
                  <br />
                </Col>
                <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                  <div className="EmployeeLabel">
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
                  <div className="EmployeeLabel">
                    <h5 className="ProfileLabels">Usuario</h5>
                    <input
                      type="text"
                      className="form-control"
                      id="ciTy"
                      placeholder={user.userName}
                      readOnly
                    />
                  </div>
                </Col>
                <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                  <div className="EmployeeLabel">
                    <h5 className="ProfileLabels">Permisos</h5>
                    <input
                      type="text"
                      className="form-control"
                      id="sTate"
                      placeholder={
                        user.idRole == 1
                          ? "Administrador"
                          : "Super Administrador"
                      }
                      readOnly
                    />
                  </div>
                </Col>
                <br />

                <Row>
                  <Col md={9} sm={9} lg={9}></Col>

                  <Col md={1} sm={1} lg={1}>
                    <UpdateEmployee props={user.employee} />
                  </Col>
                  <Col md={1} sm={1} lg={1}>

                    <Tooltip title="Cerrar sesión">

                      <Button onClick={handleLogout} className="BtnRed">
                        <MdLogout />
                      </Button>
                    </Tooltip>

                  </Col>
                </Row>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default employeeProfile;
