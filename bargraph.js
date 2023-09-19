const svgWidth = 1000;
const svgHeight = 500;

// Declare the chart dimensions and margins.
const margin = {
  top: 70,
  right: 30,
  bottom: 40,
  left: 80,
};
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

const svg = d3.select('#bar-graph-container').append('svg').attr('width', svgWidth).attr('height', svgHeight);

const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

d3.csv('./data/tempo-medio-de-importacao.csv').then(data => {
  // Parse dates if needed
  // const parseDate = d3.timeParse('%Y-%m-%d');
  data.forEach(d => {
    d.Date = d.ANO;

    const valueWithDot = (d.TMBDI).replace(',', '.');
    const decimalValue = parseFloat(valueWithDot);
    d.Value = decimalValue; // Convert the value to a number
  });

  console.log("data: ", data);

  const xScale = d3
    .scaleBand()
    .domain(data.map(d => d.Date))
    .range([0, chartWidth])
    .padding(0.1);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.Value)])
    .nice()
    .range([chartHeight, 0]);

  g.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', d => xScale(d.Date))
    .attr('y', d => yScale(d.Value))
    .attr('width', xScale.bandwidth())
    .attr('height', d => chartHeight - yScale(d.Value))
    .attr('fill', 'steelblue');

  g.append('g')
    .attr('transform', `translate(0,${chartHeight})`)
    .call(d3.axisBottom(xScale).tickSize(0));

  g.append('g').call(d3.axisLeft(yScale).ticks(5));

  // Add x-axis label
  svg
    .append('text')
    .attr('x', svgWidth / 2)
    .attr('y', svgHeight - 5)
    .attr('text-anchor', 'middle')
    .text('Year');

  // Add y-axis label
  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', margin.left - 50)
    .attr('x', 0 - svgHeight / 2)
    .attr('text-anchor', 'middle')
    .text('Average Import Time (Hours)');
  
    // Add the chart title
    svg
    .append("text")
    .attr("class", "chart-title")
    .attr("x", margin.left - 20)
    .attr("y", margin.top - 40)
    .style("font-size", "24px")
    .style("font-weight", "bold")
    .style("font-family", "sans-serif")
    .text("Average Import Time in Brazil Since 2015");

  // Add the source credit
  svg
    .append("text")
    .attr("class", "source-credit")
    .attr("x", margin.left - 20)
    .attr("y", svgHeight - 10)
    .style("font-size", "9px")
    .style("font-family", "sans-serif")
    .text("Source: dados.gov.br");
});
