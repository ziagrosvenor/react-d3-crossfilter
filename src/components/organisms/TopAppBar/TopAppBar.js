import React from 'react';
import {
  TopAppBar as RmwcTopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarNavigationIcon,
  TopAppBarActionItem,
  TopAppBarTitle,
} from '@rmwc/top-app-bar';

export const TopAppBar = props => (
  <RmwcTopAppBar>
    <TopAppBarRow>
      <TopAppBarSection>
        <TopAppBarNavigationIcon icon="menu" />
        <TopAppBarTitle>React D3 Crossfilter</TopAppBarTitle>
      </TopAppBarSection>
    </TopAppBarRow>
  </RmwcTopAppBar>
);
