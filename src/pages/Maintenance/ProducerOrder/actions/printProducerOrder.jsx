import React, {useState} from 'react';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import { Button } from 'react-bootstrap';
import { getProducerOrderById } from '../../../../services/producerorderService';
import { getProducerById } from '../../../../services/producerService';
import { getPurchase } from '../../../../services/purchaseService';
import logoCope from '../../../../assets/logoCoopepilangosta.png'
import {Tooltip} from '@mui/material';

import jsPDF from 'jspdf';
import 'jspdf-autotable';


import { getProductById } from '../../../../services/productService';
import { getProductProducer } from '../../../../services/productProducerService';
import { IoMdPrint } from "react-icons/io";

const printProducerOrder = (props) => {


    const { data: purchases } = useQuery('purchase', getPurchase);

    var [MyPurchases, setMyPurchases] = useState([])
    const [MyOrders, setMyOrders] = useState([]);
    const [producerorderRequest, setProducerorder] = useState(null)
    const [producerRequest, setProducer] = useState(null)
    const [productRequest, setProductRequest] = useState(null)

    async function generatePDF(id) {

        try {

            let producerorder = await getProducerOrderById(id, setProducerorder);
            let producer = await getProducerById(producerorder.producerId, setProducer);

            if (purchases) {
                MyPurchases = purchases.filter(
                    (purchases) => purchases.producerOrderId === id
                );
            };

            async function fetchProductData() {
                const orders = [];
                for (const purchase of MyPurchases) {

                    const product = await getProductById(purchase.productId, setProductRequest);
                    const purchaseprice = await getProductProducer(product.id, producer.id);

                    const IVA = purchaseprice * (product.iva / 100);
                    const FinalPrice = purchaseprice + IVA;
                    let subtotal = 0;
                    subtotal += purchaseprice * purchase.quantity;

                    const order = {
                        ProductCode: product.code,
                        ProductName: product.name,
                        UnitPrice: purchaseprice,
                        IVA: product.iva,
                        SubTotal: subtotal,
                        FinalPrice: FinalPrice,
                        Quantity: purchase.quantity,
                        Unit: product.unit,
                        Total: purchase.purchaseTotal,
                    };
                    orders.push(order);
                }
                return orders;
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
            doc.text(`#${producerorder.id}`, 180, 20);


            doc.setLineWidth(0.2);
            doc.line(10, 33, 200, 33);


            doc.setFontSize(10);
            doc.text("600 metros de Barrio Cementerio, Hojancha, Guanacaste", 10, 42);
            doc.text("+506 2659 9130", 10, 49);
            doc.text("info@coopepilangosta.com", 10, 56);
            doc.text("https://coopepilangosta.com/", 10, 63);


            doc.setFontSize(14);
            doc.text("Productor", 10, 80);

            doc.setFontSize(14);
            doc.text("Factura", 100, 80);


            doc.setLineWidth(0.2);
            doc.line(10, 85, 200, 85);


            doc.setFontSize(10);
            doc.text(`${producer.name} ${producer.lastname1} ${producer.lastname2}`, 10, 95);
            doc.text(`Cédula: ${producer.cedula}`, 10, 102);
            doc.text(`Dirección: ${producer.address}, ${producer.district}, ${producer.canton}`, 10, 109);
            doc.text(`Teléfono: ${producer.phoneNumber}`, 10, 116);
            doc.text(`Email: ${producer.email}`, 10, 123);
            doc.text(`Cuenta IBAN: ${producer.bankAccount}`, 10, 130);

 
            doc.text("Fecha de factura:", 100, 123);
            doc.text(format(new Date(producerorder.confirmedDate), 'yyyy-MM-dd'), 150, 123);

            doc.text("Fecha de pago:", 100, 130);
            doc.text(
                producerorder.paidDate === "0001-01-01T00:00:00" ? "Sin pagar" :
                    format(new Date(producerorder.paidDate), 'yyyy-MM-dd'), 150, 130
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

            doc.setFontSize(14);
            doc.text("Detalle:", 10, doc.autoTable.previous.finalY + 10);
            doc.setFontSize(10);
            doc.text(producerorder.detail, 20, doc.autoTable.previous.finalY + 25);

 
            doc.setLineWidth(0.2);
            doc.line(10, doc.autoTable.previous.finalY + 12, 200, doc.autoTable.previous.finalY + 12);



      
            const currentDate = new Date();
            const formattedDate = format(currentDate, 'yyyy-MM-dd');
            const fileName = `Factura_${producerorder.id}_${producer.cedula}_${formattedDate}.pdf`;

            doc.save(fileName);
            doc.output('dataurlnewwindow', { filename: fileName });
            setMyOrders([]);

        } catch (error) {
            console.error("Error al obtener datos:", error);
        }

    }


    return (

        <Tooltip title="Imprimir">
        <Button
            className='BtnPrint'
            onClick={() => generatePDF(props.props)}
            size='sm'
        >
            <IoMdPrint />
        </Button>
</Tooltip>

    );
};

export default printProducerOrder;