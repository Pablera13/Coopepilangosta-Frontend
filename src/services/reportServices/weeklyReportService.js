export const ObtainWeeklyData = async (ProductSales) => {
    
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
  
    WeeklyData = QuantityData.concat(PurchaseData);
  
      return WeeklyData;
  }