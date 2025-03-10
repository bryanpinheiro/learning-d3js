// Declare the chart dimensions and margins.
const margin = {
  top: 70,
  right: 30,
  bottom: 40,
  left: 80,
};
const width = 1000 - (margin.left + margin.right);
const height = 500 - (margin.top + margin.bottom);

// Declare the x (horizontal position) scale.
const x = d3.scaleTime().range([0, width]);

// Declare the y (vertical position) scale.
const y = d3.scaleLinear().range([height, 0]);

// Create the SVG container.
const svg = d3
  .select("#line-graph-container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// create tooltip div
const tooltip = d3.select("body").append("div").attr("class", "tooltip");

// Load and Process Data
d3.csv("./data/jdi_data_daily.csv").then(function (data) {
  // Parse the date and convert the population to a number
  const parseDate = d3.timeParse("%Y-%m-%d");
  data.forEach((d) => {
    d.date = parseDate(d.date);
    d.population = +d.population;
  });

  console.log("population data: ", data);

  // Declare the x and y domains.
  x.domain(d3.extent(data, (d) => d.date));
  y.domain([85000, d3.max(data, (d) => d.population)]);

  // Add the x-axis.
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .style("font-size", "14px")
    .call(
      d3
        .axisBottom(x)
        .tickValues(x.ticks(d3.timeMonth.every(6)))
        .tickFormat(d3.timeFormat("%b %Y"))
    )
    .call((g) => g.select(".domain").remove())
    .selectAll(".tick line")
    .style("stroke-opacity", 0);
  svg.selectAll(".tick text").attr("fill", "#777");

  // Add the y-axis.
  svg
    .append("g")
    .style("font-size", "14px")
    .call(
      d3
        .axisLeft(y)
        .ticks((d3.max(data, (d) => d.population) - 65000) / 5000)
        .tickFormat((d) => {
          return `${(d / 1000).toFixed(0)}k`;
        })
        .tickSize(0)
        .tickPadding(10)
    )
    .call((g) => g.select(".domain").remove())
    .selectAll(".tick text")
    .style("fill", "#777")
    .style("visibility", (d, i, nodes) => {
      if (i === 0) {
        return "hidden";
      } else {
        return "visible";
      }
    });

  // Add vertical gridlines
  svg
    .selectAll("xGrid")
    .data(x.ticks().slice(1))
    .join("line")
    .attr("x1", (d) => x(d))
    .attr("x2", (d) => x(d))
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "#e0e0e0")
    .attr("stroke-width", 0.5);

  // Add horizontal gridlines
  svg
    .selectAll("yGrid")
    .data(y.ticks((d3.max(data, (d) => d.population) - 65000) / 5000).slice(1))
    .join("line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", (d) => y(d))
    .attr("y2", (d) => y(d))
    .attr("stroke", "#e0e0e0")
    .attr("stroke-width", 0.5);

  // Create the line generator
  const line = d3
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d.population));

  // Add the line path to the SVG element
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1)
    .attr("d", line);

  // Add a circle element
  const circle = svg
    .append("circle")
    .attr("r", 0)
    .attr("fill", "steelblue")
    .style("stroke", "white")
    .attr("opacity", 0.7)
    .style("pointer-events", "none");

  // create a listening rectangle
  const listeningRect = svg
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .style('pointer-events', 'all')  
    .style('fill-opacity', 0)        
    .style('stroke-opacity', 0)      
    .style('z-index', 1);            

  // create the mouse move function
  listeningRect.on("mousemove", function (event) {
    const [xCoord] = d3.pointer(event, this);
    const bisectDate = d3.bisector((d) => d.date).left;
    const x0 = x.invert(xCoord);
    const i = bisectDate(data, x0, 1);
    const d0 = data[i - 1];
    const d1 = data[i];
    const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    const xPos = x(d.date);
    const yPos = y(d.population);

    // Update the circle position
    circle.attr("cx", xPos).attr("cy", yPos);

    // Add transition for the circle radius
    circle.transition().duration(50).attr("r", 5);

    // add in  our tooltip
    tooltip
      .style("display", "block")
      .style("left", `${xPos + 175}px`)
      .style("top", `${yPos + 250}px`)
      .html(
        `<strong>Date:</strong> ${d.date.toLocaleDateString()}<br><strong>Population:</strong> ${
          d.population !== undefined
            ? (d.population / 1000).toFixed(0) + "k"
            : "N/A"
        }`
      );
  });

  // listening rectangle mouse leave function
  listeningRect.on("mouseleave", function () {
    circle.transition().duration(50).attr("r", 0);

    tooltip.style("display", "none");
  });

  // Add Y-axis label
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "#777")
    .style("font-family", "sans-serif")
    .text("Total Population");

  // Add the chart title
  svg
    .append("text")
    .attr("class", "chart-title")
    .attr("x", margin.left - 115)
    .attr("y", margin.top - 100)
    .style("font-size", "24px")
    .style("font-weight", "bold")
    .style("font-family", "sans-serif")
    .text("Prison Populations in the US Have Trended Upward Since Summer 2020");

  // Add the source credit
  svg
    .append("text")
    .attr("class", "source-credit")
    .attr("x", width - 920)
    .attr("y", height + margin.bottom - 3)
    .style("font-size", "9px")
    .style("font-family", "sans-serif")
    .text("Source: jaildatainitiative.org");
});
