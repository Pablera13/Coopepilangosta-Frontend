import { useState, useEffect, useMemo } from "react";
import { Button } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import useCustomMaterialTable from "../../../utils/materialTableConfig.js";
import autoTable from "jspdf-autotable";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { getstocks } from "../../../services/reportServices/stockreportService";
import { Container } from "react-bootstrap";
import "../../../css/StylesBtn.css";
import "../../../css/Pagination.css";
import { validateAllowedPageAccess } from "../../../utils/validatePageAccess.js";

const MaterialTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    validateAllowedPageAccess()
    const fetchData = async () => {
      try {
        const response = await getstocks();
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
  } = getstocks();

  const columns = useMemo(
    () => [
      {
        accessorKey: "productName",
        header: "Producto",
        enableClickToCopy: true,
      },
      {
        accessorKey: "cambioFecha",
        header: "Fecha del cambio",
        enableClickToCopy: true,
        Cell: ({ row }) => {
          return (
            <span>
              {row.original.cambioFecha === "0001-01-01T00:00:00"
                ? ""
                : format(new Date(row.original.cambioFecha), "yyyy-MM-dd")}
            </span>
          );
        },
      },
      {
        accessorKey: "oldStock",
        header: "Inicial",
        enableClickToCopy: true,
      },
      {
        accessorKey: "newStock",
        header: "Modificado",
        enableClickToCopy: true,
      },
      {
        accessorKey: "motive",
        header: "Motivo",
        enableClickToCopy: true,
      },
      {
        accessorKey: "email",
        header: "Usuario",
        enableClickToCopy: true,
      },
    ],
    []
  );

  const handleExportRows = (rows) => {
    const doc = new jsPDF();
    const title = "Historial de Inventario";
    doc.setFontSize(22);
    doc.text(title, 20, 25);

    const tableStartY = 30;
    const tableData = rows.map((row) => {
      return columns.map((column) => {
        if (column.accessorKey === 'cambioFecha') {
          return row.original.cambioFecha === "0001-01-01T00:00:00"
            ? ""
            : format(new Date(row.original.cambioFecha), "yyyy-MM-dd");
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
    doc.save(`Historial de inventario ${formattedDate}.pdf`);
  };

  const table = useCustomMaterialTable({
    columns,
    data: data,
    isLoading,
    isLoadingError,
    isFetching,

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

const stockReport = () => (
  <Container>
    <div className="table-container">
      <h2 className="table-title">Historial de Inventario</h2>
      <hr className="divider" />
      <QueryClientProvider client={queryClient}>
        <MaterialTable />
      </QueryClientProvider>
    </div>
  </Container>
);

export default stockReport;
