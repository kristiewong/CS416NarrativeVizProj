// const margin = { top: 60, right: 40, bottom: 70, left: 70 },
//   width = 800 - margin.left - margin.right,
//   height = 500 - margin.top - margin.bottom;

// let currentScene = 0;
// let data;

// const scenes = [scene1, scene2, scene3, scene4];

// d3.csv("data/global_temp.csv", d => ({
//   Year: +d.Year,
//   Anomaly: +d.Anomaly
// })).then(loadedData => {
//   data = loadedData;
//   renderScene();
//   setupButtons();
// });

// function renderScene() {
//   d3.select("#vis-container").html("");

//   const svg = d3.select("#vis-container")
//     .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom);

//   const g = svg.append("g")
//     .attr("transform", `translate(${margin.left},${margin.top})`);

//   scenes[currentScene](g, data);
// }

// function setupButtons() {
//   const navDiv = d3.select("#nav-buttons");

//   navDiv.html("");

//   navDiv.append("button")
//     .attr("id", "prev")
//     .text("← Previous")
//     .style("font-size", "18px")
//     .style("margin-right", "15px")
//     .on("click", () => navigateScene("prev"));

//   navDiv.append("button")
//     .attr("id", "next")
//     .text("Next →")
//     .style("font-size", "18px")
//     .on("click", () => navigateScene("next"));
// }

// function navigateScene(direction) {
//   const svg = d3.select("#vis-container svg");
//   svg.transition()
//     .duration(400)
//     .style("opacity", 0)
//     .on("end", () => {
//       if (direction === "next") {
//         currentScene = Math.min(currentScene + 1, scenes.length - 1);
//       } else {
//         currentScene = Math.max(currentScene - 1, 0);
//       }
//       renderScene();
//       d3.select("#vis-container svg")
//         .style("opacity", 0)
//         .transition()
//         .duration(400)
//         .style("opacity", 1);
//     });
// }

// // ========== Scene 1 ==========
// // Full time series line chart + annotations
// function scene1(svg, data) {
//   const x = d3.scaleLinear()
//     .domain(d3.extent(data, d => d.Year))
//     .range([0, width]);

//   const y = d3.scaleLinear()
//     .domain([
//       d3.min(data, d => d.Anomaly) - 0.1,
//       d3.max(data, d => d.Anomaly) + 0.1
//     ])
//     .range([height, 0]);

//   // Axes
//   svg.append("g")
//     .attr("transform", `translate(0,${height})`)
//     .call(d3.axisBottom(x).tickFormat(d3.format("d")));

//   svg.append("g")
//     .call(d3.axisLeft(y));

//   // Axes Titles
//   svg.append("text")
//     .attr("class", "x axis-label")
//     .attr("x", width / 2)
//     .attr("y", height + 50)
//     .attr("text-anchor", "middle")
//     .style("font-size", "14px")
//     .text("Year");

//   svg.append("text")
//     .attr("class", "y axis-label")
//     .attr("x", -height / 2)
//     .attr("y", -50)
//     .attr("text-anchor", "middle")
//     .attr("transform", "rotate(-90)")
//     .style("font-size", "14px")
//     .text("Temperature Anomaly (°C)");

//   // Line path
//   const line = d3.line()
//     .x(d => x(d.Year))
//     .y(d => y(d.Anomaly));

//   svg.append("path")
//     .datum(data)
//     .attr("fill", "none")
//     .attr("stroke", "#e63946")
//     .attr("stroke-width", 2)
//     .attr("d", line);

//   // Title
//   svg.append("text")
//     .attr("x", width / 2)
//     .attr("y", -30)
//     .attr("text-anchor", "middle")
//     .style("font-size", "20px")
//     .style("font-weight", "bold")
//     .text("Global Temperature Anomaly Over Time");

//   // Annotations
//   const annotations = [
//     {
//       note: {
//         title: "2023: Warmest Year",
//         label: "The highest recorded temperature anomaly at 1.23°C above baseline",
//         wrap: 180
//       },
//       x: x(2023),
//       y: y(1.23),
//       dx: -170,
//       dy: 0,
//       color: "#FF0000"
//     },
//     {
//       note: {
//         title: "1998: Strong El Niño",
//         label: "A significant spike caused by El Niño weather phenomenon",
//         wrap: 180
//       },
//       x: x(1998),
//       y: y(0.63),
//       dx: -200,
//       dy: 0,
//       color: "#FF0000"
//     },
//     {
//       note: {
//         title: "Mid-Century Plateau",
//         label: "A temporary flattening of the temperature anomaly trend during 1940–1970",
//         wrap: 200
//       },
//       x: x(1955),
//       y: y(0.0),
//       dx: -200,
//       dy: -1,
//       color: "#0000FF"
//     }
//   ];

