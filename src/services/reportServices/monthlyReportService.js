export const ObtainMonthlyData = async (ProductSales) => {
  const today = new Date();

  let PurchaseData = [];
  let QuantityData = [];
  let MonthlyData = [];

  // Calcular el primer día del mes actual
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Calcular el primer día del mes anterior
  const firstDayOfLastMonth = new Date(firstDayOfMonth);
  firstDayOfLastMonth.setMonth(firstDayOfLastMonth.getMonth() - 1);

  // Filtrar ventas en el mes actual
  const salesInMonth = ProductSales.filter((sale) => {
    const saleDate = new Date(sale.Date);
    return saleDate >= firstDayOfMonth && saleDate < today;
  });

  // Filtrar ventas en el mes anterior
  const salesInLastMonth = ProductSales.filter((sale) => {
    const saleDate = new Date(sale.Date);
    return saleDate >= firstDayOfLastMonth && saleDate < firstDayOfMonth;
  });

  const monthsOfYear = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  monthsOfYear.forEach((month) => {
    const salesForMonthThisYear = salesInMonth.filter((sale) => {
      const saleDate = new Date(sale.Date);
      const formattedMonth = capitalizeFirstLetter(saleDate.toLocaleDateString('es-ES', { month: 'long' }));
      return formattedMonth === month;
    });

    const purchaseTotalThisMonth = salesForMonthThisYear.reduce((total, sale) => total + sale.PurchaseTotal, 0);
    const totalQuantityThisMonth = salesForMonthThisYear.reduce((total, sale) => total + sale.Quantity, 0);

    const salesForMonthLastYear = salesInLastMonth.filter((sale) => {
      const saleDate = new Date(sale.Date);
      const formattedMonth = capitalizeFirstLetter(saleDate.toLocaleDateString('es-ES', { month: 'long' }));
      return formattedMonth === month;
    });

    const purchaseTotalLastMonth = salesForMonthLastYear.reduce((total, sale) => total + sale.PurchaseTotal, 0);
    const totalQuantityLastMonth = salesForMonthLastYear.reduce((total, sale) => total + sale.Quantity, 0);


    PurchaseData.push([month, purchaseTotalThisMonth, purchaseTotalLastMonth ]);
    QuantityData.push([month, totalQuantityThisMonth, totalQuantityLastMonth ]);
  });

  console.log("PurchaseData = " + JSON.stringify(PurchaseData))
  console.log("QuantityData = " + JSON.stringify(QuantityData))

  MonthlyData = QuantityData.concat(PurchaseData);
  return MonthlyData;
};