import { React, useState, useEffect } from 'react'
import { format } from 'date-fns';
import { Button } from 'react-bootstrap';
import { getCostumerById } from '../../../../services/costumerService';
import logoCope from '../../../../assets/logoCoopepilangosta.png'
import { getCostumerOrderById } from '../../../../services/costumerorderService';
import { IoMdPrint } from "react-icons/io";
import { getProducerOrderSales } from '../../../../services/saleService';
import jsPDF from 'jspdf';
import { getProductById } from '../../../../services/productService';
import { Tooltip } from '@mui/material';

const printCustomerOrder = (props) => {

    useEffect(() => {
        async function settingSales() {
            getProducerOrderSales(props.props, setMySales)
        }
        settingSales();
    }, []);

    const [MySales, setMySales] = useState([])
    const [MyOrders, setMyOrders] = useState([]);
    const [customerorderRequest, setCustomerorder] = useState(null)
    const [customerRequest, setCustomer] = useState(null)
    const [productRequest, setProductRequest] = useState(null)

    async function generatePDF(id) {

        try {

            let customerorder = await getCostumerOrderById(id, setCustomerorder);
            let customer = await getCostumerById(customerorder.costumerId, setCustomer);

            async function fetchProductData() {
                const sales = [];

                for (const sale of MySales) {

                    const product = await getProductById(sale.productId, setProductRequest);
                    const IVA = sale.unitPrice * (product.iva / 100);
                    const FinalPrice = sale.unitPrice + IVA;
                    let subtotal = 0;
                    subtotal += sale.unitPrice * sale.quantity;

                    const Order = {
                        ProductCode: product.code,
                        ProductName: product.name,
                        UnitPrice: sale.unitPrice,
                        IVA: product.iva,
                        SubTotal: subtotal,
                        FinalPrice: FinalPrice,
                        Quantity: sale.quantity,
                        Unit: sale.unit,
                        Total: sale.purchaseTotal,
                    };
                    sales.push(Order);
                }
                return sales;
            }

            const MyOrders = await fetchProductData();

            const doc = new jsPDF();

            const imgWidth = 65;
            const imgHeight = 20;
            const x = 10;
            const y = 10;
            doc.addImage(logoCope, 'JPEG', x, y, imgWidth, imgHeight);

            doc.setFontSize(16);
            doc.setFont("Helvetica");

            doc.setFontSize(14);
            doc.text(`#${customerorder.id}`, 180, 20);

            doc.setLineWidth(0.2);
            doc.line(10, 33, 200, 33);

            doc.setFontSize(10);
            doc.text("600 metros de Barrio Cementerio, Hojancha, Guanacaste", 10, 42);
            doc.text("+506 2659 9130", 10, 49);
            doc.text("info@coopepilangosta.com", 10, 56);
            doc.text("https://coopepilangosta.com/", 10, 63);

            doc.setFontSize(14);
            doc.text("Cliente", 10, 80);

            doc.setFontSize(14);
            doc.text("Factura proforma", 100, 80);

            doc.setLineWidth(0.2);
            doc.line(10, 85, 200, 85);

            doc.setFontSize(10);
            doc.text(`${customer.name}`, 10, 95);
            doc.text(`${customer.address}, ${customer.district}, ${customer.canton}`, 10, 102);
            doc.text(`Cédula Juridica: ${customer.cedulaJuridica}`, 10, 109);
            doc.text(`Email: ${customer.email}`, 10, 116);
            doc.text(`Teléfono: ${customer.phoneNumber}`, 10, 123);
            doc.text(`Código Postal: ${customer.postalCode}`, 10, 130);
            doc.text(`Cuenta IBAN: ${customer.bankAccount}`, 10, 137);

            doc.text("Fecha de factura:", 100, 116);
            doc.text(format(new Date(customerorder.confirmedDate), 'yyyy-MM-dd'), 150, 116);
            doc.text("Fecha de pago:", 100, 123);
            doc.text(
                customerorder.paidDate === "0001-01-01T00:00:00" ? "Sin pagar" : format(new Date(customerorder.paidDate), 'yyyy-MM-dd'),
                150, 123
            );

            doc.setLineWidth(0.2);
            doc.line(10, 145, 200, 145);

            let subtotal = 0;
            const tableData = MyOrders.map((order, index) => [
                order.ProductCode,
                order.ProductName,
                order.Unit,
                order.Quantity,
                `${order.UnitPrice == 0 ? "" : order.UnitPrice}`,
                `${order.SubTotal == 0 ? "" : order.SubTotal}`,
                `${order.IVA}%`,
                `${order.Total == 0 ? "" : order.Total.toFixed(2)}`,
                subtotal += order.SubTotal
            ]);

            const totalPedido = MyOrders.reduce((total, order) => total + order.Total, 0);
            tableData.push(["", "", "", "", "", "", "", ""]);

            tableData.push(["", "", "", "", "", "", "SubTotal", `${subtotal.toFixed(2)}`]);
            tableData.push(["", "", "", "", "", "", "Total", `${totalPedido.toFixed(2)}`]);

            const startY = 150;
            const headText = ["Código", "Producto", "Unidad", "Cantidad", "Precio", "SubTotal", "IVA", "Total"];

            doc.autoTable({
                startY: startY,
                head: [headText],
                body: tableData,
                margin: { top: 10 },
                styles: {
                    fontSize: 10,
                    cellPadding: 2,
                    lineWidth: 0.5,
                    textColor: [0, 0, 0],
                },
                headStyles: {
                    fillColor: [255, 255, 255],
                    textColor: [0, 0, 0],
                },
                columnStyles: {
                    0: { cellWidth: 25 },
                    4: { halign: 'right' },
                    5: { halign: 'right' },
                },
            });

            // Texto detalle
            doc.setFontSize(14);
            doc.text("Detalle:", 10, doc.autoTable.previous.finalY + 10);
            doc.setFontSize(10);
            doc.text(customerorder.detail, 20, doc.autoTable.previous.finalY + 25);
            doc.text(customerorder.address, 20, doc.autoTable.previous.finalY + 32); // Ajusta la posición Y y el margen


            //ultima linea
            doc.setLineWidth(0.2);
            doc.line(10, doc.autoTable.previous.finalY + 12, 200, doc.autoTable.previous.finalY + 12); // Línea horizontal



            //Impresion
            const currentDate = new Date();
            const formattedDate = format(currentDate, 'yyyy-MM-dd');
            const fileName = `Factura_${customerorder.id}_${customer.name}_${formattedDate}.pdf`;

            doc.save(fileName);
            doc.output('dataurlnewwindow', { filename: fileName });
            setMyOrders([]);


        } catch (error) {
            console.error("Error al obtener datos:", error);
        }

    }
    return (


        <Tooltip title="Imprimir">

            <Button className='BtnPrint'
                onClick={() => generatePDF(props.props)}
                size='sm'
            >
                <IoMdPrint />

            </Button>
        </Tooltip>

    );
};

export default printCustomerOrder;