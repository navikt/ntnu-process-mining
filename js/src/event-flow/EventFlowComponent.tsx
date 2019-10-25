import { App } from '@data-ui/event-flow';
import { withScreenSize } from '@vx/responsive';
import React, { useCallback } from 'react';

const ResponsiveVis = withScreenSize(({ screenWidth, theRef, ...rest }) => (
  <App
    width={screenWidth * 0.7}
    height={500}
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
