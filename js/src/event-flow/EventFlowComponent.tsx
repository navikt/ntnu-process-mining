import { App } from '@data-ui/event-flow';
import { withScreenSize } from '@vx/responsive';
import React from 'react';

const ResponsiveVis = withScreenSize(({ screenWidth, ...rest }) => (
  <App width={screenWidth * 0.7} height={500} {...rest} />
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
