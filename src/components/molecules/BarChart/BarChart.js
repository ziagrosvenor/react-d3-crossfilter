// @flow weak
/* eslint react/no-multi-comp: 'off' */

import React, {PureComponent} from 'react';
import NodeGroup from 'react-move/NodeGroup';
import {Surface} from '../../atoms'; // this is just a responsive SVG
import {scaleLinear, scaleBand} from 'd3-scale';
import {easeExpInOut} from 'd3-ease';
import {ascending, max} from 'd3-array';
import color from 'color';
import styled from 'styled-components';

const SELECTED_COLOR = '#00a7d8';
const DESELECTED_COLOR = color(SELECTED_COLOR)
  .alpha(0.5)
  .toString();

const Line = styled.line`
stroke:rgba(0,0,0, 0.5);
stroke-width:1;
`

// **************************************************
//  SVG Layout
// **************************************************
const view = [1000, 450]; // [width, height]
const trbl = [10, 10, 30, 10]; // [top, right, bottom, left] margins

const dims = [
  // Adjusted dimensions [width, height]
  view[0] - trbl[1] - trbl[3],
  view[1] - trbl[0] - trbl[2],
];

// const getKeyTextX = (bandwidth, keyLength) =>

export class BarChart extends PureComponent {
  y = scaleLinear()
    .range([dims[1], 0])
    .domain([0, max(this.props.data, d => d.value)]);

  scale = scaleBand()
    .rangeRound([0, dims[0]])
    .domain(this.props.data.map(d => d.key))
    .padding(0.1);

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
    const {y, scale} = this;
    const lines = []

          for(let i = 0; i < 6; i++) {
        lines.push(

        <React.Fragment>
                      <text
                        x={0}
                        y={dims[1] / 6 * i + 20}
                        fill="#333">
                        {Math.floor( this.props.maxValue / (i + 1) )}
                      </text>
        <Line key={i} x1="-20" x2={dims[0]} y1={dims[1] / 6 * i} y2={dims[1] / 6 * i}/>
      </React.Fragment>
        )}
    return (
      <div>
        <Surface view={view} trbl={trbl}>
          {lines}
          <NodeGroup
            data={this.props.data}
            keyAccessor={d => d.key}
            start={() => ({
              y: dims[1],
              width: scale.bandwidth(),
            })}
            enter={d => ({
              y: [y(d.value)],
              timing: {duration: 750, ease: easeExpInOut},
            })}
            update={(d, i) => ({
              y: [y(d.value)],
              width: scale.bandwidth(),
              timing: {
                duration: 750,
                delay: i * 50,
                ease: easeExpInOut,
              },
            })}
            leave={() => ({
              y: [y.range()[1]],
              timing: {duration: 750, ease: easeExpInOut},
            })}>
            {nodes => (
              <g>
                {nodes.map(({key, data, state}) => {
                  const {y, ...rest} = state;

                  return (
                    <g key={key} transform={`translate(${scale(data.key)},0)`}>
                      <rect
                        onClick={() => this.updateSelectedKeys(key)}
                        height={dims[1] - y}
                        y={y}
                        fill={
                          this.props.selectedKeys.includes(key) ||
                          this.props.selectedKeys.length === 0
                            ? SELECTED_COLOR
                            : DESELECTED_COLOR
                        }
                        {...rest}
                      />
                      <text
                        x={scale.bandwidth() / 2}
                        y={dims[1] + 15}
                        dx="-.35em"
                        fill="#333">
                        {data.key}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}
          </NodeGroup>
        </Surface>
      </div>
    );
  }
}
