import { DOMWidgetView } from '@jupyter-widgets/base';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import _ from 'underscore';

cytoscape.use(cola);

interface IEdge {
  from: string;
  to: string;
  freq: number;
  perf: number;
  abs_freq: number;
}

export class ProcessMap extends DOMWidgetView {
  private cy: cytoscape.Core;
  private element: HTMLElement;
  private slider: HTMLInputElement;
  private radioDiv: HTMLElement;

  public initialize() {
    this.element = document.createElement('div') as HTMLElement;
    this.element.id = '123';
    this.element.style.width = '100%';
    this.element.style.height = '400px';
    this.element.style.border = '1px solid black';

    ////
    this.slider = document.createElement('input');
    const output = document.createElement('div');
    this.create_radiobtns();
    this.slider.type = 'range';
    this.slider.step = '1';
    this.slider.value = '20';
    this.slider.oninput = () => {
      output.innerHTML = this.slider.value;
      const newValue = parseInt(this.slider.value, 10);
      this.model.set('filter', newValue);
      this.model.save_changes();
    };
    
    this.el.appendChild(this.slider);
    this.el.appendChild(this.radioDiv)
    this.el.appendChild(output);
    ////

    this.el.appendChild(this.element);
    this.model.on('change:value', this.value_changed, this);
    this.model.on('change:filter', this.filter_changed, this);
  }
  public radio_click(thisRadio: MouseEvent) {
    let state = (<HTMLInputElement>event.target).value
    let new_label
    console.log(state)
    switch(state) {
      case 'freq':
        new_label = 'data(freq)'
        break;
      case 'perf':
        new_label = 'data(perf)'
        break;
      case 'abs_freq':
        new_label = 'data(abs_freq)'
    }

    //let stringStylesheet = 'node { label: ' + 'asdf' + '; }';
    /*this.cy.style([
      // the stylesheet for the graph
      {
        selector: 'node',
        style: {
          'background-color': '#FF1',
          label: 'data(id)'
        }
      },
      {
        selector: 'edge',
        style: {
          label: 'data(label)',
          width: 3,
          'line-color': '#f77f00',
          'target-arrow-color': '#f77f00',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier'
        }
      }
    ]);*/
// @ts-ignore
    this.cy.style().selector('edge')
    .style({
      'background-color': 'red',
      'label': new_label
    })
    .update() // indicate the end of your new stylesheet so that it can be updated on elements
;

  }
  public create_radiobtns() {
    this.radioDiv = document.createElement('div');
    const radio1: HTMLInputElement = document.createElement('input');
    radio1.setAttribute("type", "radio");
    radio1.setAttribute("name", "edge_value");
    radio1.setAttribute("value", "freq");
    radio1.addEventListener("click", this.radio_click.bind(this));
    radio1.setAttribute("checked", "True");
    const radio2: HTMLInputElement = document.createElement('input');
    radio2.setAttribute("type", "radio");
    radio2.setAttribute("name", "edge_value");
    radio2.setAttribute("value", "abs_freq");
    radio2.addEventListener("click", this.radio_click.bind(this));
    const radio3: HTMLInputElement = document.createElement('input');
    radio3.setAttribute("type", "radio");
    radio3.setAttribute("name", "edge_value");
    radio3.setAttribute("value", "perf");
    radio3.addEventListener("click", this.radio_click.bind(this));
    this.radioDiv.appendChild(radio1);
    this.radioDiv.insertAdjacentHTML("beforeend", "Frequency")
    this.radioDiv.appendChild(radio2);
    this.radioDiv.insertAdjacentHTML("beforeend", "Absolute Case")
    this.radioDiv.appendChild(radio3);
    this.radioDiv.insertAdjacentHTML("beforeend", "Performance")
  }
  

  public value_changed() {
    console.log('value_changed');
    if (this.cy) {
      // this.cy.json({ elements: this.getElements() });
      this.cy.elements().remove();
      this.cy.add(this.getElements());
      const layout = this.cy.layout(this.getLayout());
      //this.setSourceAndSink();
      layout.run();
    }
  }

  public filter_changed() {
    const oldValue = this.model.previous('filter');
    const newValue = this.model.get('filter');
    console.log('filter changed', oldValue, newValue);
  }

  public render() {
    if (!this.cy) {
      this.element.innerHTML = 'Loading...';
      setTimeout(this.renderCy.bind(this), 10);
    }
  }

  public renderCy() {
    this.element.innerHTML = '';
    this.cy = cytoscape({
      container: this.element,
      elements: this.getElements(),
      style: [
        // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'text-wrap': 'wrap',
            label: 'data(label)',
          }
        },

        {
          selector: 'edge',
          style: {
            label: 'data(freq)',
            width: 3,
            'line-color': '#f77f00',
            'target-arrow-color': '#f77f00',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        }
      ],

      layout: this.getLayout()

      
    });
    
  }

  private getLayout() {
    return {
      name: 'cola',
      idealEdgeLength: () => 100,
      nodeOverlap: 20,
      refresh: 20,
      fit: true,
      padding: 3,
      randomize: false,
      componentSpacing: 100,
      nodeRepulsion: () => 400000,
      edgeElasticity: () => 100,
      nestingFactor: 5,
      gravity: -800,
      numIter: 1000,
      initialTemp: 200,
      coolingFactor: 0.95,
      minTemp: 1.0
    };
  }

  private getElements() {
    const edges: IEdge[] = this.model.get('value') || [];

    const edgelist = [];
    const nodelist = [];
    const nodenames = {};

    edges.forEach(edge => {
      if (edge.from !== edge.to) {
        edgelist.push({
          data: {
            id: edge.from + edge.to,
            source: edge.from,
            target: edge.to,
            freq: edge.freq,
            perf: edge.perf,
            abs_freq: edge.abs_freq

          }
        });
      }

      if (!Object.keys(nodenames).includes(edge.from)) {
        nodelist.push({ data: { id: edge.from, label: edge.from } });
        nodenames[edge.from]=0;
      }
      
      if (typeof edge.freq === 'number') {
        nodenames[edge.from] += edge.freq
      }

      if (!Object.keys(nodenames).includes(edge.to)) {
        nodelist.push({ data: { id: edge.to, label: edge.to } });
      } 
      
    })
    nodelist.forEach(node => {
      node['data']['label'] +=  ' ('+nodenames[node['data']['id']]+')'
    });
    return nodelist.concat(edgelist);
  }

  /* private setSourceAndSink() {
    let source_node = this.cy.getElementById('SOURCE')
    source_node.id=()=>"GFSLGLK";
  } */
}
