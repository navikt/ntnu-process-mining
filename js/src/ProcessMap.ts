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
  private slider: HTMLInputElement;

  public initialize() {
    this.element = document.createElement('div') as HTMLElement;
    this.element.id = '123';
    this.element.style.width = '100%';
    this.element.style.height = '400px';
    this.element.style.border = '1px solid black';
    this.slider = document.createElement("input");
    let output = document.createElement("div");
    this.slider.type="range";
    this.slider.id="myRange";
    this.slider.step="10";
    this.slider.oninput = ()=> {
      output.innerHTML = this.slider.value;
      setTimeout(this.render_cy.bind(this), 10);
    }
    this.el.appendChild(this.slider);
    this.el.appendChild(output);
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
    let value_array = Object.keys(edges).map(function (key) {return edges[key]["value"];});
    console.log(this.slider.value)
    edges.forEach(edge => {
      if (edge.value<=Number(this.slider.value)*Math.max.apply(null, value_array)/100){
        return
      }
      if (edge.from!=edge.to){
        edgelist.push({data: { id: edge.from + edge.to, source: edge.from, target: edge.to, label:edge.value} })
      }
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
            label: 'data(label)',
            'line-color': '#f77f00',
            'target-arrow-color': '#f77f00',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        }
      ],

      layout: {
        name: 'cose',
        idealEdgeLength: ()=>100,
        nodeOverlap: 20,
        refresh: 20,
        fit: true,
        padding: 3,
        randomize: false,
        componentSpacing: 100,
        nodeRepulsion: ()=>400000,
        edgeElasticity: ()=>100,
        nestingFactor: 5,
        gravity: -800,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0,
        
        
      }
    })
    
  }
}
