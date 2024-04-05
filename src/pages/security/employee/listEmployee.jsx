import React, { useEffect } from "react";
import { Col, Row, Container, Table, Button, Form } from "react-bootstrap";
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
import { validateAllowedPageAccess } from "../../../utils/validatePageAccess";

const listEmployee = () => {

  useEffect(() => {
    validateAllowedPageAccess()
  }, [])
  

  const {
    data: employees,
    isLoading: employeesloading,
    IsError: employeesError,
  } = useQuery("employee", getEmployees);

  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  if (employeesloading) {
    return (
      <div className="Loading">
        <ul>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    );
  }
  if (employeesError) {
    return (
      <>
        <span>Error...</span>
      </>
    );
  }

  const deleteEmployee = (idEmployee) => {
    try {
      deleteEmployee(idEmployee);
    } catch (error) {
      console.log(error);
    }
  };

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

  const filteredBySearch = employees.filter((employee) => {
    const matchesSearchTerm =
    employee.cedula.toString().toLowerCase().includes(searchTerm.replace(/\s/g, "").toLowerCase()) ||
    employee.name.normalize("NFD").replace(/[\u0300-\u036f\s]/g, "").toLowerCase().includes(searchTerm.replace(/\s/g, "").toLowerCase()) ||
    employee.lastName1.normalize("NFD").replace(/[\u0300-\u036f\s]/g, "").toLowerCase().includes(searchTerm.replace(/\s/g, "").toLowerCase()) ||
    employee.lastName2.normalize("NFD").replace(/[\u0300-\u036f\s]/g, "").toLowerCase().includes(searchTerm.replace(/\s/g, "").toLowerCase()) ||
    employee.department.normalize("NFD").replace(/[\u0300-\u036f\s]/g, "").toLowerCase().includes(searchTerm.replace(/\s/g, "").toLowerCase());
    return matchesSearchTerm;
  });

  const recordsPerPage = 10;

  const offset = currentPage * recordsPerPage;
  const paginatedEmployess = filteredBySearch.slice(offset, offset + recordsPerPage);

  const pageCount = Math.ceil(filteredBySearch.length / recordsPerPage);

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

          <Col xs={4} md={3}>
              <Form.Control
                type="text"
                placeholder="Buscar coincidencias"
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input"
              />
            </Col>
        </Row>
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
                    ? filteredBySearch.map((employee) => (
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
