export const ObtainWeeklyData = async (ProductSales) => {
  
  //   export const ObtainWeeklyData = async (xd) => {
  
  //   let ProductSales = [
  //   {Quantity:1,PurchaseTotal:100,Date:"2023-09-05"},//Last1
  //   {Quantity:2,PurchaseTotal:200,Date:"2023-09-13"},//Last2
  //   {Quantity:3,PurchaseTotal:300,Date:"2023-09-21"},//Last3
  //   {Quantity:4,PurchaseTotal:400,Date:"2023-09-27"},//Last4
  //   {Quantity:5,PurchaseTotal:500,Date:"2023-10-07"},//This1
  //   {Quantity:6,PurchaseTotal:600,Date:"2023-10-13"},//This2
  //   {Quantity:7,PurchaseTotal:700,Date:"2023-10-19"},//This3
  //   {Quantity:8,PurchaseTotal:800,Date:"2023-10-25"} //This4
  // ]
  
    console.log("ProductSales " + JSON.stringify(ProductSales))
  
    const today = new Date();
  
    let PurchaseData = [];
    let QuantityData = [];
    let WeeklyData = [];
  
    // Calcular el primer dia del mes actual
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
    // Calcular el primer dia del mes pasado 
    const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth()-1, 1);
  
    function obtenerRangoDeSemanasMes(primerDiaDelMes) {
      const fechaActual = new Date(primerDiaDelMes);
      const rangosDeSemanas = [];
      const diasPorSemana = 7;
      let contadorDiasSemana = 0;
    
      let semanaActual = [];
      let fechaIteracion = new Date(fechaActual);
      while (fechaIteracion.getMonth() === fechaActual.getMonth()) {
        semanaActual.push(new Date(fechaIteracion));
        contadorDiasSemana++;
    
        if (contadorDiasSemana === diasPorSemana) {
          rangosDeSemanas.push({
            inicio: new Date(semanaActual[0]),
            fin: new Date(semanaActual[semanaActual.length - 1]),
          });
          semanaActual = [];
          contadorDiasSemana = 0;
        }
          fechaIteracion.setDate(fechaIteracion.getDate() + 1);
      }
        if (semanaActual.length > 0) {
        rangosDeSemanas.push({
          inicio: new Date(semanaActual[0]),
          fin: new Date(semanaActual[semanaActual.length - 1]),
        });
      }
      return rangosDeSemanas;
    }
    
    //Este mes
    const Thisrangos = obtenerRangoDeSemanasMes(firstDayOfMonth);
    let ThisWeek1 = []
    let ThisWeek2 = []
    let ThisWeek3 = []
    let ThisWeek4 = []
    let ThisWeeksArray = [ThisWeek1,ThisWeek2,ThisWeek3,ThisWeek4]
    {Thisrangos.map((week, index) => {
  
      for(const sale of ProductSales){
        const SaleDate = new Date(sale.Date)
        const inicio = new Date(week.inicio)
        const fin = new Date(week.fin) 
  
        if(SaleDate >= inicio && SaleDate <= fin){
          ThisWeeksArray[index].push(sale)
         } }
    })}
  
    {ThisWeeksArray.map((week, index) => {
  
      const purchaseTotalThisWeek = week.reduce((total, sale) => total + sale.PurchaseTotal, 0);
      PurchaseData.push(["Semana " + (index+1), purchaseTotalThisWeek])
  
      const totalQuantityThisWeek = week.reduce((total, sale) => total + sale.Quantity, 0);
      QuantityData.push(["Semana " + (index+1), totalQuantityThisWeek])
    })}
  
    //Mes pasado
    const Lastrangos = obtenerRangoDeSemanasMes(firstDayOfLastMonth);
    let LastWeek1 = []
    let LastWeek2 = []
    let LastWeek3 = []
    let LastWeek4 = []
    let LastWeeksArray = [LastWeek1,LastWeek2,LastWeek3,LastWeek4]
    {Lastrangos.map((week, index) => {
  
      for(const sale of ProductSales){
        const SaleDate = new Date(sale.Date)
        const inicio = new Date(week.inicio)
        const fin = new Date(week.fin) 
  
        if(SaleDate >= inicio && SaleDate <= fin){
          LastWeeksArray[index].push(sale)
         } }
    })}
    
      {LastWeeksArray.map((week, index) => {
  
      const purchaseTotalLastWeek = week.reduce((total, sale) => total + sale.PurchaseTotal, 0);
      PurchaseData[index].push(purchaseTotalLastWeek)
  
      const totalQuantityLastWeek = week.reduce((total, sale) => total + sale.Quantity, 0);
      QuantityData[index].push(totalQuantityLastWeek)
    })}
  
      //WeeklyData = QuantityData.concat(PurchaseData);
      console.log(WeeklyData)
      WeeklyData = 
      [
        [
            "Semana 1",
            Math.floor(Math.random() * (99 - 1 + 1) + 1),
            Math.floor(Math.random() * (99 - 1 + 1) + 1)
        ],
        [
            "Semana 2",
            Math.floor(Math.random() * (99 - 1 + 1) + 1),
            Math.floor(Math.random() * (99 - 1 + 1) + 1)
        ],
        [
            "Semana 3",
            Math.floor(Math.random() * (99 - 1 + 1) + 1),
            Math.floor(Math.random() * (99 - 1 + 1) + 1)
        ],
        [
            "Semana 4",
            Math.floor(Math.random() * (99 - 1 + 1) + 1),
            Math.floor(Math.random() * (99 - 1 + 1) + 1)
        ],
        [
            "Semana 1",
            Math.floor(Math.random() * (99 - 1 + 1) + 1),
            Math.floor(Math.random() * (99 - 1 + 1) + 1)
        ],
        [
            "Semana 2",
            Math.floor(Math.random() * (99 - 1 + 1) + 1),
            Math.floor(Math.random() * (99 - 1 + 1) + 1)
        ],
        [
            "Semana 3",
            Math.floor(Math.random() * (99 - 1 + 1) + 1),
            Math.floor(Math.random() * (99 - 1 + 1) + 1)
        ],
        [
            "Semana 4",
            Math.floor(Math.random() * (99 - 1 + 1) + 1),
            Math.floor(Math.random() * (99 - 1 + 1) + 1)
        ]
    ]
  
      return WeeklyData;
  }