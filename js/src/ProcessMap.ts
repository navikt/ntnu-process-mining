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
  perf_med: number;
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
    this.slider.value = this.model.get('filter');
    output.innerHTML = this.slider.value;
    this.slider.oninput = () => {
      output.innerHTML = this.slider.value;
      const newValue = parseInt(this.slider.value, 10);
      this.model.set('filter', newValue);
      this.model.save_changes();
    };

    this.el.appendChild(this.slider);
    this.el.appendChild(this.radioDiv);
    this.el.appendChild(output);
    ////

    this.el.appendChild(this.element);
    this.model.on('change:value', this.value_changed, this);
  }
  public radio_change(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    let newLabel = 'data(freq)';

    switch (val) {
      case 'freq':
        newLabel = 'data(freq)';
        break;
      case 'perf':
        newLabel = 'data(perf)';
        break;
      case 'abs_freq':
        newLabel = 'data(abs_freq)';
        break;
      case 'perf_med':
        newLabel = 'data(perf_med)';
    }
    this.cy
      .style()
      // @ts-ignore
      .selector('edge')
      .style({
        'background-color': 'red',
        label: newLabel
      })
      .update(); // indicate the end of your new stylesheet so that it can be updated on elements
  }
  public create_radiobtns() {
    this.radioDiv = document.createElement('div');
    const radio1: HTMLInputElement = document.createElement('input');
    radio1.setAttribute('type', 'radio');
    radio1.setAttribute('name', 'edge_value');
    radio1.setAttribute('id', 'freq');
    radio1.setAttribute('value', 'freq');
    radio1.addEventListener('change', this.radio_change.bind(this));
    radio1.setAttribute('checked', 'True');

    const radio2: HTMLInputElement = document.createElement('input');
    radio2.setAttribute('type', 'radio');
    radio2.setAttribute('name', 'edge_value');
    radio2.setAttribute('id', 'abs_freq');
    radio2.setAttribute('value', 'abs_freq');
    radio2.addEventListener('change', this.radio_change.bind(this));

    const radio3: HTMLInputElement = document.createElement('input');
    radio3.setAttribute('type', 'radio');
    radio3.setAttribute('name', 'edge_value');
    radio3.setAttribute('id', 'perf');
    radio3.setAttribute('value', 'perf');
    radio3.addEventListener('change', this.radio_change.bind(this));

    const radio4: HTMLInputElement = document.createElement('input');
    radio4.setAttribute('type', 'radio');
    radio4.setAttribute('name', 'edge_value');
    radio4.setAttribute('id', 'perf_med');
    radio4.setAttribute('value', 'perf_med');
    radio4.addEventListener('change', this.radio_change.bind(this));

    this.radioDiv.appendChild(radio1);
    this.radioDiv.insertAdjacentHTML(
      'beforeend',
      `<label for="freq">Frequency (number of occurences)</label><br/>`
    );
    this.radioDiv.appendChild(radio2);
    this.radioDiv.insertAdjacentHTML(
      'beforeend',
      `<label for="abs_freq">Frequency – Absolute Case (duplicates within a case are removed)</label><br/>`
    );
    this.radioDiv.appendChild(radio3);
    this.radioDiv.insertAdjacentHTML(
      'beforeend',
      `<label for="perf">Performance (time spent)</label><br/>`
    );
    this.radioDiv.appendChild(radio4);
    this.radioDiv.insertAdjacentHTML(
      'beforeend',
      `<label for="perf_med">Performance median(time spent)</label><br/>`
    );
  }

  public value_changed() {
    if (this.cy) {
      // this.cy.json({ elements: this.getElements() });
      this.cy.elements().remove();
      this.cy.add(this.getElements());
      const layout = this.cy.layout(this.getLayout());
      // this.setSourceAndSink();
      layout.run();
    }
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
            label: 'data(id)',
            height: '14px',
            width: '14px'
          }
        },

        {
          selector: 'edge',
          style: {
            label: 'data(freq)',
            width: 2,
            'line-color': '#a89076',
            'target-arrow-color': '#a89076',
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
      name: 'breadthfirst',
      avoidOverlap: true,
      animate: false,
      directed: false,
      grid: false,
      nodeDimensionsIncludeLabels: true
    };
  }

  private getElements() {
    const edges: IEdge[] = this.model.get('value') || [];

    const edgelist = [];
    const nodelist = [];
    const nodenames = [];

    edges.forEach(edge => {
      if (edge.from !== edge.to) {
        edgelist.push({
          data: {
            id: edge.from + edge.to,
            source: edge.from,
            target: edge.to,
            // Custom values
            freq: edge.freq,
            abs_freq: edge.abs_freq,
            perf: edge.perf,
            perf_med: edge.perf_med,
          }
        });
      }

      if (!nodenames.includes(edge.from)) {
        nodelist.push({ data: { id: edge.from, perf: edge.perf } });
        nodenames.push(edge.from);
      }
      if (!nodenames.includes(edge.to)) {
        nodelist.push({ data: { id: edge.to } });
        nodenames.push(edge.to);
      }
    });
    return nodelist.concat(edgelist);
  }

  /* private setSourceAndSink() {
    let source_node = this.cy.getElementById('SOURCE')
    source_node.id=()=>"GFSLGLK";
  } */
}
