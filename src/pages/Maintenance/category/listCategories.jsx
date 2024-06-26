import { useMemo, useState, useEffect } from "react";
import { Box, Button, Tooltip} from '@mui/material';
import { MaterialReactTable} from 'material-react-table';
import useCustomMaterialTable from '../../../utils/materialTableConfig.js'; 
import { getCategories, deleteCategory } from "../../../services/categoryService";
import { Container } from "react-bootstrap";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import autoTable from 'jspdf-autotable';
import { jsPDF } from 'jspdf'; 
import { format } from "date-fns";
import AddCategoryModal from "./actions/addCategoryModal";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import EditCategoryModal from "./actions/editCategoryModal";
import { MdDelete } from "react-icons/md";
import "../../../css/Pagination.css";
import "../../../css/StylesBtn.css";
import { validateAllowedPageAccess } from "../../../utils/validatePageAccess.js";

const MaterialTable = () => {

  const [data, setData] = useState([]);

  const showAlert = (id) => {
    swal({
      title: "Eliminar",
      text: "¿Está seguro de que desea eliminar esta categoría?",
      icon: "warning",
      buttons: ["Cancelar", "Aceptar"],
    }).then((answer) => {
      if (answer) {
        deleteCategory(id);
        swal({
          title: 'Eliminado',
          text: 'La categoría ha sido eliminada',
          icon: 'success',
        }).then(function () { window.location.reload() });

      }
    });
  };

  useEffect(() => {
    validateAllowedPageAccess()

    const fetchData = async () => {
      try {
        const response = await getCategories();
        setData(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const { isError: isLoadingError, isFetching: isFetching, isLoading: isLoading } = getCategories();

  const columns = useMemo(() => [

    {
      accessorKey: 'name',
      header: 'Nombre',
      enableClickToCopy: true,
    },
  ], []);

  const handleExportRows = (rows) => {
    const doc = new jsPDF();

    const title = "Reporte de Categorías";
    doc.setFontSize(22);
    doc.text(title, 20, 25);
    const tableStartY = 30;

    const tableData = rows.map((row) => 
    Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: tableStartY,
    });

    const currentDate = new Date();
    const formattedDate = format(currentDate, "yyyy-MM-dd");
    doc.save(`Reporte Categorías ${formattedDate}.pdf`);
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

          <EditCategoryModal props={row.original} />

        <Tooltip title="Eliminar">

          <Button className="BtnRed" onClick={() => showAlert(row.original.id)}><MdDelete /></Button>

        </Tooltip>
      </Box>
    ),

    renderTopToolbarCustomActions: ({ table }) =>(
    <>
    <AddCategoryModal/>

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

const listCategories = () => (
  <Container>
    <div className="table-container">
      <h2 className="table-title">Categorías</h2>
      <hr className="divider" />
      <QueryClientProvider client={queryClient}>
        <MaterialTable />
      </QueryClientProvider>
    </div>
  </Container>

);

export default listCategories;