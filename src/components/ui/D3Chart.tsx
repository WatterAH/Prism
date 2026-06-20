import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { ChartPoint } from "../../types";

interface Props {
  data: ChartPoint[];
  width?: number;
  height?: number;
}

export function D3Chart({ data, width = 340, height = 250 }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const maxLabelLen = Math.max(...data.map((d) => d.label.length));
    const rotate = data.length > 3 || maxLabelLen > 7;
    const bottomMargin = rotate ? 70 : 40;
    const margin = { top: 20, right: 16, bottom: bottomMargin, left: 44 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.25);

    const maxVal = d3.max(data, (d) => d.value) ?? 0;
    const y = d3
      .scaleLinear()
      .domain([0, maxVal * 1.15])
      .range([innerHeight, 0]);

    // X axis
    const xAxis = g
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));
    xAxis.selectAll("text")
      .style("font-size", "10px")
      .style("fill", "#737373")
      .attr("transform", rotate ? "rotate(-35)" : null)
      .attr("dx", rotate ? "-0.5em" : null)
      .attr("dy", rotate ? "0.25em" : null)
      .style("text-anchor", rotate ? "end" : "middle");
    xAxis.selectAll("path, line").style("stroke", "#d4d4d4");

    // Y axis
    const yAxis = g.append("g").call(d3.axisLeft(y).ticks(5));
    yAxis.selectAll("text").style("font-size", "10px").style("fill", "#737373");
    yAxis.selectAll("path, line").style("stroke", "#d4d4d4");

    // Bars
    g.selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.label) ?? 0)
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => innerHeight - y(d.value))
      .attr("fill", "#16140f")
      .attr("rx", 2);

    // Value labels on top of bars
    g.selectAll(".bar-label")
      .data(data)
      .join("text")
      .attr("class", "bar-label")
      .attr("x", (d) => (x(d.label) ?? 0) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 4)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("fill", "#16140f")
      .style("font-weight", "600")
      .text((d) => d.value);
  }, [data, width, height]);

  return <svg ref={svgRef} style={{ overflow: "visible" }} />;
}
