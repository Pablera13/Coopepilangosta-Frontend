import React from 'react'
import { Col,Row,Container,Table,Button } from 'react-bootstrap'
import Select from 'react-select'
import { useQuery } from 'react-query'
import { getEmployees } from '../../../services/employeeService'
import UpdateEmployee from './actions/updateEmployee'
import { AddEmployee } from './actions/addEmployee'
import UpdateEmployeeUser from './actions/updateEmployeeUser'
import { deleteEmployee } from '../../../services/employeeService'
import { useState } from 'react';
import { deleteUser } from '../../../services/userService'
import {useNavigate} from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import swal from 'sweetalert'
import './listEmployee.css'
const listEmployee = () => {
    const {data:employees,isLoading:employeesloading,IsError:employeesError} = useQuery('employee',getEmployees);

    const [currentPage, setCurrentPage] = useState(0);

    const navigate = useNavigate()
  const buttonStyle = {
    borderRadius: '5px',
    backgroundColor: '#e0e0e0',
    color: '#333',
    border: '1px solid #e0e0e0',
    padding: '8px 12px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    minWidth: '100px',
    fontWeight: 'bold',
    hover: {
      backgroundColor: '#c0c0c0', 
    },
  };

    if(employeesloading){return <><span>Cargando...</span></>}
    if(employeesError){return <><span>Error...</span></>}

    const deleteEmployeeMethod = (idEmployee) => {
        try {
            deleteEmployee(idEmployee)
        } catch (error) {
            console.log(error)
        }
    }
    const deleteUserEmployee = (idUser) => {
        try {
            deleteUser(idUser)
        } catch (error) {
            console.log(error)
        }
    }

    const showDeleteAlert = (idEmployee,idUser) => {
        console.log("Id employee: "+idEmployee+", Id user: "+idUser)
        swal({
            title:"Eliminar",
            text:"Esta seguro que desea eliminar este empleado?",
            icon:"warning",
            buttons:["Cancelar","Aceptar"]
          }).then(answer=>{
            if(answer){
              swal({
                title:'Eliminado!',
                text:`El empleado ha sido eliminada`,
                icon:"success"
              
              })
              deleteEmployeeMethod(idEmployee);
              deleteUser(idUser);
              setTimeout(function(){
                
                window.location.reload();
            }, 2000)
              
            }
          })
    }

    const recordsPerPage = 10;

    const offset = currentPage * recordsPerPage;
  const paginatedEmployess = employees.slice(offset, offset + recordsPerPage);

  const pageCount = Math.ceil(employees.length / recordsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <>
    <Container>
        <Row>
        <h2 className="text-center">Empleados</h2>
            <td></td>
        </Row>
        <Row>
            <Col >
                <AddEmployee/>               
            </Col>
        </Row>
        <br />
        <Row>
            <Table striped hover variant="light" responsive>
                <thead className="bg-dark text-white">
                    <tr >
                        <th>Cédula</th>
                        <th>Nombre</th>
                        <th>Primer Apellido</th>
                        <th>Segundo Apellido</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                {
                    employees!=null?(
                        
                        paginatedEmployess.map((employee)=>
                            <tr key={employee.id}>
                                <td>{employee.cedula}</td>
                                <td>{employee.name}</td>
                                <td>{employee.lastName1}</td>
                                <td>{employee.lastName2}</td>
                                <td>{employee.user.role.name}</td>
                                <td>
                                    <UpdateEmployee props={employee}/>
                                    <Button size='sm' variant='danger' onClick={()=>showDeleteAlert(employee.id,employee.user.id)}>Eliminar</Button>
                                    <UpdateEmployeeUser props={employee.user}/>
                                </td>
                            </tr>
                        )
                        
                    ):("")
                }
                </tbody>
            </Table>
            <ReactPaginate
              previousLabel="Anterior"
              nextLabel="Siguiente"
              breakLabel="..."
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName="pagination"
              subContainerClassName="pages pagination"
              activeClassName="active"
            />
        </Row>
    </Container>
    </>
    
  )
}

export default listEmployee