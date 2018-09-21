import React from 'react';
import {
  TopAppBar as RmwcTopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarNavigationIcon,
  TopAppBarActionItem,
  TopAppBarTitle,
  TopAppBarFixedAdjust,
} from '@rmwc/top-app-bar';

export const TopAppBar = props => (
  <div>
    <RmwcTopAppBar fixed={false}>
      <TopAppBarRow>
        <TopAppBarSection>
          <TopAppBarTitle>React D3 Crossfilter</TopAppBarTitle>
        </TopAppBarSection>
      </TopAppBarRow>
    </RmwcTopAppBar>
    <TopAppBarFixedAdjust />
  </div>
);
