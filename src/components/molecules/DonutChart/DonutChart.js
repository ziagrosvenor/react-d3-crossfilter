// @flow weak
/* eslint react/no-multi-comp: 'off' */

import {scaleOrdinal} from 'd3-scale';
import {arc, pie} from 'd3-shape';
import {shuffle} from 'd3-array';
import {easeExpOut} from 'd3-ease';
import sortBy from 'lodash/sortBy';
import React, {PureComponent} from 'react';
import NodeGroup from 'react-move/NodeGroup';
import color from 'color';

import {Surface} from '../../atoms';
import {mockData} from './data';
import {getRandom, mid} from './utils';

const colors = scaleOrdinal().range([
  '#a6cee3',
  '#1f78b4',
  '#b2df8a',
  '#33a02c',
  '#fb9a99',
  '#e31a1c',
  '#fdbf6f',
  '#ff7f00',
  '#cab2d6',
  '#6a3d9a',
]);

// **************************************************
//  SVG Layout
// **************************************************
const view = [1000, 550]; // [width, height]
const trbl = [10, 10, 10, 10]; // [top, right, bottom, left] margins

const dims = [
  // Adjusted dimensions [width, height]
  view[0] - trbl[1] - trbl[3],
  view[1] - trbl[0] - trbl[2],
];

const radius = (dims[1] / 2) * 0.7;

const pieLayout = pie()
  .value(d => d.value)
  .sort(null);

const innerArcPath = arc()
  .innerRadius(radius * 0.4)
  .outerRadius(radius * 1.0);

const outerArcPath = arc()
  .innerRadius(radius * 1.2)
  .outerRadius(radius * 1.2);

function getArcs(data) {
  return pieLayout(sortBy(data, d => d.key));
}

const ARC_OPACITY = 0.9;

const Arc = ({startAngle, endAngle, fill, onClick}) => (
  <path
    onClick={onClick}
    d={innerArcPath({startAngle, endAngle})}
    fill={fill}
    opacity={ARC_OPACITY}
  />
);

const ArcLabel = ({startAngle, endAngle, labelText}) => {
  const angleStartEnd = {startAngle, endAngle};
  const p1 = outerArcPath.centroid({startAngle, endAngle});
  const p2 = [
    mid(angleStartEnd) ? p1[0] + radius * 0.5 : p1[0] - radius * 0.5,
    p1[1],
  ];
  const points = `${innerArcPath.centroid(
    angleStartEnd,
  )},${p1},${p2.toString()}`;

  return (
    <g>
      <text
        dy="4px"
        fontSize="12px"
        transform={`translate(${p2.toString()})`}
        textAnchor={mid(angleStartEnd) ? 'start' : 'end'}>
        {labelText}
      </text>
      <polyline fill="none" stroke="rgba(127,127,127,0.5)" points={points} />
    </g>
  );
};

export class DonutChart extends PureComponent {
  updateSelectedKeys = key => {
    if (this.props.selectedKeys.includes(key)) {
      this.props.onSelectKeysChange(
        this.props.selectedKeys.filter(selectedKey => selectedKey !== key),
      );
    } else {
      this.props.onSelectKeysChange(this.props.selectedKeys.concat([key]));
    }
  };
  render() {
    const arcs = getArcs(this.props.data)

    return (
      <div>
        <Surface view={view} trbl={trbl}>
          <g transform={`translate(${dims[0] / 2}, ${dims[1] / 2})`}>
            <NodeGroup
              data={arcs}
              keyAccessor={d => d.data.key}
              start={({startAngle}) => ({
                startAngle,
                endAngle: startAngle,
              })}
              enter={({endAngle}) => ({
                endAngle: [endAngle],
                timing: {duration: 500, delay: 350, ease: easeExpOut},
              })}
              update={({startAngle, endAngle}) => ({
                startAngle: [startAngle],
                endAngle: [endAngle],
                timing: {duration: 350, ease: easeExpOut},
              })}>
              {nodes => {
                return (
                  <g>
                    {nodes.map(({key, data, state}) => {
                      return (
                        <g key={key}>
                          <Arc
                            onClick={() => this.updateSelectedKeys(key)}
                            startAngle={state.startAngle}
                            endAngle={state.endAngle}
                            fill={
                          this.props.selectedKeys.includes(key) ||
                          this.props.selectedKeys.length === 0
                            ? colors(key)
                            : color(colors(key)).alpha(0.5).toString()
}
                          />
                          <ArcLabel
                            startAngle={state.startAngle}
                            endAngle={state.endAngle}
                            labelText={data.data.key}
                          />
                        </g>
                      );
                    })}
                  </g>
                );
              }}
            </NodeGroup>
          </g>
        </Surface>
      </div>
    );
  }
}