//   const makeAnnotations = d3.annotation()
//     .type(d3.annotationLabel)
//     .annotations(annotations);

//   svg.append("g")
//     .call(makeAnnotations)
//     .style("font-size", "13px");
// }

// // ========== Scene 2 ==========
// // Decadal average bar chart to show long-term trends
// function scene2(svg, data) {
//   // Calculate decadal averages
//   const decadeMap = {};
//   data.forEach(d => {
//     const decade = Math.floor(d.Year / 10) * 10;
//     if (!decadeMap[decade]) decadeMap[decade] = { sum: 0, count: 0 };
//     decadeMap[decade].sum += d.Anomaly;
//     decadeMap[decade].count += 1;
//   });

//   const decadalData = Object.entries(decadeMap).map(([decade, val]) => ({
//     decade: +decade,
//     anomaly: val.sum / val.count
//   })).sort((a, b) => a.decade - b.decade);

//   const x = d3.scaleBand()
//     .domain(decadalData.map(d => d.decade))
//     .range([0, width])
//     .padding(0.15);

//   const y = d3.scaleLinear()
//     .domain([
//       d3.min(decadalData, d => d.anomaly) - 0.1,
//       d3.max(decadalData, d => d.anomaly) + 0.1
//     ])
//     .range([height, 0]);

//   // Axes
//   svg.append("g")
//     .attr("transform", `translate(0,${height})`)
//     .call(d3.axisBottom(x).tickFormat(d => `${d}s`));

//   svg.append("g")
//     .call(d3.axisLeft(y));

//   // Axes Titles
//   svg.append("text")
//     .attr("class", "x axis-label")
//     .attr("x", width / 2)
//     .attr("y", height + 50)
//     .attr("text-anchor", "middle")
//     .style("font-size", "14px")
//     .text("Decade");

//   svg.append("text")
//     .attr("class", "y axis-label")
//     .attr("x", -height / 2)
//     .attr("y", -50)
//     .attr("text-anchor", "middle")
//     .attr("transform", "rotate(-90)")
//     .style("font-size", "14px")
//     .text("Average Temperature Anomaly (°C)");

//   // Bars
//   svg.selectAll("rect")
//     .data(decadalData)
//     .enter()
//     .append("rect")
//     .attr("x", d => x(d.decade))
//     .attr("y", d => y(d.anomaly))
//     .attr("width", x.bandwidth())
//     .attr("height", d => height - y(d.anomaly))
//     .attr("fill", "#1d3557");

//   // Title
//   svg.append("text")
//     .attr("x", width / 2)
//     .attr("y", -30)
//     .attr("text-anchor", "middle")
//     .style("font-size", "20px")
//     .style("font-weight", "bold")
//     .text("Average Global Temperature Anomaly by Decade");

//   // // Narrative label
//   // svg.append("text")
//   //   .attr("x", width / 2)
//   //   .attr("y", -10)
//   //   .attr("text-anchor", "middle")
//   //   .style("font-style", "italic")
//   //   .style("font-size", "13px")
//   //   .text("This chart shows long-term warming trends smoothed by decade.");

//   const annotations = [
//     {
//       note: {
//         title: "2010s: Highest Average",
//         label: "Average anomaly crosses 0.8°C, showing recent warming",
//         wrap: 170
//       },
//         x: x(2010),
//         y: y(0.8),
//         dx: -130,
//         dy: 0,
//         color: "#FF0000",
//       },
//       {
//         note: {
//           title: "Mid-Century Plateau",
//           label: "1940s-1970s decades show little warming",
//           wrap: 170
//         },
//           x: x(1960),
//           y: y(0.0),
//           dx: 0,
//           dy: -50,
//           color: "#0000FF",
//         }
//     ];
//   const makeAnnotations = d3.annotation()
//     .type(d3.annotationLabel)
//     .annotations(annotations);

//   svg.append("g")
//     .call(makeAnnotations)
//     .style("font-size", "13px");
// }

// // ========== Scene 3 ==========
// // Recent trends since 2000 focus with line chart
// function scene3(svg, data) {
//   const recent = data.filter(d => d.Year >= 2000);

