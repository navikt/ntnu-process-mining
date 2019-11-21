import { withParentSize } from '@vx/responsive';
import React from 'react';
import { default as App } from './App';

const ResponsiveVis = withParentSize(
  ({ parentWidth, parentHeight, ...rest }) => (
    <App width={parentWidth} height={900} initialMinEventCount={2} {...rest} />
  )
);

export interface IEvent {
  ENTITY_ID: string;
  EVENT_NAME: string;
  TS: Date;
}

const EventFlowComponent: React.FC<{ events: IEvent[] }> = ({ events }) => {
  return (
    <div className="content">
      <h1>Trace Explorer</h1>
      <ResponsiveVis data={events} />
    </div>
  );
};

export default EventFlowComponent;
