import { withScreenSize } from '@vx/responsive';
import React from 'react';
import { default as App } from './App';

const ResponsiveVis = withScreenSize(({ screenWidth, screenHeight, ...rest }) => (
  <App
    width={1200}
    height={900}
    initialMinEventCount={2}
    {...rest}
  />
));

export interface IEvent {
  ENTITY_ID: string;
  EVENT_NAME: string;
  TS: Date;
}

const EventFlowComponent: React.FC<{ events: IEvent[] }> = ({ events }) => {

  return (
    <div className={'content'}>
      <h1>Event-flow</h1>
      <ResponsiveVis data={events} />
    </div>
  );
};

export default EventFlowComponent;
