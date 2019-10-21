import { DOMWidgetView } from '@jupyter-widgets/base';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { EventFlowExample } from './event-flow';

export class ReactWidget extends DOMWidgetView {
  private element: HTMLElement;

  public initialize() {
    // function MyComponent() {
    //   return <div>My Widget</div>;
    // }

    // ReactDOM.render(<EventFlowExample/>, document.querySelector('#root'));
    this.element = document.createElement('div') as HTMLElement;
    this.element.style.width = '100%';
    this.element.style.height = '600px';
    this.el.appendChild(this.element);
    // ReactDOM.render(<MyComponent />, this.element);
    ReactDOM.render(<EventFlowExample />, this.element);
  }
}
