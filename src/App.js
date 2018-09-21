import React, {Component} from 'react';
import '../node_modules/material-components-web/dist/material-components-web.min.css';
import styled from 'styled-components';
import {Grid, GridCell, GridInner} from '@rmwc/grid';

import {TopAppBar, DonutChart, BarChart} from './components';

const RootContainer = styled.div``;
const ContentContainer = styled.div``;

class App extends Component {
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
              <BarChart />
            </GridCell>
          </Grid>
        </ContentContainer>
      </RootContainer>
    );
  }
}

export default App;
