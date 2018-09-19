import React, {Component} from 'react';
import '../node_modules/material-components-web/dist/material-components-web.min.css';
import styled from 'styled-components';

import {TopAppBar, DonutChart} from './components';

const RootContainer = styled.div``;
const ContentContainer = styled.div``;

class App extends Component {
  render() {
    return (
      <RootContainer>
        <TopAppBar />
        <ContentContainer>
          <DonutChart />
        </ContentContainer>
      </RootContainer>
    );
  }
}

export default App;
