import { App } from '@data-ui/event-flow';
import { withScreenSize } from '@vx/responsive';
import React from 'react';
import twentyUsers from './SampleEventGenerator';

const ResponsiveVis = withScreenSize(({ screenWidth, ...rest }) => (
  <App width={screenWidth * 0.7} height={500} {...rest} />
));

export const EventFlowExample: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className={'content'}>
      <h1>Event-flow example: 20/100/lots of users</h1>
      SampleEventGenerator for different numbers :D
      {/*<App width={300} height={300} data={twentyUsers.hundredUsers.allEvents} />*/}
      <ResponsiveVis data={data || twentyUsers.hundredUsers.allEvents} />
    </div>
  );
};
