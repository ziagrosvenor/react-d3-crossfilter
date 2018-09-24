// @flow weak
/* eslint react/no-multi-comp: 'off' */

import React, {PureComponent} from 'react';
import NodeGroup from 'react-move/NodeGroup';
import {Surface} from '../../atoms'; // this is just a responsive SVG
import {scaleLinear, scaleBand} from 'd3-scale';
import {easeExpInOut} from 'd3-ease';
import {ascending, max} from 'd3-array';

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

export class BarChart extends PureComponent {
  state = {
    sortAlpha: true,
  };

  update = () => {
    this.setState(state => ({
      sortAlpha: !state.sortAlpha,
    }));
  };

  componentDidMount() {}

  render() {
    const {sortAlpha} = this.state;
    const y = scaleLinear()
      .range([dims[1], 0])
      .domain([0, max(this.props.data.all(), d => d.value)]);

    const scale = scaleBand()
      .rangeRound([0, dims[0]])
      .domain(this.props.data.all().map(d => d.key))
      .padding(0.1);

    return (
      <div>
        <Surface view={view} trbl={trbl}>
          <NodeGroup
            data={this.props.data.all()}
            keyAccessor={d => d.key}
            start={() => ({
              opacity: 1e-6,
              y: 1e-6,
              width: scale.bandwidth(),
            })}
            enter={d => ({
              opacity: [0.7],
              y: [y(d.value)],
              timing: {duration: 750, ease: easeExpInOut},
            })}
            update={(d, i) => ({
              opacity: [0.7],
              y: [y(d.value)],
              width: [scale.bandwidth()],
              timing: {duration: 750, delay: i * 50, ease: easeExpInOut},
            })}
            leave={() => ({
              opacity: [1e-6],
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
                        height={dims[1] - y}
                        y={y}
                        fill="#00a7d8"
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
