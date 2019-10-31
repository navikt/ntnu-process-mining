import { withScreenSize } from '@vx/responsive';
import React, { useCallback } from 'react';
import { default as App } from './App';

const ResponsiveVis = withScreenSize(({ screenWidth, screenHeight, theRef, ...rest }) => (
  <App
    width={1200}
    height={900}
    ref={theRef}
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
  const ref = useCallback(node => {
    if (node !== null) {
      node.setState({
        xScaleType: 'EVENT_SEQUENCE_SCALE'
      });
    }
  }, []);

  return (
    <div className={'content'}>
      <h1>Event-flow</h1>
      <ResponsiveVis theRef={ref} data={events} />
    </div>
  );
};

export default EventFlowComponent;
