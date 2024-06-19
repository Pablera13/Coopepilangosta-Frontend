import { useState, useEffect, useMemo } from "react";
import { Box, Button, Tooltip } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import useCustomMaterialTable from "../../../utils/materialTableConfig.js";
import autoTable from "jspdf-autotable";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Container } from "react-bootstrap";
import { getEmployees } from "../../../services/employeeService";
import UpdateEmployee from "./actions/updateEmployee";
import { AddEmployee } from "./actions/addEmployeModal";
import UpdateEmployeeUser from "./actions/updateEmployeeUser";
import { deleteEmployee } from "../../../services/employeeService";
import swal from "sweetalert";
import { MdDelete } from "react-icons/md";
import "../../../css/Pagination.css";
import "../../../css/StylesBtn.css";
import { validateAllowedPageAccess } from "../../../utils/validatePageAccess.js";

const MaterialTable = () => {
  const [data, setData] = useState([]);

  const showAlert = (id) => {
    swal({
      title: "Eliminar",
      text: "¿Está seguro de que desea eliminar este usuario?",
      icon: "warning",
      buttons: ["Cancelar", "Aceptar"],
    }).then((answer) => {
      if (answer) {
        deleteEmployee(id);
        swal({
          title: "Eliminado",
          text: "El usuario ha sido eliminado",
          icon: "success",
        }).then(function () {
          window.location.reload();
        });
      }
    });
  };

  useEffect(() => {
    validateAllowedPageAccess();
    const fetchData = async () => {
      try {
        const response = await getEmployees();
        setData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const {
    isError: isLoadingError,
    isFetching: isFetching,
    isLoading: isLoading,
  } = getEmployees();

  const columns = useMemo(
    () => [
      {
        accessorKey: "cedula",
        header: "Cédula",
        enableClickToCopy: true,
      },
      {
        accessorKey: "name",
        header: "Nombre",
        enableClickToCopy: true,
      },
      {
        accessorKey: "lastName1",
        header: "Primer Apellido",
        enableClickToCopy: true,
      },
      {
        accessorKey: "lastName2",
        header: "Segundo Apellido",
        enableClickToCopy: true,
      },
      {
        accessorKey: "department",
        header: "Departamento",
        enableClickToCopy: true,
      },
      {
        accessorKey: "email",
        header: "Correo",
        enableClickToCopy: true,
        Cell: ({ row }) => {
          return <td>{row.original.user.email}</td>;
        },
      },
      {
        accessorKey: "role",
        header: "Rol",
        enableClickToCopy: true,
        Cell: ({ row }) => {
          return <td>{row.original.user.role.name}</td>;
        },
      },
    ],
    []
  );

  const handleExportRows = (rows) => {
    const doc = new jsPDF();

    // Título del PDF
    const title = "Reporte de Empleados";
    doc.setFontSize(22);
    doc.text(title, 20, 25);

    // Espacio para el título
    const tableStartY = 30;
    const tableData = rows.map((row) => {
      return columns.map((column) => {
        if (column.accessorKey === "name") {
          // Combina nombre y apellidos en un solo campo
          const fullName = `${row.original.name} ${row.original.lastName1} ${row.original.lastName2}`;
          return fullName;
        }

        // Para la columna "email", obtener el valor específico
        if (column.accessorKey === "email") {
          return row.original.user.email;
        }

        // Para la columna "role", obtener el valor específico
        if (column.accessorKey === "role") {
          return row.original.user.role.name;
        }

        // Para las demás columnas, devolver el valor original
        return row.original[column.accessorKey];
      });
    });
    const pdfColumns = [
      { header: "Cédula", accessorKey: "cedula" },
      { header: "Nombre Completo", accessorKey: "fullName" }, // Nueva columna para nombre completo
      { header: "Departamento", accessorKey: "department" },
      { header: "Correo", accessorKey: "email" },
      { header: "Rol", accessorKey: "role" },
    ];
    // Generar datos para el PDF
    const pdfTableData = rows.map((row) => [
      row.original.cedula,
      `${row.original.name} ${row.original.lastName1} ${row.original.lastName2}`,
      row.original.department,
      row.original.user.email,
      row.original.user.role.name,
    ]);

    const tableHeaders = pdfColumns.map((col) => col.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: pdfTableData,
      startY: tableStartY,
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

    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <UpdateEmployee props={row.original} />

        <UpdateEmployeeUser props={row.original.user} />

        <Tooltip title="Eliminar">
          <Button className="BtnRed" onClick={() => showAlert(row.original.id)}>
            <MdDelete />
          </Button>
        </Tooltip>
      </Box>
    ),

    renderTopToolbarCustomActions: ({ table }) => (
      <>
        <AddEmployee />

        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          startIcon={<FileDownloadIcon />}
        >
          Exportar
        </Button>
      </>
    ),
  });

  return <MaterialReactTable table={table} />;
};

const queryClient = new QueryClient();

const listEmployee = () => (
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

export default listEmployee;
