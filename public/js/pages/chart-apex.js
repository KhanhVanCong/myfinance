'use strict';

$(document).ready(function () {
    setTimeout(() => {
      $(function() {
        var options = {
          chart: {
            height: 350,
            type: 'bar',
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
              endingShape: 'rounded'
            },
          },
          dataLabels: {
            enabled: false
          },
          colors: ["#0e9e4a", "#4680ff", "#ff5252"],
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          series: [{
            name: 'Net Profit',
            data: [44, 55, 57, 56, 61, 58, 63]
          }, {
            name: 'Revenue',
            data: [76, 85, 101, 98, 87, 105, 91]
          }, {
            name: 'Free Cash Flow',
            data: [35, 41, 36, 26, 45, 48, 52]
          }],
          xaxis: {
            categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
          },
          yaxis: {
            title: {
              text: '$ (thousands)'
            }
          },
          fill: {
            opacity: 1

          },
          tooltip: {
            y: {
              formatter: function(val) {
                return "$ " + val + " thousands"
              }
            }
          }
        }
        var chart = new ApexCharts(
          document.querySelector("#bar-chart-1"),
          options
        );
        chart.render();
      });

      $(function() {
        var options = {
          chart: {
            height: 350,
            type: 'bar',
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
              endingShape: 'rounded'
            },
          },
          dataLabels: {
            enabled: false
          },
          colors: ["#0e9e4a", "#4680ff", "#ff5252"],
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          series: [{
            name: 'Net Profit',
            data: [44, 55, 57, 56, 61, 58, 63]
          }, {
            name: 'Revenue',
            data: [76, 85, 101, 98, 87, 105, 91]
          }, {
            name: 'Free Cash Flow',
            data: [35, 41, 36, 26, 45, 48, 52]
          }],
          xaxis: {
            categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
          },
          yaxis: {
            title: {
              text: '$ (thousands)'
            }
          },
          fill: {
            opacity: 1

          },
          tooltip: {
            y: {
              formatter: function(val) {
                return "$ " + val + " thousands"
              }
            }
          }
        }
        var chart = new ApexCharts(
          document.querySelector("#bar-chart-2"),
          options
        );
        chart.render();
      });

      $(function () {
        var options = {
          chart: {
            height: 320,
            type: 'pie',
          },
          labels: [ 'Team A', 'Team B', 'Team C', 'Team D', 'Team E' ],
          series: [ 44, 55, 13, 43, 22 ],
          colors: [ "#4680ff", "#0e9e4a", "#00acc1", "#ffba57", "#ff5252" ],
          legend: {
            show: true,
            position: 'bottom',
          },
          dataLabels: {
            enabled: true,
            dropShadow: {
              enabled: false,
            }
          },
          responsive: [ {
            breakpoint: 480,
            options: {
              legend: {
                position: 'bottom'
              }
            }
          } ]
        }
        var chart = new ApexCharts(
          document.querySelector("#pie-chart-1"),
          options
        );
        chart.render();
      });

      $(function () {
        var options = {
          chart: {
            height: 320,
            type: 'donut',
          },
          series: [ 44, 55, 41, 17, 15 ],
          colors: [ "#4680ff", "#0e9e4a", "#00acc1", "#ffba57", "#ff5252" ],
          legend: {
            show: true,
            position: 'bottom',
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    show: true
                  },
                  value: {
                    show: true
                  }
                }
              }
            }
          },
          dataLabels: {
            enabled: true,
            dropShadow: {
              enabled: false,
            }
          },
          responsive: [ {
            breakpoint: 480,
            options: {
              legend: {
                position: 'bottom'
              }
            }
          } ]
        }
        var chart = new ApexCharts(
          document.querySelector("#pie-chart-2"),
          options
        );
        chart.render();
      });
    }, 700);

  function renderChart(idChart, nam, dataYearNow, dataYearBefore, unit) {
    var options = {
      series: [{
        name: `${nam}`,
        data: dataYearNow
      }, {
        name: `${nam - 1}`,
        data: dataYearBefore
      }],
      chart: {
        id: `${idChart}`,
        type: 'bar',
        height: 250
      },
      colors: ["#ff5252", "#4680ff"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'flat'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        labels: {
          rotate: -45,
          trim: false,
        }
      },
      yaxis: {
        title: {
          text: `${unit}`
        },
        labels: {
          formatter: function (val, index) {
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + `${unit}`
          }
        }
      }
    };
    const chart = new ApexCharts(document.querySelector(`#${idChart}`), options);
    chart.render();
  };

  });
