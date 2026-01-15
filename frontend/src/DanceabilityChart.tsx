import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const DanceabilityChart = ({
  data,
  width,
  height,
  margin,
}: {
  data: any;
  width: any;
  height: any;
  margin: any;
}) => {
  const d3Container = useRef(null);
  console.log("data on barchart", data);
  useEffect(() => {
    // Clear out previous renders
    d3.select(d3Container.current).selectAll("*").remove();

    // Set width and height
    const svg = d3
      .select(d3Container.current)
      .attr("width", width)
      .attr("height", height);

    const boundsWidth = width - margin;
    const boundsHeight = height - margin;

    const bounds = svg
      .append("g")
      .style("transform", `translate(${margin}px, ${margin}px)`);

    // Assuming data points are objects with 'x' and 'y' properties
    const xScale = d3.scaleLinear().domain([0, 1]).range([0, boundsWidth]);
    const yScale = d3.scaleLinear().domain([1, 0]).range([boundsHeight, 0]); // Invert y-axis for SVG coordinates

    // 3. Draw Points
    bounds
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d: any) => xScale(d.x))
      .attr("cy", (d: any) => yScale(d.y))
      .attr("r", 5) // Radius of the circle
      .attr("fill", "steelblue");
  }, [data]); // Add data as a dependency to re-run effect when data changes

  return (
    <>
      <svg style={{ border: "1px solid black" }} ref={d3Container}></svg>
    </>
  );
};

export default DanceabilityChart;
