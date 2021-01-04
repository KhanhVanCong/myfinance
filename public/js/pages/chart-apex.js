'use strict';

$(document).ready(async function () {
  setTimeout(() => {
    $(function () {
      var options = {
        chart: {
          height: 350,
          type: 'area',
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        colors: [ "#ffba57", "#ff5252" ],
        series: [ {
          name: 'series1',
          data: [ 31, 40, 28, 51, 42, 109, 100 ]
        }, {
          name: 'series2',
          data: [ 11, 32, 45, 32, 34, 52, 41 ]
        } ],

        xaxis: {
          type: 'datetime',
          categories: [ "2018-09-19T00:00:00", "2018-09-19T01:30:00", "2018-09-19T02:30:00", "2018-09-19T03:30:00", "2018-09-19T04:30:00", "2018-09-19T05:30:00", "2018-09-19T06:30:00" ],
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy HH:mm'
          },
        }
      }

      var chart = new ApexCharts(
        document.querySelector("#pie-chart-2"),
        options
      );

      chart.render();
    });
  }, 700);

  const dateTimeNow = new Date();
  const currentYear = dateTimeNow.getFullYear();
  const lastYear = currentYear - 1;

  // Get data and Render chart for Incomes
  const [ resultIncomeCurrentYear, resultIncomeLastYear ] = await Promise.all(
    [ getIncomeInYear(currentYear),
      getIncomeInYear(lastYear) ]);
  const incomesCurrentYear = resultIncomeCurrentYear.data;
  const incomesLastYear = resultIncomeLastYear.data;
  if (incomesCurrentYear && incomesLastYear) {
    const dataFormatCurrentYear = formatDataWithEmptyMonth(incomesCurrentYear);
    const dataFormatLastYear = formatDataWithEmptyMonth(incomesLastYear);
    renderBarChart('bar-chart-incomes', currentYear, dataFormatCurrentYear, dataFormatLastYear, 'VND');
  }

  // Get data and Render chart for Expenses
  const [ resultExpenseCurrentYear, resultExpenseLastYear ] = await Promise.all(
    [ getExpensesInYear(currentYear),
      getExpensesInYear(lastYear) ]);
  const expensesCurrentYear = resultExpenseCurrentYear.data;
  const expensesLastYear = resultExpenseLastYear.data;
  if (expensesCurrentYear && expensesLastYear) {
    const dataFormatCurrentYear = formatDataWithEmptyMonth(expensesCurrentYear);
    const dataFormatLastYear = formatDataWithEmptyMonth(expensesLastYear);
    renderAreaChart('bar-chart-expenses', currentYear, dataFormatCurrentYear, dataFormatLastYear, 'VND');
  }

  // Get data and Render chart for Invests
  const [ resultInvestsCurrentYear, resultInvestsLastYear ] = await Promise.all(
    [ getInvestsInYear(currentYear),
      getInvestsInYear(lastYear) ]);
  const investsCurrentYear = resultInvestsCurrentYear.data;
  const investsLastYear = resultInvestsLastYear.data;
  if (investsCurrentYear && investsLastYear) {
    const dataFormatCurrentYear = formatDataWithEmptyMonth(investsCurrentYear);
    const dataFormatLastYear = formatDataWithEmptyMonth(investsLastYear);
    renderBarChart('bar-chart-invests', currentYear, dataFormatCurrentYear, dataFormatLastYear, 'VND');
  }

  // Get data and Render chart for Depts
  const [ resultDeptsCurrentYear, resultDeptsLastYear ] = await Promise.all(
    [ getDeptsInYear(currentYear),
      getDeptsInYear(lastYear) ]);
  const deptsCurrentYear = resultDeptsCurrentYear.data;
  const deptsLastYear = resultDeptsLastYear.data;
  if (deptsCurrentYear && deptsLastYear) {
    const dataFormatCurrentYear = formatDataWithEmptyMonth(deptsCurrentYear);
    const dataFormatLastYear = formatDataWithEmptyMonth(deptsLastYear);
    renderBarChart('bar-chart-depts', currentYear, dataFormatCurrentYear, dataFormatLastYear, 'VND');
  }

});

function renderBarChart(idChart, nam, dataYearNow, dataYearBefore, unit) {
  let options = {
    series: [ {
      name: `${ nam }`,
      data: dataYearNow
    }, {
      name: `${ nam - 1 }`,
      data: dataYearBefore
    } ],
    chart: {
      id: `${ idChart }`,
      type: 'bar',
      height: 350
    },
    colors: [ '#9ccc65', '#4680ff' ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '100%',
        endingShape: 'flat'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: [ 'transparent' ]
    },
    xaxis: {
      categories: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
      labels: {
        rotate: -45,
        trim: false,
      }
    },
    yaxis: {
      title: {
        text: `${ unit }`
      },
      labels: {
        formatter: function (val, index) {
          return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ` ${ unit }`
        }
      }
    }
  };
  const chart = new ApexCharts(document.querySelector(`#${ idChart }`), options);
  chart.render();
}

function renderAreaChart(idChart, nam, dataYearNow, dataYearBefore, unit) {
  let options = {
    chart: {
      height: 350,
      type: 'area',
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    colors: [ "#9ccc65", "#4680ff" ],
    series: [ {
      name: `${ nam }`,
      data: dataYearNow
      }, {
      name: `${ nam - 1 }`,
      data: dataYearBefore
      } ],

    xaxis: {
      categories: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
      labels: {
        rotate: -45,
        trim: false,
      }
    },
    yaxis: {
      title: {
        text: `${ unit }`
      },
      labels: {
        formatter: function (val, index) {
          return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ` ${ unit }`
        }
      }
    }
  }
  const chart = new ApexCharts(document.querySelector(`#${ idChart }`), options);
  chart.render();
}

function getIncomeInYear(year) {
  return $.ajax({
    url: `/getincomesinyear/${ year }`,
    method: 'GET',
    contentType: 'application/json',
    error: function (e) {
      new PNotify.alert({
        title: 'Failed !!!',
        text: `${ e.responseJSON.message }`,
        type: 'error'
      });
    }
  });
}

function getExpensesInYear(year) {
  return $.ajax({
    url: `/getexpensesinyear/${ year }`,
    method: 'GET',
    contentType: 'application/json',
    error: function (e) {
      new PNotify.alert({
        title: 'Failed !!!',
        text: `${ e.responseJSON.message }`,
        type: 'error'
      });
    }
  });
}

function getInvestsInYear(year) {
  return $.ajax({
    url: `/getinvestsinyear/${ year }`,
    method: 'GET',
    contentType: 'application/json',
    error: function (e) {
      new PNotify.alert({
        title: 'Failed !!!',
        text: `${ e.responseJSON.message }`,
        type: 'error'
      });
    }
  });
}

function getDeptsInYear(year) {
  return $.ajax({
    url: `/getdeptsinyear/${ year }`,
    method: 'GET',
    contentType: 'application/json',
    error: function (e) {
      new PNotify.alert({
        title: 'Failed !!!',
        text: `${ e.responseJSON.message }`,
        type: 'error'
      });
    }
  });
}

function formatDataWithEmptyMonth(arr) {
  let dataFormat = [];
  arr.sort((a, b) => a.month - b.month);
  for (let i = 0; i < 12; i++) {
    const indexMatch = arr.findIndex(a => a.month == i + 1);
    if (indexMatch !== -1) {
      dataFormat.push(arr[indexMatch].totalMoney);
    } else {
      dataFormat.push(0);
    }
  }
  return dataFormat;
}
