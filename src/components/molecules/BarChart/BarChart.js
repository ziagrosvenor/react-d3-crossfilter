import React from 'react';
import {scaleOrdinal} from 'd3-scale';
import {arc as d3Arc, pie as d3Pie} from 'd3-shape';
import {csvParse} from 'd3-dsv';
import styled from 'styled-components';

const ArcPath = styled.path`
  stroke: #fff;
`;

const ArcText = styled.text`
  font: 10px sans-serif;
  text-anchor: middle;
`;

// Same as data.csv
const dataCsv = `age,population
<5,2704659
5-13,4499890
14-17,2159981
18-24,3853788
25-44,14106543
45-64,8819342
≥65,612463
`;

const width = 960,
  height = 500,
  radius = Math.min(width, height) / 2;

const color = scaleOrdinal().range([
  '#98abc5',
  '#8a89a6',
  '#7b6888',
  '#6b486b',
  '#a05d56',
  '#d0743c',
  '#ff8c00',
]);

const arc = d3Arc()
  .outerRadius(radius - 10)
  .innerRadius(radius - 70);

const pie = d3Pie()
  .sort(null)
  .value(function(d) {
    return d.population;
  });

const data = pie(
  csvParse(dataCsv, d => {
    d.population = +d.population;
    return d;
  }),
);

export const DonutChart = () => {
  return (
    <svg width={width} height={height}>
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {data.map(d => (
          <g key={`a${d.data.age}`}>
            <ArcPath d={arc(d)} fill={color(d.data.age)} />
            <ArcText transform={`translate(${arc.centroid(d)})`} dy=".35em">
              {d.data.age}
            </ArcText>
          </g>
        ))}
      </g>
    </svg>
  );
};