//   const x = d3.scaleLinear()
//     .domain(d3.extent(recent, d => d.Year))
//     .range([0, width]);

//   const y = d3.scaleLinear()
//     .domain([
//       d3.min(recent, d => d.Anomaly) - 0.1,
//       d3.max(recent, d => d.Anomaly) + 0.1
//     ])
//     .range([height, 0]);

//   // Axes
//   svg.append("g")
//     .attr("transform", `translate(0,${height})`)
//     .call(d3.axisBottom(x).tickFormat(d3.format("d")));

//   svg.append("g")
//     .call(d3.axisLeft(y));

//   // Axes Titles
//   svg.append("text")
//     .attr("class", "x axis-label")
//     .attr("x", width / 2)
//     .attr("y", height + 50)
//     .attr("text-anchor", "middle")
//     .style("font-size", "14px")
//     .text("Year");

//   svg.append("text")
//     .attr("class", "y axis-label")
//     .attr("x", -height / 2)
//     .attr("y", -50)
//     .attr("text-anchor", "middle")
//     .attr("transform", "rotate(-90)")
//     .style("font-size", "14px")
//     .text("Temperature Anomaly (°C)");

//   // Line
//   const line = d3.line()
//     .x(d => x(d.Year))
//     .y(d => y(d.Anomaly));

//   svg.append("path")
//     .datum(recent)
//     .attr("fill", "none")
//     .attr("stroke", "#457b9d")
//     .attr("stroke-width", 2)
//     .attr("d", line);

//   // Title
//   svg.append("text")
//     .attr("x", width / 2)
//     .attr("y", -30)
//     .attr("text-anchor", "middle")
//     .style("font-size", "20px")
//     .style("font-weight", "bold")
//     .text("Temperature Trends Since 2000");

//   // Narrative label
//   svg.append("text")
//     .attr("x", width / 2)
//     .attr("y", height + 80)
//     .attr("text-anchor", "middle")
//     .style("font-style", "italic")
//     .style("font-size", "13px")
//     .text("Notice the sharp increase in temperature anomalies over the last two decades.");
    
//   const annotations = [
//       {
//         note: {
//           title: "Rapid Rise Since 2010",
//           label: "Temperature anomalies sharply increase in the last decade",
//           wrap: 170
//         },
//           x: x(2022),
//           y: y(1.0),
//           dx: -50,
//           dy: -50,
//           color: "#FF0000",
//         },
//         {
//           note: {
//             title: "2016 Record Spike",
//             label: "A spike linked to strong El Niño event",
//             wrap: 170
//           },
//             x: x(2016),
//             y: y(1.0),
//             dx: -100,
//             dy: -50,
//             color: "#FF0000",
//           },
//           {
//             note: {
//               title: "Early 2000s Plateau",
//               label: "Despite continued emissions, global temperatures leveled briefly due to natural variability.",
//               wrap: 170
//             },
//             x: x(2006),
//             y: y(0.68), // average anomaly in that range
//             dx: 0,
//             dy: -50,
//             color: "#0000FF" // muted gray to imply context, not emergency
//           }
//       ];
//     const makeAnnotations = d3.annotation()
//       .type(d3.annotationLabel)
//       .annotations(annotations);
  
//     svg.append("g")
//       .call(makeAnnotations)
//       .style("font-size", "13px");
// }


// // ========== Scene 4 ========== (Free Exploration)
// function scene4() {
//   d3.selectAll(".scene-group").style("display", "none");
//   d3.select("#explore-controls").style("display", "block");

//   const svg = d3.select("#explore-svg");
//   svg.selectAll("*").remove(); // Clear previous content

//   let filteredData = data.filter(d => d.Year <= 2023);
//   let currentType = "line";

//   function updateExploreChart(yearLimit, type) {
//     const exploreData = data.filter(d => d.Year <= yearLimit);

//     const x = d3.scaleLinear()
//       .domain(d3.extent(exploreData, d => d.Year))
//       .range([0, width]);

//     const y = d3.scaleLinear()
//       .domain([d3.min(exploreData, d => d.Anomaly) - 0.1, d3.max(exploreData, d => d.Anomaly) + 0.1])
//       .range([height, 0]);

//     svg.selectAll("*").remove();

//     // Axes
//     svg.append("g")
//       .attr("transform", `translate(0,${height})`)
//       .call(d3.axisBottom(x).tickFormat(d3.format("d")));

