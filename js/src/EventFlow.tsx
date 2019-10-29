import { DOMWidgetView } from '@jupyter-widgets/base';
import * as React from 'react';
import ReactDOM from 'react-dom';
import EventFlowComponent, { IEvent } from './event-flow/EventFlowComponent';

export class EventFlow extends DOMWidgetView {
  private element: HTMLElement;

  public initialize() {
    this.element = document.createElement('div') as HTMLElement;
    this.element.style.width = '100%';
    this.element.style.height = '1700px';
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
