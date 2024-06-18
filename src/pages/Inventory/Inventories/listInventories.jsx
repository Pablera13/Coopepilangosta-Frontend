import { useEffect, useState, useMemo } from "react";
import { MaterialReactTable} from 'material-react-table';
import useCustomMaterialTable from '../../../utils/materialTableConfig.js'; 
import { Box, Button, Tooltip} from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Container } from "react-bootstrap";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { jsPDF } from 'jspdf'; 
import autoTable from 'jspdf-autotable';
import { format } from "date-fns";
import { getCoffee } from "../../../services/productService";
import AddInventoryModal from "./actions/addInventoriesModal";
import { validateAllowedPageAccess } from "../../../utils/validatePageAccess";
import "./listInventories.css";
import "../../../css/Pagination.css";
import "../../../css/StylesBtn.css";

const MaterialTable = () => {

  const [data, setData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCoffee();
        setData(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const { isError: isLoadingError, isFetching: isFetching, isLoading: isLoading } = getCoffee();

  const columns = useMemo(() => [
    {
      accessorKey: 'code',
      header: 'Código',
      enableClickToCopy: true,
    },
    {
      accessorKey: 'name',
      header: 'Nombre',
      enableClickToCopy: true,
    },
    {
      accessorKey: 'unit',
      header: 'Unidad',
      enableClickToCopy: true,
    },
    {
      accessorKey: 'stock',
      header: 'Existencias',
      enableClickToCopy: true,
    },
  ], []);

  const handleExportRows = (rows) => {
    const doc = new jsPDF();

    const title = "Reporte de Existencias";
    doc.setFontSize(22);
    doc.text(title, 20, 25);

    const tableStartY = 30;

    const tableData = rows.map((row) =>
      columns.map((column) => row.original[column.accessorKey])
    );ListInventories
    const tableHeaders = columns.map((c) => c.header);
   

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData, 
      startY: tableStartY, 
    });

    const currentDate = new Date();
    const formattedDate = format(currentDate, "yyyy-MM-dd");
    doc.save(`Reporte Existencias ${formattedDate}.pdf`);
  };

  const table = useCustomMaterialTable({
    columns,
    data: data,
    isLoading,
    isLoadingError,
    isFetching,

    renderRowActions: ({row}) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>

          <AddInventoryModal props={row.original} />

      </Box>
    ),

    renderTopToolbarCustomActions: ({ table }) =>(
    <>

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

const ListInventories = () => (
  <Container>
    <div className="table-container">
      <h2 className="table-title">Existencias</h2>
      <hr className="divider" />
      <QueryClientProvider client={queryClient}>
        <MaterialTable />
      </QueryClientProvider>
    </div>
  </Container>

);

export default ListInventories;