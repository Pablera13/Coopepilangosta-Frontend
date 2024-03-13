import React from "react";
import { Col, Row, Container, Table, Button } from "react-bootstrap";
import Select from "react-select";
import { useQuery } from "react-query";
import { getEmployees } from "../../../services/employeeService";
import UpdateEmployee from "./actions/updateEmployee";
import { AddEmployee } from "./actions/addEmployeModal";
import UpdateEmployeeUser from "./actions/updateEmployeeUser";
import { deleteEmployee } from "../../../services/employeeService";
import { useState } from "react";
import { deleteUser } from "../../../services/userService";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from "sweetalert";
import { MdDelete } from "react-icons/md";
import "../../../css/Pagination.css";
import "../../../css/StylesBtn.css";
const listEmployee = () => {
  const {
    data: employees,
    isLoading: employeesloading,
    IsError: employeesError,
  } = useQuery("employee", getEmployees);

  const [currentPage, setCurrentPage] = useState(0);

  const navigate = useNavigate();

  if (employeesloading) {
    return (
      <>
        <span>Cargando...</span>
      </>
    );
  }
  if (employeesError) {
    return (
      <>
        <span>Error...</span>
      </>
    );
  }

  const deleteEmployeeMethod = (idEmployee) => {
    try {
      deleteEmployee(idEmployee);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteUserEmployee = (idUser) => {
    try {
      deleteUser(idUser);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteEmployee = (idEmployee) => {
    try {
      deleteEmployee(idEmployee);
    } catch (error) {
      console.log(error);
    }
  };
  // const deleteUserEmployee = (idUser) => {
  //   try {
  //     deleteUser(idUser)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const showDeleteAlert = (idEmployee, idUser) => {
    console.log("Id employee: " + idEmployee + ", Id user: " + idUser);
    swal({
      title: "Eliminar",
      text: "Esta seguro que desea eliminar este empleado?",
      icon: "warning",
      buttons: ["Cancelar", "Aceptar"],
    }).then((answer) => {
      if (answer) {
        swal({
          title: "Eliminado!",
          text: `El empleado ha sido eliminado`,
          icon: "success",
        });
        setTimeout(function () {
          deleteEmployee(idEmployee);
          deleteUser(idUser);
          window.location.reload();
        }, 2000);
      }
    });
  };

  const recordsPerPage = 10;

  const offset = currentPage * recordsPerPage;
  const paginatedEmployess = employees.slice(offset, offset + recordsPerPage);

  const pageCount = Math.ceil(employees.length / recordsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <Container>
      <div className="table-container">
        <h2 className="table-titles">Empleados</h2>
        <hr className="divider" />
        <br />
        <Row>
          <Col>
            <AddEmployee />
          </Col>
        </Row>

        {/* <Form>
          <Row className="mb-3 filters-container">
            <Col xs={6} md={6}>
              <AddProducerModal />
            </Col>
            <Col xs={0} md={0}></Col>
            <Col xs={12} md={3}>
              <Form.Control
                type="text"
                placeholder="Buscar coincidencias"
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input"
              />
            </Col>
          </Row>
        </Form> */}
        <br />
        <Col xs={12} md={2} lg={12}>
          {employees ? (
            <Row>
              <Table className="Table" responsive>
                <thead>
                  <tr>
                    <th>Cédula</th>
                    <th>Nombre</th>
                    <th>Primer Apellido</th>
                    <th>Segundo Apellido</th>
                    <th>Departamento</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {employees != null
                    ? paginatedEmployess.map((employee) => (
                        <tr key={employee.id}>
                          <td>{employee.cedula}</td>
                          <td>{employee.name}</td>
                          <td>{employee.lastName1}</td>
                          <td>{employee.lastName2}</td>
                          <td>{employee.department}</td>
                          <td>{employee.user.role.name}</td>
                          <td>
                            <div className="BtnContainer">
                              <UpdateEmployee props={employee} />
                              <Button
                                size="sm"
                                className="BtnRed"
                                variant="danger"
                                onClick={() =>
                                  showDeleteAlert(employee.id, employee.user.id)
                                }
                              >
                                <MdDelete />
                              </Button>
                              <UpdateEmployeeUser props={employee.user} />
                            </div>
                          </td>
                        </tr>
                      ))
                    : "Cargando"}
                </tbody>
              </Table>
              <div className="Pagination-Container">
                <ReactPaginate
                  previousLabel="<"
                  nextLabel=">"
                  breakLabel="..."
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName="pagination"
                  subContainerClassName="pages pagination"
                  activeClassName="active"
                />
              </div>
            </Row>
          ) : (
            "Cargando"
          )}
        </Col>
      </div>
    </Container>
  );
};

export default listEmployee;
