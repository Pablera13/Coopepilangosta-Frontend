import { useState, useEffect, useMemo } from "react";
import { Box, Button, Tooltip} from '@mui/material';
import { MaterialReactTable} from 'material-react-table';
import useCustomMaterialTable from '../../../utils/materialTableConfig.js'; 
import autoTable from 'jspdf-autotable';
import { jsPDF } from 'jspdf'; 
import { format } from "date-fns";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Container } from "react-bootstrap";
import { getEmployees } from "../../../services/employeeService";
import UpdateEmployee from "./actions/updateEmployee";
import { AddEmployee } from "./actions/addEmployeModal";
import UpdateEmployeeUser from "./actions/updateEmployeeUser";
import { deleteEmployee } from "../../../services/employeeService";
import { deleteUser } from "../../../services/userService";
import swal from "sweetalert";
import { MdDelete } from "react-icons/md";
import "../../../css/Pagination.css";
import "../../../css/StylesBtn.css";
import { validateAllowedPageAccess } from "../../../utils/validatePageAccess";

const MaterialTable = () => {

  const [data, setData] = useState([]);

  const showAlert = (id) => {
    swal({
      title: "Eliminar",
      text: "¿Está seguro de que desea eliminar este pedido?",
      icon: "warning",
      buttons: ["Cancelar", "Aceptar"],
    }).then((answer) => {
      if (answer) {
        deleteEmployee(id);
        swal({
          title: 'Eliminado',
          text: 'El pedido ha sido eliminado',
          icon: 'success',
        }).then(function () { window.location.reload() });

      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEmployees();
        setData(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const { isError: isLoadingError, isFetching: isFetching, isLoading: isLoading } = getEmployees();

  const columns = useMemo(() => [
    {
      accessorKey: 'cedula',
      header: 'Cédula',
      enableClickToCopy: true,
    },
    {
      accessorKey: 'name',
      header: 'Nombre',
      enableClickToCopy: true,
    },
    {
      accessorKey: 'lastName1',
      header: 'Primer Apellido',
      enableClickToCopy: true,
    },
    {
      accessorKey: 'lastName2',
      header: 'Segundo Apellido',
      enableClickToCopy: true,
    },
    {
      accessorKey: 'department',
      header: 'Departamento',
      enableClickToCopy: true,
    },
    {
      accessorKey: 'name',
      header: 'Rol',
      enableClickToCopy: true,
      Cell: ({ row }) => { 
        return <td>{row.original.user.role.name}</td>;
      }
    },
  ], []);

  const handleExportRows = (rows) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => 
    Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    const currentDate = new Date();
    const formattedDate = format(currentDate, "yyyy-MM-dd");
    doc.save(`Reporte Empleados ${formattedDate}.pdf`);
  };

  const table = useCustomMaterialTable({
    columns,
    data: data,
    isLoading,
    isLoadingError,
    isFetching,
    showAlert,

    renderRowActions: ({row}) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Actualizar datos del empleado">

          <UpdateEmployee props={row.original.id} />

        </Tooltip>
        <Tooltip title="Actualizar Usuario">

          <UpdateEmployeeUser props={row.original.user.role.id} />

        </Tooltip>
        <Tooltip title="Eliminar">

          <Button className="BtnRed" onClick={() => showAlert(row.original.id)}><MdDelete /></Button>

        </Tooltip>
      </Box>
    ),

    renderTopToolbarCustomActions: ({ table }) =>(
    <>
    <AddEmployee/>

    <Button
      disabled={table.getPrePaginationRowModel().rows.length === 0}
      onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
      startIcon={<FileDownloadIcon />}
    >
      Exportar
    </Button></>),
  });

  return <MaterialReactTable table={table}
  />;
};

const queryClient = new QueryClient();

const listEmployee
= () => (
  <Container>
    <div className="table-container">
      <h2 className="table-title">Empleados</h2>
      <hr className="divider" />
      <QueryClientProvider client={queryClient}>
        <MaterialTable />
      </QueryClientProvider>
    </div>
  </Container>

);

export default listEmployee
;