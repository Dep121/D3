import React, { useEffect } from 'react';
import { select, csv, scaleLinear, max, scaleBand, axisLeft, axisBottom, format } from 'd3';
import csvData from './data.csv';
import s from './BarChart.module.scss';

function BarChartFormated({ }) {

  useEffect(() => {
    drawBarChart();
  }, []);

  async function drawBarChart() {
    const plChart = select('#barChartF');

    const width = +plChart.attr('width');
    const height = +plChart.attr('height');

    function render(data) {
      const xValue = d => d.population;
      const yValue = d => d.country;

      const margin = {top: 50, right: 20, bottom: 100, left: 300};
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

      g.selectAll('rect').data(data)
        .enter().append('rect')
          .attr('y', d => yScale(yValue(d)))
          .attr('width', d => xScale(xValue(d)))
          .attr('height', yScale.bandwidth());

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
    
    const d = await csv(csvData);
    d.forEach(ele => {
      ele.population = +ele.population * 1000;
    });

    render(d);

    // const g = plChart.append('g')

  }

  return <svg id="barChartF" className={s.barChartFormated} width='1400' height='500' >

  </svg>
}

export default BarChartFormated;
