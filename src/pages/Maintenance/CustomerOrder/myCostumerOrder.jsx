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
import { useNavigate } from "react-router-dom";
import { getCostumerOrderByCostumer } from "../../../services/costumerorderService";
import PrintCustomerOrder from "../../Maintenance/CustomerOrder/actions/printCustomerOrder.jsx";
import "../../../css/StylesBtn.css";
import { IoMdSearch } from "react-icons/io";

const MaterialTable = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCostumerOrderByCostumer();
        setData(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const { isError: isLoadingError, isFetching: isFetching, isLoading: isLoading } = getCostumerOrderByCostumer();

  const columns = useMemo(() => [
    {
      accessorKey: 'id',
      header: '#',
      enableClickToCopy: true,
    },
    {
      accessorKey: 'confirmedDate',
      header: 'Recibido',
      enableClickToCopy: true,
      Cell: ({ row }) => { 
        return (<span>{row.original.confirmedDate === "0001-01-01T00:00:00" ? "" : format(new Date(row.original.confirmedDate), "yyyy-MM-dd")}</span>);
      }
    },
    {
      accessorKey: 'paidDate',
      header: 'Pago',
      enableClickToCopy: true,
      Cell: ({ row }) => { 
        return (
          <span>
            {row.original.paidDate === "0001-01-01T00:00:00" ? "Sin pagar" : format(new Date(row.original.paidDate), "yyyy-MM-dd")}
          </span>
        );
      }
    },
    {
      accessorKey: 'deliveredDate',
      header: 'Estado Entrega',
      enableClickToCopy: true,
      Cell: ({ row }) => { 
        return (
          <span>
            {row.original.deliveredDate === "0001-01-01T00:00:00" ? "No entregado" : format(new Date(row.original.deliveredDate), "yyyy-MM-dd")}
          </span>
        );
      }
    },
    {
      accessorKey: 'total',
      header: 'Total',
      enableClickToCopy: true,
      Cell: ({ row }) => { 
        return (
          <span>
            {row.original.total === 0 ? "Por cotizar" : `₡${row.original.total.toFixed(2)}`}
          </span>
        );
      }
    },
    {
      accessorKey: 'stage',
      header: 'Estado',
      enableClickToCopy: true,
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
    doc.save(`Reporte Pedidos Recibidos ${formattedDate}.pdf`);
  };

  const table = useCustomMaterialTable({
    columns,
    data: data,
    isLoading,
    isLoadingError,
    isFetching,

    renderRowActions: ({row}) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Editar">

          <UpdateCustomerOrderModal props={row.original} />

        </Tooltip>
        <Tooltip title="Eliminar">

          <Button className="BtnRed" onClick={() => showAlert(row.original.id)}><MdDelete /></Button>

        </Tooltip>
        <Tooltip title="Editar">

          <PrintCustomerOrder props={row.original.id} />

        </Tooltip>
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

const myCostumerOrder = () => (
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

export default myCostumerOrder;