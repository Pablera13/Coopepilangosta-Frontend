import React, { useEffect, useRef } from 'react';

const YearlyQuantityChart = ({ chartData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    import('chart.js/auto').then((Chart) => {
      const chart = new Chart.default(ctx, {
        type: 'line',
        data: {
          labels: chartData.map((data) => data[0]),
          datasets: [
            {
              label: 'Unidades comercializadas',
              data: chartData.map((data) => data[1]),
              borderColor: 'blue',
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Año',
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Cantidad de unidades vendidas',
              },
            },
          },
        },
      });
    });
  }, [chartData]);

  return (
    <div>
 <canvas ref={chartRef} style={{ width: '700px', height: '200px' }} /> </div>
  );
};

export default YearlyQuantityChart;
