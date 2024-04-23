export const ObtainYearlyData = async (ProductSales) => {

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

          YearlyData = QuantityData.concat(PurchaseData);
          
          return YearlyData;

  };