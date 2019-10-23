import { DOMWidgetView } from '@jupyter-widgets/base';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { EventFlowExample } from './event-flow';

export class EventFlow extends DOMWidgetView {
  private element: HTMLElement;

  public initialize() {
    // function MyComponent() {
    //   return <div>My Widget</div>;
    // }

    // ReactDOM.render(<EventFlowExample/>, document.querySelector('#root'));
    this.element = document.createElement('div') as HTMLElement;
    this.element.style.width = '100%';
    this.element.style.height = '700px';
    this.el.appendChild(this.element);

    const events = this.model.get('value').map(event => {
      return {
        ...event,
        TS: new Date(event.TS)
      };
    });
    // ReactDOM.render(<MyComponent />, this.element);
    ReactDOM.render(<EventFlowExample data={events} />, this.element);
  }
}