//     svg.append("g")
//       .call(d3.axisLeft(y));

//     svg.append("text")
//       .attr("x", width / 2)
//       .attr("y", -30)
//       .attr("text-anchor", "middle")
//       .style("font-size", "18px")
//       .text(`Explore: Temperature Anomalies (${type === "line" ? "Line" : "Bar"} Chart)`);

//     svg.append("text")
//       .attr("x", width / 2)
//       .attr("y", height + 40)
//       .attr("text-anchor", "middle")
//       .text("Year");

//     svg.append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("x", -height / 2)
//       .attr("y", -45)
//       .attr("text-anchor", "middle")
//       .text("Temperature Anomaly (°C)");

//     if (type === "line") {
//       const line = d3.line()
//         .x(d => x(d.Year))
//         .y(d => y(d.Anomaly));

//       svg.append("path")
//         .datum(exploreData)
//         .attr("fill", "none")
//         .attr("stroke", "#1d3557")
//         .attr("stroke-width", 2)
//         .attr("d", line);
//     } else {
//       svg.selectAll(".bar")
//         .data(exploreData)
//         .enter()
//         .append("rect")
//         .attr("class", "bar")
//         .attr("x", d => x(d.Year) - 2)
//         .attr("y", d => y(d.Anomaly))
//         .attr("width", 4)
//         .attr("height", d => height - y(d.Anomaly))
//         .attr("fill", "#457b9d");
//     }
//   }

//   // Initial render
//   updateExploreChart(2023, currentType);

//   // Handle range slider
//   d3.select("#yearRange").on("input", function () {
//     const selectedYear = +this.value;
//     d3.select("#yearLabel").text(`Up to ${selectedYear}`);
//     updateExploreChart(selectedYear, currentType);
//   });

//   // Handle toggle chart type
//   d3.select("#chartToggle").on("click", function () {
//     currentType = currentType === "line" ? "bar" : "line";
//     this.textContent = `Switch to ${currentType === "line" ? "Bar" : "Line"} Chart`;
//     updateExploreChart(+d3.select("#yearRange").property("value"), currentType);
//   });
// }

let currentScene = 0;
let data = [];
let svg, xScale, yScale;
let chartMode = "line"; // for Scene 4 toggle

const margin = { top: 60, right: 40, bottom: 60, left: 70 };
const width = 900 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svgContainer = d3
  .select("#chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

svg = svgContainer.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("data.csv", d3.autoType).then((csv) => {
  data = csv.filter((d) => !isNaN(d.Year) && !isNaN(d.Anomaly));
  showScene(currentScene);
});

// Shared axis scales
function setScales(xDomain, yDomain) {
  xScale = d3.scaleLinear().domain(xDomain).range([0, width]);
  yScale = d3.scaleLinear().domain(yDomain).range([height, 0]);
}

// Clear SVG
function clearScene() {
  svg.selectAll("*").remove();
  d3.select("#explore-controls").style("display", "none");
}

// Render Scene 1: Line chart with annotations
function renderScene1() {
  clearScene();

  setScales(d3.extent(data, (d) => d.Year), d3.extent(data, (d) => d.Anomaly));

  // Line generator
  const line = d3
    .line()
    .x((d) => xScale(d.Year))
    .y((d) => yScale(d.Anomaly));

  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line)
    .attr("opacity", 0)
    .transition()
    .duration(1000)
    .attr("opacity", 1);

  // Axes
  svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale));
  svg.append("g").call(d3.axisLeft(yScale));

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .text("Year");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .text("Temperature Anomaly (°C)");

  // Annotation: 2023 hottest year
  const anno2023 = data.find((d) => d.Year === 2023);
  if (anno2023) {
    svg
      .append("circle")
      .attr("cx", xScale(anno2023.Year))
      .attr("cy", yScale(anno2023.Anomaly))
      .attr("r", 5)
      .attr("fill", "red");

    svg
      .append("text")
      .attr("x", xScale(anno2023.Year) - 80)
      .attr("y", yScale(anno2023.Anomaly) - 20)
      .attr("fill", "red")
      .text("2023: Warmest on record");
  }
}

