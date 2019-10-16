import { DOMWidgetView } from '@jupyter-widgets/base';
import cytoscape from 'cytoscape';
import _ from 'underscore';

interface IEdge {
  from: string;
  to: string;
  value: number;
}

export class ProcessMap extends DOMWidgetView {
  private cy: cytoscape.Core;
  private element: HTMLElement;

  public initialize() {
    this.element = document.createElement('div') as HTMLElement;
    this.element.id = '123';
    this.element.style.width = '100%';
    this.element.style.height = '600px';
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
    const edges: IEdge[] = this.model.get('value') || [];
    console.log(edges);

    let edgelist = [];
    let nodelist = [];
    let nodenames = [];
    edges.forEach(edge => {
      edgelist.push({data: { id: edge.from + edge.to, source: edge.from, target: edge.to} })
      
      if (!nodenames.includes(edge.from)){
        nodelist.push({data: { id: edge.from}})
        nodenames.push(edge.from)
      }
      if (!nodenames.includes(edge.to)){
        nodelist.push({data: { id: edge.to}})
        nodenames.push(edge.to)
      }
      
    });
    console.log(nodelist)
    console.log(edgelist)

    this.element.innerHTML = '';
    this.cy = cytoscape({
      container: this.element,
      elements: nodelist.concat(edgelist),

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
        name: 'cose',
        idealEdgeLength: ()=>100,
        nodeOverlap: 20,
        refresh: 20,
        fit: true,
        padding: 30,
        randomize: false,
        componentSpacing: 100,
        nodeRepulsion: ()=>400000,
        edgeElasticity: ()=>100,
        nestingFactor: 5,
        gravity: 80,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0
      }
    });
  }
}
