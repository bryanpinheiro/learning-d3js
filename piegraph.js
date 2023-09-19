const fakeData = [
  { category: 'Category A', value: 30 },
  { category: 'Category B', value: 50 },
  { category: 'Category C', value: 20 }
];

const pieWidth = 400;
const pieHeight = 400;
const radius = Math.min(pieWidth, pieHeight) / 2;

const colorScale = d3.scaleOrdinal()
  .domain(fakeData.map(d => d.category))
  .range(['#FFC107', '#E57373', '#64B5F6']); // Yellow, Red, Blue for good contrast

const pieSvg = d3.select('#pie-graph-container')
  .append('svg')
  .attr('width', pieWidth)
  .attr('height', pieHeight)
  .append('g')
  .attr('transform', `translate(${pieWidth / 2},${pieHeight / 2})`);

const pie = d3.pie()
  .value(d => d.value)
  .sort(null);

const path = d3.arc()
  .outerRadius(radius - 10)
  .innerRadius(0);

const arc = pieSvg.selectAll('.arc')
  .data(pie(fakeData))
  .enter()
  .append('g')
  .attr('class', 'arc');

arc.append('path')
  .attr('d', path)
  .attr('fill', d => colorScale(d.data.category)); // Use colorScale to set the fill color

const label = d3.arc()
  .outerRadius((radius * 1.5) / Math.PI)
  .innerRadius((radius * 2) / Math.PI);

arc.append('text')
  .attr('transform', d => `translate(${label.centroid(d)})`)
  .attr('dy', '0.35em')
  .attr('text-anchor', 'middle')
  .style('fill', 'black') // Labels in black for good contrast
  .text(d => d.data.category);

// Add a title for the pie chart
pieSvg.append('text')
  .attr('x', 0)
  .attr('y', -radius - 10)
  .attr('text-anchor', 'middle')
  .style('font-size', '24px')
  .style('font-weight', 'bold')
  .style('fill', 'black') // Title in black for good contrast
  .text('Simple Pie Chart');

// Add a source credit for the pie chart
pieSvg.append('text')
  .attr('x', 0)
  .attr('y', radius + 20)
  .attr('text-anchor', 'middle')
  .style('font-size', '12px')
  .style('fill', 'gray')
  .text('Source: Example Data');
