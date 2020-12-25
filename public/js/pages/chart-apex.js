'use strict';

$(document)
  .ready(function () {
    setTimeout(() => {
      $(function () {
        var options = {
          chart: {
            height: 350,
            type: 'line',
          },
          series: [ {
            name: 'Website Blog',
            type: 'column',
            data: [ 440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160 ]
          }, {
            name: 'Social Media',
            type: 'line',
            data: [ 23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16 ]
          } ],
          stroke: {
            width: [ 0, 4 ]
          },
          colors: [ "#4680ff", "#ff5252" ],
          title: {
            text: 'Traffic Sources'
          },
          labels: [ '01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001' ],
          xaxis: {
            type: 'datetime'
          },
          yaxis: [ {
            title: {
              text: 'Website Blog',
            },

          }, {
            opposite: true,
            title: {
              text: 'Social Media'
            }
          } ]

        }
        var chart = new ApexCharts(
          document.querySelector("#mixed-chart-1"),
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
  });
