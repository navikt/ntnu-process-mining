import { App } from '@data-ui/event-flow';
import { withScreenSize } from '@vx/responsive';
import React from 'react';
import twentyUsers from './SampleEventGenerator';

const ResponsiveVis = withScreenSize(
  ({ screenWidth, screenHeight, ...rest }) => (
    <App width={screenWidth * 0.9} height={screenHeight * 0.9} {...rest} />
  )
);

export const EventFlowExample = () => {
  return (
    <div className={'content'}>
      <h1>Event-flow example: 20/100/lots of users</h1>
      SampleEventGenerator for different numbers :D
      {/*<App width={300} height={300} data={twentyUsers.hundredUsers.allEvents} />*/}
      <ResponsiveVis data={twentyUsers.hundredUsers.allEvents} />
    </div>
  );
};
