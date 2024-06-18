import { useState, useEffect, useMemo } from "react";
import { Box, Button, Tooltip } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import useCustomMaterialTable from '../../../utils/materialTableConfig.js';
import autoTable from 'jspdf-autotable';
import { jsPDF } from 'jspdf';
import { format } from "date-fns";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getCostumers } from "../../../services/costumerService";
import DetailsCostumer from "./detailsCostumer";
import VerifyCostumer from "../costumers/actions/verifyCostumer";
import "../../../css/Pagination.css";
import "../../../css/StylesBtn.css";
import { BsBox2 } from "react-icons/bs";
import { validateAllowedPageAccess } from "../../../utils/validatePageAccess.js";


const MaterialTable = () => {

  const [data, setData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    validateAllowedPageAccess()
    const fetchData = async () => {
      try {
        const response = await getCostumers();
        setData(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const { isError: isLoadingError, isFetching: isFetching, isLoading: isLoading } = getCostumers();

  const columns = useMemo(() => [
    {
      accessorKey: 'cedulaJuridica',
      header: 'Cédula',
      enableClickToCopy: true,
    },
    {
      accessorKey: 'name',
      header: 'Nombre',
      enableClickToCopy: true,
    },
    {
      accessorKey: 'province',
      header: 'Provincia',
      enableClickToCopy: true,
    },
    {
      accessorKey: 'canton',
      header: 'Cantón',
      enableClickToCopy: true,
    },
    {
      accessorKey: 'district',
      header: 'Distrito',
      enableClickToCopy: true,
    },
    {
      accessorKey: 'verified',
      header: 'Verificado',
      enableClickToCopy: true,
      Cell: ({ row }) => {
        return (row.original.verified == true ? <span>{`Verificado`}</span> : <span>{`No verificado`}</span>);
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
    doc.save(`Reporte Clientes ${formattedDate}.pdf`);
  };

  const table = useCustomMaterialTable({
    columns,
    data: data,
    isLoading,
    isLoadingError,
    isFetching,

    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>

          <DetailsCostumer props={row.original} />


          <VerifyCostumer props={row.original} />


        <Tooltip title="Cotizaciones">
          <Button className="BtnBrown" onClick={() => navigate(`/listProductCostumer/${row.original.name}/${row.original.id}`)}>
            <BsBox2 />
          </Button>
        </Tooltip>
      </Box>
    ),

    renderTopToolbarCustomActions: ({ table }) => (
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

const listCostumers = () => (
  <Container>
    <div className="table-container">
      <h2 className="table-title">Clientes</h2>
      <hr className="divider" />
      <QueryClientProvider client={queryClient}>
        <MaterialTable />
      </QueryClientProvider>
    </div>
  </Container>

);

export default listCostumers;