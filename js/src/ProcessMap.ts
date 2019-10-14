import { DOMWidgetView } from '@jupyter-widgets/base';
import cytoscape from 'cytoscape';
import _ from 'underscore';

// interface IEdge {
//   from: string;
//   to: string;
//   value: number;
// }

export class ProcessMap extends DOMWidgetView {
  private cy: cytoscape.Core;
  private element: HTMLElement;

  public initialize() {
    this.element = document.createElement('div') as HTMLElement;
    this.element.id = '123';
    this.element.style.width = '100%';
    this.element.style.height = '300px';
    this.element.style.border = '1px solid black';
    this.el.appendChild(this.element);
  }

  public render() {
    console.log(this.element);
    if (!this.cy) {
      this.element.innerHTML = 'Loading...';
      setTimeout(this.render_cy.bind(this), 10);
    }
  }
  public render_cy() {
    this.element.innerHTML = '';
    this.cy = cytoscape({
      container: this.element,
      elements: [
        // list of graph elements to start with
        {
          // node a
          data: { id: 'a' }
        },
        {
          // node b
          data: { id: 'b' }
        },
        {
          // edge ab
          data: { id: 'ab', source: 'a', target: 'b' }
        }
      ],

      style: [
        // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            label: 'data(id)'
          }
        },

        {
          selector: 'edge',
          style: {
            width: 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle'
          }
        }
      ],

      layout: {
        name: 'grid',
        rows: 1
      }
    });
  }
}
