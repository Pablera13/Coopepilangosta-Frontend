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
import { deleteProducerOrder } from "../../../services/producerorderService";
import { getProducerOrder } from "../../../services/producerorderService";
import PrintProducerOrder from "./actions/printProducerOrder.jsx";
import AddProducerOrderModal from "./actions/addProducerOrderModal.jsx";
import { MdDelete } from "react-icons/md";
import CheckEntryModal from '../../Inventory/Entries/actions/checkEntryModal.jsx'
import UpdateProducerOrderModal from "./actions/updateProducerOrderModal.jsx";
import "../../../css/Pagination.css";
import "../../../css/StylesBtn.css";
import { validateAllowedPageAccess } from "../../../utils/validatePageAccess.js";

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
        deleteProducerOrder(id);
        swal({
          title: 'Eliminado',
          text: 'El pedido ha sido eliminado',
          icon: 'success',
        }).then(function () { window.location.reload() });

      }
    });
  };

  useEffect(() => {
    validateAllowedPageAccess()
    const fetchData = async () => {
      try {
        const response = await getProducerOrder();
        setData(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const { isError: isLoadingError, isFetching: isFetching, isLoading: isLoading } = getProducerOrder();

  const columns = useMemo(() => [
    {
      accessorKey: 'confirmedDate',
      header: 'Fecha del pedido	',
      enableClickToCopy: true,
      Cell: ({ row }) => { 
        return (<span>{row.original.confirmedDate === "0001-01-01T00:00:00" ? "" : format(new Date(row.original.confirmedDate), "yyyy-MM-dd")}</span>);
      }
    },
    {
      accessorKey: 'total',
      header: 'Total',
      enableClickToCopy: true,
      Cell: ({ row }) => { 
        return (<span>₡{row.original.total}</span>);
      }
    },
    {
      accessorKey: 'paidDate',
      header: 'Estado del pago	',
      enableClickToCopy: true,
      Cell: ({ row }) => { 
          const paidDate = row.original.paidDate === "0001-01-01T00:00:00" ? "Sin pagar" : format(new Date(row.original.paidDate), "yyyy-MM-dd");
          return (<span>{paidDate}</span>);
      }
    },
    {
      accessorKey: 'deliveredDate',
      header: 'Estado de entrega',
      enableClickToCopy: true,
      Cell: ({ row }) => { 
          const deliveredDate = row.original.deliveredDate === "0001-01-01T00:00:00" ? "No recibido" : format(new Date(row.original.deliveredDate), "yyyy-MM-dd");
          return (<span>{deliveredDate}</span>);
      }
    },
  ], []);

  const handleExportRows = (rows) => {
    const doc = new jsPDF();
    const title = "Reporte de Pedidos";
    doc.setFontSize(22);
    doc.text(title, 20, 25);

    const tableStartY = 30;

const tableData = rows.map((row) => {
  return columns.map((column) => {
    if (column.accessorKey === 'confirmedDate') {
      return row.original.confirmedDate === "0001-01-01T00:00:00" ? "" : format(new Date(row.original.confirmedDate), "yyyy-MM-dd");
    }
    if (column.accessorKey === 'paidDate') {
      const paidDate = row.original.paidDate === "0001-01-01T00:00:00" ? "Sin pagar" : format(new Date(row.original.paidDate), "yyyy-MM-dd");
      return paidDate;
    }
    if (column.accessorKey === 'deliveredDate') {
      const deliveredDate = row.original.deliveredDate === "0001-01-01T00:00:00" ? "No recibido" : format(new Date(row.original.deliveredDate), "yyyy-MM-dd");
      return deliveredDate;
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
    doc.save(`Reporte Pedidos ${formattedDate}.pdf`);
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

          <UpdateProducerOrderModal props={row.original} />

          <CheckEntryModal props={row.original} />

          <PrintProducerOrder props={row.original.id} />

        <Tooltip title="Eliminar">

          <Button className="BtnRed" onClick={() => showAlert(row.original.id)}><MdDelete /></Button>

        </Tooltip>
      </Box>
    ),

    renderTopToolbarCustomActions: ({ table }) =>(
    <>
    <AddProducerOrderModal/>

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

const listProducerOrder
= () => (
  <Container>
    <div className="table-container">
      <h2 className="table-title">Pedidos a Productores</h2>
      <hr className="divider" />
      <QueryClientProvider client={queryClient}>
        <MaterialTable />
      </QueryClientProvider>
    </div>
  </Container>

);

export default listProducerOrder
;