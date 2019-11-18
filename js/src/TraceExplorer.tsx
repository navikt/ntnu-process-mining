import { DOMWidgetView } from '@jupyter-widgets/base';
import React from 'react';
import ReactDOM from 'react-dom';
import EventFlowComponent, {
  IEvent
} from './trace-explorer/EventFlowComponent';

export class TraceExplorer extends DOMWidgetView {
  private element: HTMLElement;

  public initialize() {
    this.element = document.createElement('div') as HTMLElement;
    this.element.style.width = '100%';
    this.element.style.height = '1400px';
    this.el.appendChild(this.element);

    const events: IEvent[] = this.model.get('value').map(event => {
      return {
        ...event,
        TS: new Date(event.TS)
      };
    });

    ReactDOM.render(<EventFlowComponent events={events} />, this.element);
  }
}
