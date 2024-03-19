import React, { useRef, useState } from "react";
import { Row, Col, Container, Form, Button, Spinner } from "react-bootstrap";
import { loginUser, getUserInformation } from "../../services/loginService";
import { NavLink } from "react-router-dom";
import "./login.css";
import swal from "sweetalert";

const login = () => {
  const [loginLoading, setLoginLoading] = useState(false);

  const email = useRef();
  const password = useRef();

  let token = "";

  const handleLogin = async () => {
    let userLogin = {
      email: email.current.value,
      password: password.current.value,
    };
    //console.log(userLogin)
    try {
      token = await loginUser(userLogin)
        .then((data) => data)
        .then(setLoginLoading(true)).catch(function(){setLoginLoading(false)})
        ;
      localStorage.setItem("bearer", token);
      if (token != "") {
        switch (token) {
          case "Wrong password":
            swal("Contraseña incorrecta", "La clave no coincide", "error");
            setLoginLoading(false)
            break;
          case "User not found":
            swal(
              "Correo no valido",
              "No se encontró un usuario asociado a ese correo electrónico",
              "warning"
            );
            setLoginLoading(false)
            break;
          default:
            try {
              let user = await getUserInformation(userLogin);
              if (user) {
                localStorage.setItem("user", JSON.stringify(user));
                window.location = "/";
              }
            } catch (error) {
              console.log(error);
            }
            setLoginLoading(false)
            break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div class="imagen-de-fondo"></div>
      <Container className="loginContainer">
        <Row>
          <Col>
            <br />
            <h3>Bienvenido</h3>
          </Col>
        </Row>
        <Form>
          <Row>
            <Col xs={12} lg={12}>
              <Form.Group cla2ssName="mb-3" controlId="formPlaintextEmail" style={{ marginTop: '4%' }}>
                <Form.Label className="labelLogin">Correo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese su correo"
                  ref={email}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Form.Group className="mb-3" controlId="formPlaintextPassword" style={{ marginTop: '4%' }} >
                <Form.Label className="labelLogin">Contraseña</Form.Label>
                <Form.Control
                required
                  type="password"
                  placeholder="Ingrese su Contraseña"
                  ref={password}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col xs={12} lg={12}>
              <Button className="BtnStar" onClick={handleLogin} disabled={loginLoading}>
                {loginLoading ? (
                  <Spinner animation="border" variant="light" size="sm" />
                ) : (
                  ""
                )}
                Iniciar sesión
              </Button>
              </Col>
              <Col xs={12} lg={12}>
              <Button className="BtnStar" href={"/registerCostumer"}>
                Registrarme
              </Button>
              </Col>
          </Row>
          <br />
          <Row>
            <NavLink className="btn-forgotpasswords" to={"/forgotPassword"}>
              ¿Olvidó su contraseña?
            </NavLink>
          </Row>
          <br />
        </Form>
      </Container>
      <br />
    </>
  );
};

export default login;
