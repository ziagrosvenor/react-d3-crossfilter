// @flow weak
/* eslint react/no-multi-comp: 'off' */

import {scaleOrdinal} from 'd3-scale';
import {arc, pie} from 'd3-shape';
import {shuffle} from 'd3-array';
import {easeExpOut} from 'd3-ease';
import sortBy from 'lodash/sortBy';
import React, {PureComponent} from 'react';
import NodeGroup from 'react-move/NodeGroup';

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

function getArcs() {
  const data = shuffle(mockData).map(({name}) => ({
    name,
    value: getRandom(10, 100),
  }));

  return pieLayout(sortBy(data, d => d.name));
}

const ARC_OPACITY = 0.9;

const Arc = ({state, fill}) => (
  <path d={innerArcPath(state)} fill={fill} opacity={ARC_OPACITY} />
);

const Text = ({transform, children, textAnchor}) => (
  <text dy="4px" fontSize="12px" transform={transform} textAnchor={textAnchor}>
    {children}
  </text>
);

export class DonutChart extends PureComponent {
  state = {
    arcs: getArcs(),
  };

  update = e => {
    e.preventDefault();
    e.stopPropagation();

    this.setState(() => ({
      arcs: getArcs(),
    }));
  };

  render() {
    const {arcs} = this.state;

    return (
      <div>
        <button onClick={this.update}>Update</button>
        <Surface view={view} trbl={trbl}>
          <g transform={`translate(${dims[0] / 2}, ${dims[1] / 2})`}>
            <NodeGroup
              data={arcs}
              keyAccessor={d => d.data.name}
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
                      const p1 = outerArcPath.centroid(state);
                      const p2 = [
                        mid(state)
                          ? p1[0] + radius * 0.5
                          : p1[0] - radius * 0.5,
                        p1[1],
                      ];
                      return (
                        <g key={key}>
                          <Arc state={state} fill={colors(data.data.name)} />
                          <Text
                            transform={`translate(${p2.toString()})`}
                            textAnchor={mid(state) ? 'start' : 'end'}>
                            {data.data.name}
                          </Text>

                          <polyline
                            fill="none"
                            stroke="rgba(127,127,127,0.5)"
                            points={`${innerArcPath.centroid(
                              state,
                            )},${p1},${p2.toString()}`}
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
