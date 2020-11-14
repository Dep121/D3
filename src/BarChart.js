import React, { useEffect } from 'react';
import { select, csv, scaleLinear, max, scaleBand, axisLeft, axisBottom } from 'd3';
import csvData from './data.csv';
import s from './BarChart.module.scss';

function BarChart({ }) {

  useEffect(() => {
    drawBarChart();
  }, []);

  async function drawBarChart() {
    const plChart = select('#barChart');

    const width = +plChart.attr('width');
    const height = +plChart.attr('height');

    function render(data) {
      const xValue = d => d.population;
      const yValue = d => d.country;

      const margin = {top: 20, right: 20, bottom: 100, left: 150};
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const xScale = scaleLinear()
        .domain([0, max(data, xValue)])
        .range([0, innerWidth]);

      const yScale = scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.1);

      const yAxis = axisLeft(yScale);

      const g = plChart.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
      
      // yAxis(g.append('g'));
      // g.append('g').call(yAxis);

      g.selectAll('rect').data(data)
        .enter().append('rect')
          .attr('y', d => yScale(yValue(d)))
          .attr('width', d => xScale(xValue(d)))
          .attr('height', yScale.bandwidth());

      g.append('g').call(axisLeft(yScale));
      g.append('g').call(axisBottom(xScale))
        .attr('transform', `translate(0,${innerHeight})`);
    }
    
    const d = await csv(csvData);
    d.forEach(ele => {
      ele.population = +ele.population * 1000;
    });

    render(d);

    // const g = plChart.append('g')

  }

  return <svg id="barChart" className={s.barChart} width='1400' height='500' >

  </svg>
}

export default BarChart;
