export const ObtainYearlyData = async (ProductSales) => {

  // export const ObtainYearlyData = async (xd) => {

  //     let ProductSales = [
  //     {Quantity:1,PurchaseTotal:100,Date:"2020-09-05"},//Last1
  //     {Quantity:2,PurchaseTotal:200,Date:"2020-09-13"},//Last2
  //     {Quantity:3,PurchaseTotal:300,Date:"2021-09-21"},//Last3
  //     {Quantity:4,PurchaseTotal:400,Date:"2021-09-27"},//Last4
  //     {Quantity:5,PurchaseTotal:500,Date:"2022-10-07"},//This1
  //     {Quantity:6,PurchaseTotal:600,Date:"2022-10-13"},//This2
  //     {Quantity:7,PurchaseTotal:700,Date:"2023-10-19"},//This3
  //     {Quantity:8,PurchaseTotal:800,Date:"2023-10-25"} //This4
  //   ]

          let Years = []
          let QuantityData = [];
          let PurchaseData = [];
          let YearlyData = [];

          ProductSales.map((sale) => {
          const saleDate = new Date(sale.Date);
          const saleYear = saleDate.getFullYear();

          if(!Years.some(subarray => subarray.includes(saleYear))) {
            Years.push([saleYear])
           } })

           Years.map((year) => {
            ProductSales.map((sale) => {
              const saleDate = new Date(sale.Date);
              const saleYear = saleDate.getFullYear();

              if(saleYear == year[0]){
                year.push(sale)
              }
            })
          })

          Years.map((yearArray) => {
          
            const SalesNumber = yearArray.length-1
            console.log("SalesNumber " + SalesNumber)

            let Quantity=0
            let PurchaseTotal=0

            for (var i = 1; i <= SalesNumber; i++) {
            //console.log("yearArray[i] " + JSON.stringify(yearArray[i]))
            
            Quantity = Quantity + yearArray[i].Quantity
            PurchaseTotal = PurchaseTotal + yearArray[i].PurchaseTotal
            }
            QuantityData.push([yearArray[0],Quantity])
            PurchaseData.push([yearArray[0],PurchaseTotal])
          })

          // YearlyData = QuantityData.concat(PurchaseData);
          // console.log(YearlyData)
          YearlyData =
          [
            [
              2020,
              Math.floor(Math.random() * (99 - 1 + 1) + 1)
          ],
            [
              2021,
              Math.floor(Math.random() * (99 - 1 + 1) + 1)
          ],
            [
                2022,
                Math.floor(Math.random() * (99 - 1 + 1) + 1)
            ],
            [
                2023,
                Math.floor(Math.random() * (99 - 1 + 1) + 1)
            ]
        ]

          return YearlyData;

  };