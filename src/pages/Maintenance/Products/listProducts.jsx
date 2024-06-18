import { useMemo, useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, Button, Tooltip } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Container } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import useCustomMaterialTable from "../../../utils/materialTableConfig.js";
import "../../../css/StylesBtn.css";
import { deleteProduct } from "../../../services/productService";
import EditProductModal from "./operations/editProductModal.jsx";
import AddProductModal from "./operations/addProductModal.jsx";
import { getProducts } from "../../../services/productService";
import swal from "sweetalert";
import { validateAllowedPageAccess } from "../../../utils/validatePageAccess.js";

const MaterialTable = () => {
  const [data, setData] = useState([]);

  const showAlert = (id) => {
    swal({
      title: "Eliminar",
      text: "¿Está seguro de que desea eliminar este producto?",
      icon: "warning",
      buttons: ["Cancelar", "Aceptar"],
    }).then((answer) => {
      if (answer) {
        deleteProduct(id);
        swal({
          title: "Eliminado",
          text: "El producto ha sido eliminado",
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
        const response = await getProducts();
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
  } = getProducts();

  const columns = useMemo(
    () => [
      {
        accessorKey: "code",
        header: "Código",
        enableClickToCopy: true,
      },
      {
        accessorKey: "name",
        header: "Nombre",
        enableClickToCopy: true,
      },
      {
        accessorKey: "unit",
        header: "Unidad",
        enableClickToCopy: true,
      },
      {
        accessorKey: "iva",
        header: "IVA (%)",
        enableClickToCopy: true,
        Cell: ({ row }) => {
          return <span>{`${row.original.iva}%`}</span>;
        },
      },
      {
        accessorKey: "margin",
        header: "Margen de Ganancia",
        enableClickToCopy: true,
        Cell: ({ row }) => {
          return <span>{`${row.original.margin}%`}</span>;
        },
      },
      {
        accessorKey: "state",
        header: "Estado",
        enableClickToCopy: true,
        Cell: ({ row }) => {
          return row.original.state == true ? (
            <span>{`Activo`}</span>
          ) : (
            <span>{`De baja`}</span>
          );
        },
      },
    ],
    []
  );

  const handleExportRows = (rows) => {
    const doc = new jsPDF();
    const title = "Reporte de Productos";
    doc.setFontSize(22);
    doc.text(title, 20, 25);

    const tableStartY = 30;

    const tableData = rows.map((row) => {
      return columns.map((column) => {
        if (column.accessorKey === "state") {
          return row.original[column.accessorKey] ? "Activo" : "De baja";
        }
        if (column.accessorKey === "iva" || column.accessorKey === "margin") {
          return `${row.original[column.accessorKey]}%`;
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

    doc.save(`Reporte_Productos_${formattedDate}.pdf`);
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
        <EditProductModal props={row.original} />

        <Tooltip title="Eliminar">
          <Button className="BtnRed" onClick={() => showAlert(row.original.id)}>
            <MdDelete />
          </Button>
        </Tooltip>
      </Box>
    ),

    renderTopToolbarCustomActions: ({ table }) => (
      <>
        <AddProductModal />

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

const listProducts = () => (
  <Container>
    <div className="table-container">
      <h2 className="table-title">Productos</h2>
      <hr className="divider" />
      <QueryClientProvider client={queryClient}>
        <MaterialTable />
      </QueryClientProvider>
    </div>
  </Container>
);

export default listProducts;
