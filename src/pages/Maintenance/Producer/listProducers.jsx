import { useState, useEffect, useMemo } from "react";
import { Box, Button, Tooltip} from '@mui/material';
import { MaterialReactTable} from 'material-react-table';
import useCustomMaterialTable from '../../../utils/materialTableConfig.js'; 
import autoTable from 'jspdf-autotable';
import { jsPDF } from 'jspdf'; 
import { format } from "date-fns";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { getProducers } from "../../../services/producerService";
import { deleteProducerService } from "../../../services/producerService";
import { Container } from "react-bootstrap";
import AddProducerModal from "./actions/addProducerModal.jsx";
import EditProducerModal from "./actions/editProducerModal";
import { MdDelete } from "react-icons/md";
import "../../../css/Pagination.css";
import "../../../css/StylesBtn.css";
import { validateAllowedPageAccess } from "../../../utils/validatePageAccess.js";

const MaterialTable = () => {

  const [data, setData] = useState([]);

  const showAlert = (id) => {
    swal({
      title: "Eliminar",
      text: "¿Está seguro de que desea eliminar este productor?",
      icon: "warning",
      buttons: ["Cancelar", "Aceptar"],
    }).then((answer) => {
      if (answer) {
        deleteProducerService(id);
        swal({
          title: 'Eliminado',
          text: 'El productor ha sido eliminado',
          icon: 'success',
        }).then(function () { window.location.reload() });

      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProducers();
        setData(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const { isError: isLoadingError, isFetching: isFetching, isLoading: isLoading } = getProducers();

  const columns = useMemo(() => [
    {
      accessorKey: 'cedula',
      header: 'Cédula',
      enableClickToCopy: true,
    },
    {
      accessorKey: 'name',
      header: 'Nombre',
      enableClickToCopy: true,
    },
    {
      accessorKey: 'lastname1',
      header: 'Primer Apellido',
      enableClickToCopy: true,
    },
    {
      accessorKey: 'lastname2',
      header: 'Segundo Apellido',
      enableClickToCopy: true,
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Número de teléfono',
      enableClickToCopy: true,
    },
    {
      accessorKey: 'email',
      header: 'Correo',
      enableClickToCopy: true,
    },
  ], []);

  const handleExportRows = (rows) => {
    const doc = new jsPDF();
  // Título del PDF
  const title = "Reporte de Productores";
  doc.setFontSize(22);
  doc.text(title, 20, 25);

  // Espacio para el título
  const tableStartY = 30;
    
    // Preparar los datos de la tabla
  
    const tableData = rows.map((row) =>
      columns.map((column) => row.original[column.accessorKey])
    );

    const tableHeaders = columns.map((c) => c.header);


    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: tableStartY, 
    });

    const currentDate = new Date();
    const formattedDate = format(currentDate, "yyyy-MM-dd");
    doc.save(`Reporte Productores ${formattedDate}.pdf`);
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

          <EditProducerModal props={row.original} />

        </Tooltip>
        <Tooltip title="Eliminar">

          <Button className="BtnRed" onClick={() => showAlert(row.original.id)}><MdDelete /></Button>

        </Tooltip>
      </Box>
    ),

    renderTopToolbarCustomActions: ({ table }) =>(
    <>
    <AddProducerModal/>

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

const listProducers = () => (
  <Container>
    <div className="table-container">
      <h2 className="table-title">Productores</h2>
      <hr className="divider" />
      <QueryClientProvider client={queryClient}>
        <MaterialTable />
      </QueryClientProvider>
    </div>
  </Container>

);

export default listProducers;