import '../node_modules/material-components-web/dist/material-components-web.min.css';
import '@rmwc/circular-progress/circular-progress.css';
import '@material/typography/dist/mdc.typography.css'
import crossfilter from 'crossfilter2';
import {csvParse} from 'd3-dsv';
import {branch, renderComponent} from 'recompose';
import React, {Component} from 'react';
import styled from 'styled-components';
import {Grid, GridCell, GridInner} from '@rmwc/grid';
import {CircularProgress} from '@rmwc/circular-progress';
import {RMWCProvider} from '@rmwc/provider';
import { Typography } from '@rmwc/typography';

import {TopAppBar, BarChart, DonutChart} from './components';

const spinnerWhileLoading = isLoading =>
  branch(isLoading, renderComponent(() => <CircularProgress size={72} />));

const BarChartWithSpinner = spinnerWhileLoading(({loading}) => loading)(
  BarChart,
);

const DonutChartWithSpinner = spinnerWhileLoading(({loading}) => loading)(
  DonutChart,
);

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

const groupDistance = d => Math.floor(d / 100) * 100;
const groupHours = Math.floor;
const groupDelays = (d) =>  Math.floor(d / 50) * 50

class App extends Component {
  state = {
    hours: null,
    loading: true,
  };
  async componentDidMount() {
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
    const hours = hour.group(groupHours);
    const distance = flightsFilter.dimension(d => Math.min(1999, d.distance));
    const distances = distance.group(groupDistance);
    const delay = flightsFilter.dimension((d) => Math.max(-60, Math.min(149, d.delay)))
    this.delay = delay
    this.delays = delay.group(groupDelays)

    const allHours = hours.all();
    const allDistances = distances.all();
    const allDelays = this.delays.all();

    this.setState({
      loading: false,
      hour,
      hours,
      distance,
      distances,
      allHours,
      maxHours: hours.top(1)[0].value,
      maxDistances: distances.top(1)[0].value,
      selectedHourKeys: [],
      allDistances,
      selectedDistanceKeys: [],
      allDelays,
      selectedDelayKeys: []
    });
  }

  setSelectedHourKeys = selectedKeys => {
    if (selectedKeys.length === 0) {
      this.state.hour.filterAll();
    } else {
      this.state.hour.filter(d => selectedKeys.includes(groupHours(d)));
    }

    this.setState({
      selectedHourKeys: selectedKeys,
      allDistances: [...this.state.distances.all()],
      allDelays: [...this.delays.all()]
    });
  };

  setSelectedDistanceKeys = selectedKeys => {
    if (selectedKeys.length === 0) {
      this.state.distance.filterAll();
    } else {
      this.state.distance.filter(d => selectedKeys.includes(groupDistance(d)));
    }

    this.setState({
      selectedDistanceKeys: selectedKeys,
      allHours: [...this.state.hours.all()],
      allDelays: [...this.delays.all()]
    });
  };

  setSelectedDelayKeys = selectedKeys => {
    if (selectedKeys.length === 0) {
      this.delay.filterAll();
    } else {
      this.delay.filter(d => selectedKeys.includes(groupDistance(d)));
    }

    this.setState({
      selectedDelayKeys: selectedKeys,
      allHours: [...this.state.hours.all()],
      allDistances: [...this.state.distances.all()],
    });
  };

  render() {
    return (
      <RMWCProvider>
        <TopAppBar />
        <ContentContainer>
          <Grid>
            <GridCell span="6">
              <BarChartWithSpinner
                onSelectKeysChange={this.setSelectedDistanceKeys}
                selectedKeys={this.state.selectedDistanceKeys}
                maxValue={this.state.maxDistances}
                loading={this.state.loading}
                data={this.state.allDistances}
              />
              <Typography use="headline6">Distance kilometers</Typography>
            </GridCell>
            <GridCell span="6">
              <BarChartWithSpinner
                onSelectKeysChange={this.setSelectedHourKeys}
                selectedKeys={this.state.selectedHourKeys}
                maxValue={this.state.maxHours}
                loading={this.state.loading}
                data={this.state.allHours}
              />
              <Typography use="headline6">Duration hours</Typography>
            </GridCell>
            <GridCell span="6">
              <DonutChartWithSpinner
                loading={this.state.loading}
                data={this.state.allDelays}
                onSelectKeysChange={this.setSelectedDelayKeys}
                selectedKeys={this.state.selectedDelayKeys}
              />
              <Typography use="headline6">Delay minutes</Typography>
            </GridCell>
          </Grid>
        </ContentContainer>
      </RMWCProvider>
    );
  }
}

export default App;
