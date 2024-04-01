import { useState, useEffect, useMemo } from "react";
import { Box, Button, Tooltip} from '@mui/material';
import { MaterialReactTable} from 'material-react-table';
import useCustomMaterialTable from '../../../utils/materialTableConfig.js'; 
import autoTable from 'jspdf-autotable';
import { jsPDF } from 'jspdf'; 
import { format } from "date-fns";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { getWarehouse } from "../../../services/warehouseService";
import { deleteWarehouse } from "../../../services/warehouseService";
import swal from "sweetalert";
import { Container } from "react-bootstrap";
import AddWarehouseModal from "./actions/addWarehouseModal";
import EditWarehouseModal from "./actions/editWarehouseModal";
import { MdDelete } from "react-icons/md";
import "../../../css/Pagination.css";
import "../../../css/StylesBtn.css";
import { validateAllowedPageAccess } from "../../../utils/validatePageAccess";

const MaterialTable = () => {

  const [data, setData] = useState([]);

  const showAlert = (id) => {
    swal({
      title: "Eliminar",
      text: "¿Está seguro de que desea eliminar esta bodega?",
      icon: "warning",
      buttons: ["Cancelar", "Aceptar"],
    }).then((answer) => {
      if (answer) {
        deleteWarehouse(id);
        swal({
          title: 'Eliminado',
          text: 'La bodega ha sido eliminada',
          icon: 'success',
        }).then(function () { window.location.reload() });

      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getWarehouse();
        setData(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const { isError: isLoadingError, isFetching: isFetching, isLoading: isLoading } = getWarehouse();

  const columns = useMemo(() => [
    {
      accessorKey: 'code',
      header: 'Código',
      enableClickToCopy: true,
    },
    {
      accessorKey: 'description',
      header: 'Descripción',
      enableClickToCopy: true,
    },
    {
      accessorKey: 'address',
      header: 'Dirección',
      enableClickToCopy: true,
    },
    {
      accessorKey: 'state',
      header: 'Estado',
      enableClickToCopy: true,
      Cell: ({ row }) => { return (row.original.state == true ? <span>{`Activo`}</span> : <span>{`Inactivo`}</span>);
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
    doc.save(`Reporte Productos ${formattedDate}.pdf`);
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
        <Tooltip title="Editar">

          <EditWarehouseModal props={row.original} />

        </Tooltip>
        <Tooltip title="Eliminar">

          <Button className="BtnRed" onClick={() => showAlert(row.original.id)}><MdDelete /></Button>

        </Tooltip>
      </Box>
    ),

    renderTopToolbarCustomActions: ({ table }) =>(
    <>
    <AddWarehouseModal/>

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

const listWarehouse = () => (
  <Container>
    <div className="table-container">
      <h2 className="table-title">Bodegas</h2>
      <hr className="divider" />
      <QueryClientProvider client={queryClient}>
        <MaterialTable />
      </QueryClientProvider>
    </div>
  </Container>

);

export default listWarehouse;