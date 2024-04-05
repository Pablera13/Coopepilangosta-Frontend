import {React, useState, useEffect, useRef} from 'react'
import { useQuery } from 'react-query';
import { NavLink, Navigate, useNavigate, useParams  } from 'react-router-dom';
import { format } from 'date-fns';
import { Table, Container, Col, Row, Button } from 'react-bootstrap';
import Select from 'react-select';
import { getProducts } from '../../services/productService';
import {getProductSales} from '../../services/saleService';

import {ObtainDailyData} from '../../services/reportServices/dailyReportService';

import DailyQuantityChart from './productTemp/DailyQuantityChart'; 
import DailyPurchaseChart from './productTemp/DailyPurchaseChart'; 

import {ObtainWeeklyData} from '../../services/reportServices/weeklyReportService';

import WeeklyQuantityChart from './productTemp/WeeklyQuantityChart'; 
import WeeklyPurchaseChart from './productTemp/WeeklyPurchaseChart';

import {ObtainMonthlyData} from '../../services/reportServices/monthlyReportService';

import MonthlyQuantityChart from './productTemp/MonthlyQuantityChart'; 
import MonthlyPurchaseChart from './productTemp/MonthlyPurchaseChart';

import {ObtainYearlyData} from '../../services/reportServices/yearlyReportService';

import YearlyQuantityChart from './productTemp/YearlyQuantityChart'; 
import YearlyPurchaseChart from './productTemp/YearlyPurchaseChart';

import {DownloadTableExcel} from 'react-export-table-to-excel';


import "../../css/Pagination.css";
import "../../css/StylesBtn.css";
import { validateAllowedPageAccess } from '../../utils/validatePageAccess';

const buttonStyle = {
  borderRadius: '5px',
  backgroundColor: '#e0e0e0',
  color: '#333',
  border: '1px solid #e0e0e0',
  padding: '8px 12px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  minWidth: '100px',
  fontWeight: 'bold',
  hover: {
    backgroundColor: '#c0c0c0', 
  },
};