// Scene 2: Bar chart by decade
function renderScene2() {
  clearScene();

  const decadeMap = d3.rollup(
    data,
    (v) => d3.mean(v, (d) => d.Anomaly),
    (d) => Math.floor(d.Year / 10) * 10
  );
  const decades = Array.from(decadeMap, ([decade, anomaly]) => ({ decade, anomaly }));

  setScales(
    [d3.min(decades, (d) => d.decade) - 5, d3.max(decades, (d) => d.decade) + 5],
    d3.extent(decades, (d) => d.anomaly)
  );

  svg
    .selectAll("rect")
    .data(decades)
    .join("rect")
    .attr("x", (d) => xScale(d.decade))
    .attr("y", (d) => yScale(d.anomaly))
    .attr("width", width / decades.length - 5)
    .attr("height", (d) => height - yScale(d.anomaly))
    .attr("fill", "darkorange")
    .attr("opacity", 0)
    .transition()
    .duration(800)
    .attr("opacity", 1);

  svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale).tickFormat(d3.format("d")));
  svg.append("g").call(d3.axisLeft(yScale));

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .text("Decade");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .text("Avg Temp Anomaly (°C)");

  svg
    .append("text")
    .attr("x", width - 200)
    .attr("y", 30)
    .attr("fill", "darkorange")
    .text("Trend: Increasing heat by decade");
}

// Scene 3: Zoom into 2000s+
function renderScene3() {
  clearScene();

  const recentData = data.filter((d) => d.Year >= 2000);
  setScales(d3.extent(recentData, (d) => d.Year), d3.extent(recentData, (d) => d.Anomaly));

  const line = d3
    .line()
    .x((d) => xScale(d.Year))
    .y((d) => yScale(d.Anomaly));

  svg
    .append("path")
    .datum(recentData)
    .attr("fill", "none")
    .attr("stroke", "crimson")
    .attr("stroke-width", 2)
    .attr("d", line)
    .attr("opacity", 0)
    .transition()
    .duration(1000)
    .attr("opacity", 1);

  svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale));
  svg.append("g").call(d3.axisLeft(yScale));

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .text("Year");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .text("Temperature Anomaly (°C)");

  svg
    .append("text")
    .attr("x", 20)
    .attr("y", 10)
    .attr("fill", "crimson")
    .text("Recent years show rapid warming trend");
}

// Scene 4: Interactive explore mode
function renderScene4() {
  clearScene();
  d3.select("#explore-controls").style("display", "block");

  const maxYear = d3.max(data, (d) => d.Year);
  d3.select("#yearRange").attr("max", maxYear).attr("value", maxYear);
  d3.select("#yearLabel").text(`Up to ${maxYear}`);

  updateExploreChart(maxYear);

  d3.select("#yearRange").on("input", function () {
    const year = +this.value;
    d3.select("#yearLabel").text(`Up to ${year}`);
    updateExploreChart(year);
  });

  d3.select("#chartToggle").on("click", function () {
    chartMode = chartMode === "line" ? "bar" : "line";
    d3.select(this).text(chartMode === "line" ? "Switch to Bar Chart" : "Switch to Line Chart");
    updateExploreChart(+d3.select("#yearRange").property("value"));
  });
}

function updateExploreChart(maxYear) {
  const filtered = data.filter((d) => d.Year <= maxYear);

  setScales(d3.extent(filtered, (d) => d.Year), d3.extent(filtered, (d) => d.Anomaly));
  svg.selectAll("*").remove();

  if (chartMode === "line") {
    const line = d3
      .line()
      .x((d) => xScale(d.Year))
      .y((d) => yScale(d.Anomaly));

    svg
      .append("path")
      .datum(filtered)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 2)
      .attr("d", line);
  } else {
    svg
      .selectAll("rect")
      .data(filtered)
      .join("rect")
      .attr("x", (d) => xScale(d.Year))
      .attr("y", (d) => yScale(d.Anomaly))
      .attr("width", 2)
      .attr("height", (d) => height - yScale(d.Anomaly))
      .attr("fill", "green");
  }

  svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale));
  svg.append("g").call(d3.axisLeft(yScale));

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .text("Year");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .text("Temperature Anomaly (°C)");
}

// Scene navigation
function showScene(index) {
  currentScene = index;
  d3.select("#explore-controls").style("display", "none");

  if (index === 0) renderScene1();
  else if (index === 1) renderScene2();
  else if (index === 2) renderScene3();
  else if (index === 3) renderScene4();
}

const totalScenes = 4;
d3.select("#nextBtn").on("click", () => {
  if (currentScene < totalScenes - 1) showScene(currentScene + 1);
});
d3.select("#prevBtn").on("click", () => {
  if (currentScene > 0) showScene(currentScene - 1);
});
