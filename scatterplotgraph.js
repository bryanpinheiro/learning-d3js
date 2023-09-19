const data = [
  { x: 10, y: 20 },
  { x: 30, y: 40 },
  { x: 50, y: 10 },
  { x: 70, y: 30 },
  { x: 90, y: 50 }
];

const scatterWidth = 400;
const scatterHeight = 400;
const margin = { top: 100, right: 20, bottom: 40, left: 40 };
const scatterChartWidth = scatterWidth - margin.left - margin.right;
const scatterChartHeight = scatterHeight - margin.top - margin.bottom;

const scatterSvg = d3.select('#scatter-plot-graph-container')
  .append('svg')
  .attr('width', scatterWidth)
  .attr('height', scatterHeight )
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);

const xScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.x)])
  .range([0, scatterChartWidth]);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.y)])
  .range([scatterChartHeight, 0]);

scatterSvg.selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('cx', d => xScale(d.x))
  .attr('cy', d => yScale(d.y))
  .attr('r', 5) // Radius of the circle
  .attr('fill', 'steelblue');

scatterSvg.append('g')
  .attr('transform', `translate(0,${scatterChartHeight})`)
  .call(d3.axisBottom(xScale));

scatterSvg.append('g')
  .call(d3.axisLeft(yScale));

// Add x-axis label
scatterSvg.append('text')
  .attr('x', scatterChartWidth / 2)
  .attr('y', scatterChartHeight + margin.bottom)
  .attr('text-anchor', 'middle')
  .text('X Axis');

// Add y-axis label
scatterSvg.append('text')
  .attr('transform', 'rotate(-90)')
  .attr('x', -scatterChartHeight / 2)
  .attr('y', -margin.left + 10)
  .attr('text-anchor', 'middle')
  .text('Y Axis');

// Add a title for the scatter plot
scatterSvg.append('text')
  .attr('x', scatterChartWidth / 2)
  .attr('y', 0 - margin.top / 2)
  .attr('text-anchor', 'middle')
  .style('font-size', '18px')
  .style('font-weight', 'bold')
  .text('Simple Scatter Plot');
