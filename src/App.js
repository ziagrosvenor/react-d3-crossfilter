import React, {Component} from 'react';
import '../node_modules/material-components-web/dist/material-components-web.min.css';
import styled from 'styled-components';
import {Grid, GridCell, GridInner} from '@rmwc/grid';
import crossfilter from 'crossfilter2';
import {csvParse} from 'd3-dsv';

import {TopAppBar, DonutChart, BarChart} from './components';

const RootContainer = styled.div``;
const ContentContainer = styled.div``;

function parseDate(d) {
  return new Date(
    2001,
    d.substring(0, 2) - 1,
    d.substring(2, 4),
    d.substring(4, 6),
    d.substring(6, 8),
  );
}

class App extends Component {
  state = {
    hours: null,
    loading: true,
  };
  async componentDidMount() {
    this.setState({loading: true});
    const response = await fetch('./flights.csv');
    const csvData = await response.text();
    const flights = csvParse(csvData, (d, i) => {
      d.index = i;
      d.date = parseDate(d.date);
      d.delay = +d.delay;
      d.distance = +d.distance;
      return d;
    });

    const flightsFilter = crossfilter(flights);
    const hour = flightsFilter.dimension(
      d => d.date.getHours() + d.date.getMinutes() / 60,
    );
    this.setState({
      loading: false,
      hours: hour.group(Math.floor),
    });
  }
  render() {
    return (
      <RootContainer>
        <TopAppBar />
        <ContentContainer>
          <Grid>
            <GridCell span="6">
              <DonutChart />
            </GridCell>
            <GridCell span="6">
              {this.state.loading ? (
                undefined
              ) : (
                <BarChart domain={[0, 24]} data={this.state.hours} />
              )}
            </GridCell>
          </Grid>
        </ContentContainer>
      </RootContainer>
    );
  }
}

export default App;
