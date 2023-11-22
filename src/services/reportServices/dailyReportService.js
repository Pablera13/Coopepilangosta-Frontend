export const ObtainDailyData = async (ProductSales) => {

  const today = new Date();

  let PurchaseData = [];
  let QuantityData = [];
  let DailyData=[]

  //calcular semana actual
  const lastSunday = new Date(today);
  lastSunday.setDate(today.getDate() - (today.getDay() + 6) % 7);
  const nextSunday = new Date(lastSunday);
  nextSunday.setDate(lastSunday.getDate() + 6);

  //calcular semana pasada
  const lastWeekStart = new Date(lastSunday);
  lastWeekStart.setDate(lastSunday.getDate() - 7);
  const lastWeekEnd = new Date(nextSunday);
  lastWeekEnd.setDate(nextSunday.getDate() - 7);

  //filtra ventas en semana actual
  const salesInWeek = ProductSales.filter((sale) => {
    const saleDate = new Date(sale.Date);
    return saleDate >= lastSunday && saleDate <= nextSunday;
  });

  //filtra ventas en semana pasada
  const salesLastWeek = ProductSales.filter((sale) => {
    const saleDate = new Date(sale.Date);
    return saleDate >= lastWeekStart && saleDate <= lastWeekEnd;
  });

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  daysOfWeek.forEach((day) => {
    const salesForDayThisWeek = salesInWeek.filter((sale) => {
      const saleDate = new Date(sale.Date);
      saleDate.setDate(saleDate.getDate() + 1);
      const formattedsaleDate = capitalizeFirstLetter(saleDate.toLocaleDateString('es-ES', { weekday: 'long' }));
      return formattedsaleDate === day;
    });

    const purchaseTotalThisWeek = salesForDayThisWeek.reduce((total, sale) => total + sale.PurchaseTotal, 0);
    const totalQuantityThisWeek = salesForDayThisWeek.reduce((total, sale) => total + sale.Quantity, 0);

    const salesForDayLastWeek = salesLastWeek.filter((sale) => {
      const saleDate = new Date(sale.Date);
      saleDate.setDate(saleDate.getDate() + 1);
      const formattedsaleDate = capitalizeFirstLetter(saleDate.toLocaleDateString('es-ES', { weekday: 'long' }));
      return formattedsaleDate === day;
    });

    const purchaseTotalLastWeek = salesForDayLastWeek.reduce((total, sale) => total + sale.PurchaseTotal, 0);
    const totalQuantityLastWeek = salesForDayLastWeek.reduce((total, sale) => total + sale.Quantity, 0);

    PurchaseData.push([day, purchaseTotalThisWeek, purchaseTotalLastWeek]);
    QuantityData.push([day, totalQuantityThisWeek, totalQuantityLastWeek]);
  });

  //DailyData = QuantityData.concat(PurchaseData)
  //console.log(DailyData)
  DailyData =
  [
    [
        "Lunes",
        Math.floor(Math.random() * (99 - 1 + 1) + 1),
        Math.floor(Math.random() * (99 - 1 + 1) + 1)
    ],
    [
        "Martes",
        Math.floor(Math.random() * (99 - 1 + 1) + 1),
        Math.floor(Math.random() * (99 - 1 + 1) + 1)
    ],
    [
        "Miércoles",
        Math.floor(Math.random() * (99 - 1 + 1) + 1),
        Math.floor(Math.random() * (99 - 1 + 1) + 1)
    ],
    [
        "Jueves",
        Math.floor(Math.random() * (99 - 1 + 1) + 1),
        Math.floor(Math.random() * (99 - 1 + 1) + 1)
    ],
    [
        "Viernes",
        Math.floor(Math.random() * (99 - 1 + 1) + 1),
        Math.floor(Math.random() * (99 - 1 + 1) + 1)
    ],
    [
        "Sábado",
        Math.floor(Math.random() * (99 - 1 + 1) + 1),
        Math.floor(Math.random() * (99 - 1 + 1) + 1)
    ],
    [
        "Domingo",
        Math.floor(Math.random() * (99 - 1 + 1) + 1),
        Math.floor(Math.random() * (99 - 1 + 1) + 1)
    ],
    [
        "Lunes",
        Math.floor(Math.random() * (99 - 1 + 1) + 1),
        Math.floor(Math.random() * (99 - 1 + 1) + 1)
    ],
    [
        "Martes",
        Math.floor(Math.random() * (99 - 1 + 1) + 1),
        Math.floor(Math.random() * (99 - 1 + 1) + 1)
    ],
    [
        "Miércoles",
        Math.floor(Math.random() * (99 - 1 + 1) + 1),
        Math.floor(Math.random() * (99 - 1 + 1) + 1)
    ],
    [
        "Jueves",
        Math.floor(Math.random() * (99 - 1 + 1) + 1),
        Math.floor(Math.random() * (99 - 1 + 1) + 1)
    ],
    [
        "Viernes",
        Math.floor(Math.random() * (99 - 1 + 1) + 1),
        Math.floor(Math.random() * (99 - 1 + 1) + 1)
    ],
    [
        "Sábado",
        Math.floor(Math.random() * (99 - 1 + 1) + 1),
        Math.floor(Math.random() * (99 - 1 + 1) + 1)
    ],
    [
        "Domingo",
        Math.floor(Math.random() * (99 - 1 + 1) + 1),
        Math.floor(Math.random() * (99 - 1 + 1) + 1)
    ]
]
  return DailyData

};