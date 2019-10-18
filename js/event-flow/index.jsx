import React from 'react';
import { withScreenSize } from '@vx/responsive';
import ReactDOM from 'react-dom';
import { App } from '@data-ui/event-flow';
import twentyUsers from './SampleEventGenerator'

console.log(twentyUsers.twentyUsers.allEvents);

const ResponsiveVis = withScreenSize(({ screenWidth, screenHeight, ...rest }) => (
    <App width={screenWidth * 0.9} height={screenHeight * 0.9} {...rest} />
));

// Example of event flow:
const EventFlowExample= () => {
    return(
        <div className={'content'}>
            <h1>Event-flow example: 20/100/lots of users</h1>
            // use: to get n users:   twentyUsers.nUsers.allEvents. See SampleEventGenerator for different numbers :D
            <ResponsiveVis data={twentyUsers.hundredUsers.allEvents} />
        </div>
    )
};

// example of rendering the app:
ReactDOM.render(<EventFlowExample/>, document.querySelector('#root'));