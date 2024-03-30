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
import { getProductCostumer } from "../../../services/productCostumerService.js";
import { deleteProductCostumer } from "../../../services/productCostumerService.js";
import AddProductCostumer from "./actions/addProductCostumer.jsx";
import UpdateProductCostumer from "./actions/updateProductCostumer";
import VolumeDiscountModal from "./actions/volumeDiscountModal";
import ExportProductCostumer from "./actions/exportProductCostumer";
import { useParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { getProductById2 } from "../../../services/productService";
import "../../../css/Pagination.css";
import "../../../css/StylesBtn.css";

const MaterialTable = () => {

  const [data, setData] = useState([]);
  const Params = useParams();

  const showAlert = (id) => {
    swal({
      title: "Eliminar",
      text: "¿Está seguro de que desea eliminar esta cotización?",
      icon: "warning",
      buttons: ["Cancelar", "Aceptar"],
    }).then((answer) => {
      if (answer) {
        deleteProductCostumer(id);
        swal({
          title: 'Eliminado',
          text: 'La cotización ha sido eliminada',
          icon: 'success',
        }).then(function () { window.location.reload() });

      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cotizacionesData = await getProductCostumer(Params.costumerid);
        ObtainCotizaciones(cotizacionesData)

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [Params]);

  const ObtainCotizaciones = async (cotizacionesData) => {

      let cotizaciones = [];
      for (const productcostumer of cotizacionesData) {

        const product = await getProductById2(productcostumer.productId);

        const MargenGanancia =
          productcostumer.purchasePrice * (productcostumer.margin / 100);
        const PrecioConMargen = productcostumer.purchasePrice + MargenGanancia;
        const IVA = PrecioConMargen * (product.iva / 100);
        const PrecioFinal = PrecioConMargen + IVA;

        let cotizacion = {
          id: productcostumer.id,
          productId: product.id,
          productName: product.name,
          productUnit: productcostumer.unit,
          productIva: product.iva,
          finalPrice: PrecioFinal.toFixed(0),
          costumerId: Params.costumerid,
          purchasePrice: productcostumer.purchasePrice,
          description: productcostumer.description,
          margin: productcostumer.margin,
        };
        cotizaciones.push(cotizacion);
      }
      setData(cotizaciones);
    
  };
  
  const columns = useMemo(() => [
    {
      accessorKey: 'productName',
      header: 'Producto',
      enableClickToCopy: true,
    },
    {
      accessorKey: 'productUnit',
      header: 'Unidad',
      enableClickToCopy: true,
    },
    {
      accessorKey: 'purchasePrice',
      header: 'Precio inicial	',
      enableClickToCopy: true,
      Cell: ({ row }) => { return (<span>{`₡${row.original.purchasePrice}`}</span>); }
    },
    {
      accessorKey: 'margin',
      header: 'Margen (%)',
      enableClickToCopy: true,
      Cell: ({ row }) => { return (<span>{`${row.original.margin}%`}</span>); }
    },
    {
      accessorKey: 'productIva',
      header: 'IVA',
      enableClickToCopy: true,
      Cell: ({ row }) => { return (<span>{`${row.original.productIva}%`}</span>); }
    },
    {
      accessorKey: 'finalPrice',
      header: 'Precio Final',
      enableClickToCopy: true,
      Cell: ({ row }) => { return (<span>{`₡${row.original.finalPrice}`}</span>); }
    },
    {
      accessorKey: 'description',
      header: 'Descripción',
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
    doc.save(`Reporte Cotizaciones ${formattedDate}.pdf`);
  };

  const table = useCustomMaterialTable({
    columns,
    data: data,
    showAlert,

    renderRowActions: ({row}) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Actualizar cotización">

          <UpdateProductCostumer props={row.original} />

        </Tooltip>
        <Tooltip title="Eliminar">

          <Button className="BtnRed" onClick={() => showAlert(row.original.id)}><MdDelete /></Button>

        </Tooltip>
        <Tooltip title="Descuentos por volumen">

          <VolumeDiscountModal props={row.original.id} />

        </Tooltip>
        <Tooltip title="Exportar cotización">

          <ExportProductCostumer props={row.original.id} />

        </Tooltip>
      </Box>
    ),

    renderTopToolbarCustomActions: ({ table }) =>(
    <>
    <AddProductCostumer/>

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

const listProductCostumer = () => (

  <Container>
    <div className="table-container">
      <h2 className="table-title">Cotizaciones de {useParams().costumername}</h2>
      <hr className="divider" />
      <QueryClientProvider client={queryClient}>
        <MaterialTable />
      </QueryClientProvider>
    </div>
  </Container>

);

export default listProductCostumer;