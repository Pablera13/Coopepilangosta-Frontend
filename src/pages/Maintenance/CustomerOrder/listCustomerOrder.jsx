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
import { deleteCostumerOrder } from "../../../services/costumerorderService";
import { getCostumerOrder } from "../../../services/costumerorderService";
import PrintCustomerOrder from "./actions/printCustomerOrder.jsx";
import UpdateCustomerOrderModal from "./actions/updateCustomerOrderModal.jsx";
import { MdDelete } from "react-icons/md";
import "../../../css/Pagination.css";
import "../../../css/StylesBtn.css";
import { validateAllowedPageAccess } from "../../../utils/validatePageAccess.js";

const MaterialTable = () => {
  validateAllowedPageAccess();

  const [data, setData] = useState([]);

  const showAlert = (id) => {
    swal({
      title: "Eliminar",
      text: "¿Está seguro de que desea eliminar este pedido?",
      icon: "warning",
      buttons: ["Cancelar", "Aceptar"],
    }).then((answer) => {
      if (answer) {
        deleteCostumerOrder(id);
        swal({
          title: "Eliminado",
          text: "El pedido ha sido eliminado",
          icon: "success",
        }).then(function () {
          window.location.reload();
        });
      }
    });
  };

  useEffect(() => {
    validateAllowedPageAccess()
    const fetchData = async () => {
      try {
        const response = await getCostumerOrder();
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
  } = getCostumerOrder();

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "#",
        enableClickToCopy: true,
      },
      {
        accessorKey: "confirmedDate",
        header: "Recibido",
        enableClickToCopy: true,
        Cell: ({ row }) => {
          return (
            <span>
              {row.original.confirmedDate === "0001-01-01T00:00:00"
                ? ""
                : format(new Date(row.original.confirmedDate), "yyyy-MM-dd")}
            </span>
          );
        },
      },
      {
        accessorKey: "total",
        header: "Total",
        enableClickToCopy: true,
        Cell: ({ row }) => {
          return (
            <span>
              {row.original.total === 0
                ? "Por cotizar"
                : `₡${row.original.total.toFixed(2)}`}
            </span>
          );
        },
      },
      {
        accessorKey: "paidDate",
        header: "Estado Pago",
        enableClickToCopy: true,
        Cell: ({ row }) => {
          return (
            <span>
              {row.original.paidDate === "0001-01-01T00:00:00"
                ? "Sin pagar"
                : format(new Date(row.original.paidDate), "yyyy-MM-dd")}
            </span>
          );
        },
      },
      {
        accessorKey: "deliveredDate",
        header: "Estado Entrega",
        enableClickToCopy: true,
        Cell: ({ row }) => {
          return (
            <span>
              {row.original.deliveredDate === "0001-01-01T00:00:00"
                ? "No entregado"
                : format(new Date(row.original.deliveredDate), "yyyy-MM-dd")}
            </span>
          );
        },
      },
      {
        accessorKey: "stage",
        header: "Seguimiento",
        enableClickToCopy: true,
      },
    ],
    []
  );

  const handleExportRows = (rows) => {
    const doc = new jsPDF();

    const title = "Pedidos Recibidos";
    doc.setFontSize(22);
    doc.text(title, 20, 25);

    const tableStartY = 30;
    const tableData = rows.map((row) => {
      return columns.map((column) => {
        if (
          column.accessorKey === "confirmedDate" ||
          column.accessorKey === "paidDate" ||
          column.accessorKey === "deliveredDate"
        ) {
          return format(
            new Date(row.original[column.accessorKey]),
            "yyyy-MM-dd"
          );
        }
        if (column.accessorKey === "total") {
          return row.original.total === 0
            ? "Por cotizar"
            : `${row.original.total.toFixed(2)}`;
        }
        return row.original[column.accessorKey];
      });
    });
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: tableStartY,
    });

    const currentDate = new Date();
    const formattedDate = format(currentDate, "yyyy-MM-dd");
    doc.save(`Reporte Pedidos Recibidos ${formattedDate}.pdf`);
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
        <UpdateCustomerOrderModal props={row.original} />

        <Tooltip title="Eliminar">
          <Button className="BtnRed" onClick={() => showAlert(row.original.id)}>
            <MdDelete />
          </Button>
        </Tooltip>

        <PrintCustomerOrder props={row.original.id} />
      </Box>
    ),

    renderTopToolbarCustomActions: ({ table }) => (
      <>
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

const listCustomerOrder = () => (
  <Container>
    <div className="table-container">
      <h2 className="table-title">Pedidos Recibidos</h2>
      <hr className="divider" />
      <QueryClientProvider client={queryClient}>
        <MaterialTable />
      </QueryClientProvider>
    </div>
  </Container>
);

export default listCustomerOrder;