const productReport = () => {

  useEffect(() => {
    validateAllowedPageAccess()
  
  }, [])

  const params = useParams();

  const [ProductOptions, setProductOptions] = useState([]);
  const [ProductSales, setProductSales] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState();
  const [selectedProductName, setSelectedProductName] = useState();

  const [selectedTemp, setSelectedTemp] = useState();
  const [selectedTempName, setSelectedTempName] = useState();
  const [selectedTempUnit, setSelectedTempUnit] = useState();

  const [PurchaseData, setPurchaseData] = useState([]);
  const [QuantityData, setQuantityData] = useState([]);

  const [DataArray, setDataArray] = useState([]);
  const ChartTable = useRef(null);

  const [suffixLast, setSuffixLast] = useState([]);
  const [suffixThis, setSuffixThis] = useState([]);

  const [reportName, setReportName] = useState([]);

  const TempOptions = [

    { value: 'Diario', label: 'Diario' },
    { value: 'Semanal', label: 'Semanal' },
    { value: 'Mensual', label: 'Mensual' },
    { value: 'Anual', label: 'Anual' },

  ];

  const { data:Products, isLoading, isError } = useQuery('product', getProducts);

  useEffect(() => {

    async function MeCagoEnLasRestricciones () {

        let ProductSales = await getProductSales(params.productId);
        setProductSales(ProductSales)       
    }

    MeCagoEnLasRestricciones();

}, [params]);

  useEffect(() => {
    if (Products != null) {

        let ProductOptions=[]
        for(const product of Products){
        const option = { value: product.id , label: product.name }
        ProductOptions.push(option)
        }
        const option = { value: 0 , label: "Todos los productos" }
        ProductOptions.push(option)
        setProductOptions(ProductOptions)
    }
}, [Products]);

    const navigate = useNavigate()

    useEffect(() => {
      if (selectedProduct != null) {

          navigate(`/productReport/${selectedProduct.value}`)
          setSelectedProductName(selectedProduct.label)
          console.log(ProductOptions)
      }
  }, [selectedProduct]);

  const generateReport =async () =>{

    let PurchaseQuantityArray=[]
    let QuantityToSet=[]
    let PurchaseToSet=[]
    const beginDate = new Date()

    if(selectedTemp){

      if(selectedTemp.value == 'Diario'){
        
        PurchaseQuantityArray = await ObtainDailyData(ProductSales)

        for (var i = 0; i <= 6; i++) {
          QuantityToSet.push(PurchaseQuantityArray[i]) }

        for (var i = 7; i <= 13; i++) {
          PurchaseToSet.push(PurchaseQuantityArray[i])}

        setQuantityData(QuantityToSet)
        setPurchaseData(PurchaseToSet)

        setSuffixThis("esta semana")
        setSuffixLast("semana pasada")
        setSelectedTempUnit("Día")

        // lastWeekStart.setDate(lastSunday.getDate() - 7);

        const xd = new Date();
        xd.setDate(beginDate.getDate() - 7);
        const formattedBegin = format(new Date(beginDate), 'dd/MM/yyyy')
        const formattedEnd = format(new Date(xd), 'dd/MM/yyyy')

        setReportName("Reporte diario de " + selectedProductName + " " + formattedEnd + " - " + formattedBegin )

      }

      if(selectedTemp.value == 'Semanal'){ 
        
        PurchaseQuantityArray = await ObtainWeeklyData(ProductSales)
        
        for (var i = 0; i <= 3; i++) {
          QuantityToSet.push(PurchaseQuantityArray[i]) }

        for (var i = 4; i <= 7; i++) {
          PurchaseToSet.push(PurchaseQuantityArray[i])}

          setQuantityData(QuantityToSet)
          setPurchaseData(PurchaseToSet)
  
          setSuffixThis("este mes")
          setSuffixLast("mes pasado")
          setSelectedTempUnit("Semana")

        const endDate = new Date(beginDate.getFullYear(), beginDate.getMonth()-1, 1);
        const formattedBegin = format(new Date(beginDate), 'dd/MM/yyyy')
        const formattedEnd = format(new Date(endDate), 'dd/MM/yyyy')

        setReportName("Reporte semanal de " + selectedProductName + " " + formattedEnd + " - " + formattedBegin )
      }

      if(selectedTemp.value == 'Mensual'){ 
        
        PurchaseQuantityArray = await ObtainMonthlyData(ProductSales)
        
        for (var i = 0; i <= 11; i++) {
          QuantityToSet.push(PurchaseQuantityArray[i]) }

        for (var i = 12; i <= 23; i++) {
          PurchaseToSet.push(PurchaseQuantityArray[i])}

          setQuantityData(QuantityToSet)
          setPurchaseData(PurchaseToSet)
  
          setSuffixThis("este año")
          setSuffixLast("año pasado")
          setSelectedTempUnit("Mes")

        const endDate = new Date(beginDate.getFullYear()-1, 1);
        const formattedBegin = format(new Date(beginDate), 'dd/MM/yyyy')
        const formattedEnd = format(new Date(endDate), 'dd/MM/yyyy')

        setReportName("Reporte mensual de " + selectedProductName + " " + formattedEnd + " - " + formattedBegin )
      }

      if(selectedTemp.value == 'Anual'){ 
        
        PurchaseQuantityArray = await ObtainYearlyData(ProductSales) 

        for (var i = 0; i <= (PurchaseQuantityArray.length/2)-1; i++) {
        QuantityToSet.push(PurchaseQuantityArray[i])}

        for (var i = PurchaseQuantityArray.length/2; i <= (PurchaseQuantityArray.length)-1; i++) {
        PurchaseToSet.push(PurchaseQuantityArray[i])}

        setQuantityData(QuantityToSet)
        setPurchaseData(PurchaseToSet)
        setSelectedTempUnit("Año")

        const formattedBegin = format(new Date(beginDate), 'dd/MM/yyyy')
        setReportName("Reporte histórico de " + selectedProductName + " " + formattedBegin)

      }

      if(PurchaseQuantityArray){

        const concatingObjets = {};
        for (const item of PurchaseQuantityArray) {
        const Coincidence = item[0];

        if (!concatingObjets[Coincidence]) {
          concatingObjets[Coincidence] = item.slice(1);
        } else {
          concatingObjets[Coincidence] = concatingObjets[Coincidence].concat(item.slice(1));
        }}

        const resultado = Object.entries(concatingObjets).map(([Coincidence, valores]) => [Coincidence, ...valores]);

        setDataArray(resultado)
        console.log("DataArray = " + JSON.stringify(resultado))
        setSelectedTempName(selectedTemp.value)      
      }

    }}
    
  if(isLoading)
  <div className="Loading">
        <ul>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div> 
      ;

  
  if(isError)
  return <div>Error</div>
  
  let SumUnitThis=0
  let SumUnitLast=0
  let Growth1=0
  let GrowthPercent1=0
  let SumTotalThis=0
  let SumTotalLast=0
  let Growth2=0
  let GrowthPercent2=0

  let GrowthT1=0
  let GrowthT2=0
  let GrowthP1=0
  let GrowthP2=0
  let nextUnit =0
  let nextTotal =0

    return (

    <Container>

        <h2 className="text-center"> {selectedTempName == null ? "Reporte de Ventas" 
        : "Reporte " + selectedTempName + " de " + selectedProductName} </h2>

        {ProductOptions != null ? (

        <Col xs={8} md={2} lg={12}>
  
        <span>Seleccione el producto</span>
        <Select onChange={(selected) => setSelectedProduct(selected)} options={ProductOptions} />

        <span>Seleccione la temporalidad</span>
        <Select onChange={(selected) => setSelectedTemp(selected)} options={TempOptions} />
        
        <td></td>

                  <Button className='BtnBrown'
                  onClick={() => generateReport()}
                  >
                  Generar
                  </Button>

        <td></td>

        {DataArray && selectedTempName != null? (
                       
            <><>

              {/* {console.log("Quantity" + JSON.stringify(QuantityData))}
              {console.log("PurchaseTotal" + JSON.stringify(PurchaseData))}     */}

              {selectedTempName == 'Diario'? (
                <>
               <DailyQuantityChart chartData={QuantityData} />
               <td></td>
               <DailyPurchaseChart chartData={PurchaseData} />
                </>
                ) : null }

              {selectedTempName == 'Semanal'? (
                <>
               <WeeklyQuantityChart chartData={QuantityData} />
               <td></td>
               <WeeklyPurchaseChart chartData={PurchaseData} />
                </>
                ) : null }

              {selectedTempName == 'Mensual'? (
                <>
               <MonthlyQuantityChart chartData={QuantityData} />
               <td></td>
               <MonthlyPurchaseChart chartData={PurchaseData} />
                </>
                ) : null }

              {selectedTempName == 'Anual'? (
                <>
               <YearlyQuantityChart chartData={QuantityData} />
               <td></td>
               <YearlyPurchaseChart chartData={PurchaseData} />
                </>
                ) : null }  

              </>
              
              <td></td>

              <DownloadTableExcel 
              filename={reportName}
              sheet={reportName} 
              currentTableRef={ChartTable.current}
              >
              <button className='excelImg'>
              <img  src="https://i.ibb.co/br98Dfx/to-excel.png" alt="Icono de Excel" width="20%" height="10%"></img>
              </button> </DownloadTableExcel>

              {/* <td></td> */}

              {selectedTempName != 'Anual'? (

                  <table className='reportTable' ref={ChartTable}>
                    <thead>
                      <tr>  
                        <th>{selectedTempUnit}</th>
                        <th>Unidades vendidas {suffixThis}</th>
                        <th>Unidades vendidas {suffixLast}</th>
                        <th>Crecimiento</th>
                        <th>Crecimiento Porcentual</th>
                        <th>Total en ventas {suffixThis}</th>
                        <th>Total en ventas {suffixLast}</th>
                        <th>Crecimiento</th>
                        <th>Crecimiento Porcentual</th>
                      </tr>
                    </thead>
                    <tbody>
                    
                    {DataArray.map((SaleObject, index) => {

                      SumUnitThis += SaleObject[1]
                      SumUnitLast += SaleObject[2]
                      Growth1 = SaleObject[1] - SaleObject[2] 
                      GrowthPercent1 = SaleObject[1] ==0 || SaleObject[2] == 0? 0 : ((Growth1 / SaleObject[2]) * 100)

                      GrowthT1 += Growth1

                      SumTotalThis += SaleObject[3]
                      SumTotalLast += SaleObject[4]
                      Growth2 = SaleObject[3] - SaleObject[4]
                      GrowthPercent2 = SaleObject[3] ==0 || SaleObject[4] == 0? 0 : ((Growth2 / SaleObject[4]) * 100)

                      GrowthT2 += Growth2
                      
                      return (
                      <tr key={index}>

                      <td>{SaleObject[0]}</td>
                      <td>{SaleObject[1]}</td>
                      <td>{SaleObject[2]}</td>
                      <td>{Growth1}</td>
                      {GrowthPercent1 == 0? <td>N/D</td> : <td>{GrowthPercent1.toFixed(0)}%</td>}
                      <td>₡{SaleObject[3]}</td>
                      <td>₡{SaleObject[4]}</td>
                      <td>₡{Growth2}</td>
                      {GrowthPercent2 == 0? <td>N/D</td> : <td>{GrowthPercent2.toFixed(0)}%</td>}
                      </tr>
                      ) 
                      })}

                    <tr>
                      <td>Total</td>
                      <td>{SumUnitThis}</td>
                      <td>{SumUnitLast}</td>
                      <td>{GrowthT1}</td>
                      <td>N/D</td> 
                      <td>₡{SumTotalThis}</td>
                      <td>₡{SumTotalLast}</td>
                      <td>₡{GrowthT2}</td>
                      <td>N/D</td> 
                    </tr>

                    </tbody>
                    
                  </table>

              ): 
              
              <table className='reportTable' ref={ChartTable}>
              <thead>
                <tr>  
                  <th>Año</th>
                  <th>Unidades vendidas</th>
                  <th>Crecimiento respecto al año anterior</th>
                  <th>Crecimiento Porcentual</th>
                  <th>Total en ventas</th>
                  <th>Crecimiento respecto al año anterior</th>
                  <th>Crecimiento Porcentual</th>
                </tr>
              </thead>
              <tbody>
              
              {DataArray.map((SaleObject, index) => {

                SumUnitThis += SaleObject[1]
                Growth1 = SaleObject[1] - nextUnit
                GrowthPercent1 = SaleObject[1] == 0 || nextUnit == 0? 0 : ((Growth1 / nextUnit) * 100)
                GrowthT1 += Growth1
                GrowthP1 += GrowthPercent1
                nextUnit = SaleObject[1]

                SumTotalThis += SaleObject[2]
                Growth2 = SaleObject[2] - nextTotal
                GrowthPercent2 = SaleObject[2] == 0 || nextTotal == 0 ? 0 : ((Growth2 / nextTotal) * 100)
                GrowthT2 += Growth2
                GrowthP2 += GrowthPercent2
                nextTotal = SaleObject[2]

                return (
                <tr key={index}>

                <td>{SaleObject[0]}</td>
                <td>{SaleObject[1]}</td> 
                {index == 0? <td>N/D</td> : <td>{Growth1}</td>}
                {index == 0 || GrowthPercent1 == 0 ? <td>N/D</td> : <td>{GrowthPercent1.toFixed(0)}%</td>}
                <td>₡{SaleObject[2]}</td>
                {index == 0? <td>N/D</td> : <td>₡{Growth2}</td>}
                {index == 0 || GrowthPercent2 == 0? <td>N/D</td> : <td>{GrowthPercent2.toFixed(0)}%</td>}
                </tr>
                ) 
                })}

              <tr>
                <td>Total</td>
                <td>{SumUnitThis}</td>
                <td>{GrowthT1}</td>
                <td>N/D</td> 
                <td>₡{SumTotalThis}</td>
                <td>₡{GrowthT2}</td>
                <td>N/D</td> 

              </tr>

              </tbody>
              
            </table>
                 
              }

              </>

          ) : null}
        </Col>
      ) : (
        'Cargando'
      )}
    </Container>
  );
      }

export default productReport;
