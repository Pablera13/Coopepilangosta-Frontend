import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Container, Form, Button, Spinner,Card } from "react-bootstrap";
import { loginUser, getUserInformation } from "../../services/loginService";
import { NavLink } from "react-router-dom";
import "./login.css";
import swal from "sweetalert";
import { validateLogForLogin } from "../../utils/validatePageAccess";


import "../../css/Pagination.css";
import "../../css/StylesBtn.css";


const login = () => {
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    validateLogForLogin()
  }, [])
  

  const email = useRef();
  const password = useRef();

  let token = "";

  const handleLogin = async () => {
    let userLogin = {
      email: email.current.value,
      password: password.current.value,
    };
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
              "Correo no válido",
              "No se encontró un usuario asociado al correo electrónico brindado.",
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
      <div className="imagen-de-fondo"></div>
      <Container className="loginContainer" fluid>
        <Row>
          <Col>
            <br />
          </Col>
        </Row>

        <Card className="CardC">
        <Row xs={12}>

          <Card.Body className="cardContainer">
            <Form>
              <Row>
                <Col xs={12} sm={12} lg={12}>
                <h3>Bienvenido</h3>
                <br></br>
                  <Form.Group className="mb-3" controlId="formPlaintextEmail" style={{ marginTop: '4%' }}>
                    <Form.Label className="labelLogin ">Correo</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese su correo"
                      ref={email}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} lg={12}>
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
                <br></br>

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
              <br></br>

                <NavLink className="btn-forgotpasswords" to={"/forgotPassword"}>
                  ¿Olvidó su contraseña?
                </NavLink>
              </Row>
              <br />
            </Form>
          </Card.Body>
          </Row>

        </Card>
      </Container>
      <br />
    </>
  );
};

export default login;