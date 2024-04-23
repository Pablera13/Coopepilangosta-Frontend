import React, { useEffect, useRef } from 'react';

const YearlyPurchaseChart = ({ chartData }) => {
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
              label: 'Total de ventas',
              data: chartData.map((data) => data[1]),
              borderColor: '#4E3629', 
              backgroundColor: 'rgba(78, 54, 41, 0.1)', 
              borderWidth: 3,
              pointBackgroundColor: '#4E3629', 
              pointRadius: 5,
              pointHoverRadius: 7,
              fill: false,
            },
          ],
        },
        options: {
          animation: {
            duration: 1000,
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Año',
                color: '#333',
                font: {
                  size: 16,
                  weight: 'bold',
                },
              },
              ticks: {
                color: '#333',
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Total de ventas',
                color: '#333',
                font: {
                  size: 16,
                  weight: 'bold',
                },
              },
              ticks: {
                color: '#333',
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: '#333',
                font: {
                  size: 14,
                  weight: 'bold',
                },
              },
            },
          },
          maintainAspectRatio: false,
        },
      });
    });
  }, [chartData]);

  return (
    <div>
      <canvas ref={chartRef} style={{ width: '700px', height: '400px' }} />
    </div>
  );
};

export default YearlyPurchaseChart;
