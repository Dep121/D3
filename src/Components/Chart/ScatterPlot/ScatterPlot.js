import React, { useEffect } from 'react';
import {
  select,
  csv,
  scaleLinear,
  max,
  axisLeft,
  axisBottom,
  format,
  scalePoint
} from 'd3';
import s from './ScatterPlot.module.scss';

function ScatterPlot({ }) {

  useEffect(() => {
    drawBarChart();
  }, []);

  async function drawBarChart() {
    const plChart = select('#scatterPlot');

    const width = +plChart.attr('width');
    const height = +plChart.attr('height');

    function render(data) {
      const xValue = d => d.weight;
      const yValue = d => d.cylinders;

      const margin = { top: 50, right: 20, bottom: 100, left: 300 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const xScale = scaleLinear()
        .domain([0, max(data, xValue)])
        .range([0, innerWidth]);

      const yScale = scalePoint()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.1);

      const yAxis = axisLeft(yScale);

      const xAxisTickFormat = number =>
        format('.3s')(number)
          .replace('G', 'B');

      const xAxis = axisBottom(xScale)
        .tickFormat(xAxisTickFormat)
        .tickSize(-innerHeight);

      const g = plChart.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // yAxis(g.append('g'));
      // g.append('g').call(yAxis);

      g.selectAll('circle').data(data)
        .enter().append('circle')
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => xScale(xValue(d)))
        .attr('r', 10);

      const yAxisG = g.append('g')
        .call(axisLeft(yScale));

      yAxisG.selectAll('.domain, .tick line')
        .remove();

      yAxisG.selectAll('.tick')
        .attr('class', s.tick);

      const xAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0,${innerHeight})`);

      xAxisG.select('.domain').remove();

      xAxisG.selectAll('.tick')
        .attr('class', s.tick);

      xAxisG.append('text')
        .attr('class', s.xAxisLabel)
        .attr('x', innerWidth / 2)
        .attr('y', 60)
        .attr('fill', 'black')
        .text('Number of People');

      g.append('text')
        .attr('class', s.chartTitle)
        .attr('y', -10)
        .text('SouthAsian Countries population');
    }

    const d = await csv('https://vizhub.com/curran/datasets/auto-mpg.csv');
    d.forEach(ele => {
      d.mpg = +d.mpg;
      d.cylinders = +d.cylinders;
      d.displacement = +d.displacement;
      d.horsepower = +d.horsepower;
      d.weight = +d.weight;
      d.acceleration = +d.acceleration;
      d.year = +d.year;
    });

    render(d);

    // const g = plChart.append('g')

  }

  return <svg id="scatterPlot" className={s.scatterPlot} width='1400' height='500' >

  </svg>
}

export default ScatterPlot;

/**
 * {
 * "mpg": "18"
 * "cyclinders": "8"
 * "displacement": "307"
 * "horsepower": "130"
 * "weight": "3504"
 * "acceleration": "12"
 * "year": "1970"
 * "origin": "USA",
 * "name": "chevrolet chevelle malibu"
 * }
 */
