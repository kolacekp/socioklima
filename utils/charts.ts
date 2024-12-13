export const solidChartCategoriesColorArray = [
  '#fdfb00',
  '#b7ff00',
  '#ff00ff',
  '#b600ff',
  '#ff0000',
  '#dddddd',
  '#d5c672',
  '#3d00ff',
  '#27bbff'
];

export const solidChartTeacherCategoriesColorArray = ['#fdfb00', '#b7ff00', '#ff00ff', '#b600ff', '#ff0000', '#27bbff'];

export const chartJSVersion = '4.4.0';

export const barChartCommonOptions = {
  scales: {
    y: {
      beginAtZero: true
    }
  },
  plugins: {
    legend: {
      labels: {
        font: {
          family: 'Inter',
          size: 14
        }
      }
    },
    datalabels: {
      color: 'black',
      font: {
        family: 'Inter',
        size: 12,
        weight: 700
      },
      textStrokeColor: 'white',
      textStrokeWidth: 2
    }
  }
};

export const doughnutChartCommonOptions = {
  cutout: '50%',
  plugins: {
    legend: {
      labels: {
        font: {
          family: 'Inter',
          size: 14
        }
      }
    },
    datalabels: {
      color: 'black',
      font: {
        family: 'Inter',
        size: 14,
        weight: 700
      },
      formatter: (value: any) => {
        if (value) return value + '%';
        return '';
      },
      anchor: 'end',
      align: 'start',
      offset: 6,
      textStrokeColor: 'white',
      textStrokeWidth: 2
    }
  }
};
