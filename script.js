const margin = { top: 60, right: 40, bottom: 50, left: 60 },
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

const svg = d3.select("#vis-container")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load CSV
d3.csv("data/cleaned_global_temp.csv").then(data => {
  data.forEach(d => {
    d.Year = +d.Year;
    d.Anomaly = +d.Anomaly;
  });

  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.Year))
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([d3.min(data, d => d.Anomaly) - 0.1, d3.max(data, d => d.Anomaly) + 0.1])
    .range([height, 0]);

  const line = d3.line()
    .x(d => x(d.Year))
    .y(d => y(d.Anomaly));

  // Axes
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  svg.append("g")
    .call(d3.axisLeft(y));

  // Line
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#e63946")
    .attr("stroke-width", 2)
    .attr("d", line);

  // Title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -30)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .text("Global Temperature Anomaly Over Time");

  // Annotations
  const annotations = [
    {
      note: {
        label: "Warmest year on record (1.23°C)",
        title: "2023",
        wrap: 120
      },
      x: x(2023),
      y: y(1.23),
      dx: -60,
      dy: -40
    },
    {
      note: {
        label: "Strong El Niño spike",
        title: "1998",
        wrap: 100
      },
      x: x(1998),
      y: y(0.63),
      dx: -40,
      dy: -50
    }
  ];

  const makeAnnotations = d3.annotation()
    .annotations(annotations);

  svg.append("g")
    .call(makeAnnotations);
});
