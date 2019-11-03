import { DOMWidgetView } from '@jupyter-widgets/base';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import popper from 'cytoscape-popper';
import tippy from 'tippy.js';
import _ from 'underscore';

cytoscape.use(popper);
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

  private startNodeID = 'START';
  private endNodeID = 'END';

  public initialize() {
    this.element = document.createElement('div') as HTMLElement;
    this.element.style.width = '100%';
    this.element.style.height = '600px';
    this.element.style.border = '1px solid black';

    const sliderDiv = this.createSlider();
    this.el.appendChild(sliderDiv);

    const radioButtons = this.createRadioButtons();
    this.el.appendChild(radioButtons);

    this.el.appendChild(this.element);
    this.model.on('change:value', this.value_changed, this);
  }
  public radio_change(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.cy
      .style()
      // @ts-ignore
      .selector('edge')
      .style({
        label: `data(${val})`
      })
      .update();
  }
  public createSlider() {
    const sliderDiv = document.createElement('div');
    const slider = document.createElement('input');
    const sliderValue = document.createElement('div');
    slider.type = 'range';
    slider.step = '1';
    slider.style.width = '200px';

    slider.oninput = () => {
      sliderValue.innerHTML = slider.value + '%';
      const newValue = parseInt(slider.value, 10);
      this.model.set('filter', newValue);
      this.model.save_changes();
    };

    const updateFilter = () => {
      slider.value = this.model.get('filter');
      sliderValue.innerHTML = slider.value + '%';
    };
    updateFilter();
    this.model.on('change:filter', updateFilter, this);

    sliderDiv.insertAdjacentHTML('beforeend', '<b>Trace frequency filter:</b>');
    sliderDiv.appendChild(sliderValue);
    sliderDiv.appendChild(slider);
    return sliderDiv;
  }
  public createRadioButtons() {
    const radioDiv = document.createElement('div');
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

    radioDiv.insertAdjacentHTML('beforeend', `<b>Edge labels:</b><br/>`);
    radioDiv.appendChild(radio1);
    radioDiv.insertAdjacentHTML(
      'beforeend',
      ` <label for="freq">Frequency (number of occurences)</label><br/>`
    );
    radioDiv.appendChild(radio2);
    radioDiv.insertAdjacentHTML(
      'beforeend',
      ` <label for="abs_freq">Frequency – Absolute Case (duplicates within a case are removed)</label><br/>`
    );
    radioDiv.appendChild(radio3);
    radioDiv.insertAdjacentHTML(
      'beforeend',
      ` <label for="perf">Mean time</label><br/>`
    );
    radioDiv.appendChild(radio4);
    radioDiv.insertAdjacentHTML(
      'beforeend',
      ` <label for="perf_med">Median time</label><br/>`
    );
    return radioDiv;
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
      // @ts-ignore
      style: this.getStylesheet(),
      layout: this.getLayout()
    });

    this.addEdgeHoverListeners();
    this.addNodeHoverListeners();
  }
  private addEdgeHoverListeners() {
    this.cy.on('mouseover', 'edge', event => {
      const edge = event.target;
      let t = edge.scratch('tippy');
      if (!t) {
        t = tippy(edge.popperRef(), {
          content: `
            <div style="font-size: 1.3em;text-align:center;">
              ${edge.attr('source')} -> ${edge.attr('target')}<br/><br/>
              <table style="width: 100%;text-align:right;">
              <tr>
                <td style="text-align: left">Frequency</td>
                <td>${edge.attr('freq')}</td>
              </tr>
              <tr>
                <td style="text-align: left">Absolute frequency</td>
                <td>${edge.attr('abs_freq')}</td>
              </tr>
              <tr>
                <td style="text-align: left">Mean time</td>
                <td>${edge.attr('perf')}</td>
              </tr>
              <tr>
                <td style="text-align: left">Median time</td>
                <td>${edge.attr('perf_med')}</td>
              </tr>
              </table>
            </div>
          `,
          trigger: 'manual'
        });
        edge.scratch('tippy', t);
      }
      t.show();
    });
    this.cy.on('mouseout tapstart', 'edge', event => {
      const edge = event.target;
      const t = edge.scratch('tippy');
      if (t) {
        t.hide();
      }
    });
  }
  private addNodeHoverListeners() {
    this.cy.on('mouseover', 'node', event => {
      const node = event.target;
      let t = node.scratch('tippy');
      if (!t) {
        t = tippy(node.popperRef(), {
          content: `
            <div style="font-size: 1.3em;text-align:center;">
              ${node.attr('id')}<br />
              Frequency: ${node.attr('freq')}
            </div>
          `,
          trigger: 'manual'
        });
        node.scratch('tippy', t);
      }
      t.show();
    });
    this.cy.on('mouseout tapstart', 'node', event => {
      const node = event.target;
      const t = node.scratch('tippy');
      if (t) {
        t.hide();
      }
    });
  }

  private getStylesheet() {
    return [
      {
        selector: 'node',
        style: {
          width: 'label',
          height: 'label',
          shape: 'round-rectangle',
          padding: '10px',
          'background-color': n => {
            if (n.id() === this.startNodeID || n.id() === this.endNodeID) {
              return '#ffa500';
            }
            return '#666';
          },
          'text-wrap': 'wrap',
          label: 'data(label)',
          'text-valign': 'center',
          color: '#fff'
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
          'curve-style': 'bezier',
          'text-margin-x': -10,
          'text-margin-y': -10,
          'background-color': 'red'
        }
      }
    ];
  }
  private getLayout() {
    return {
      name: 'breadthfirst',
      avoidOverlap: true,
      animate: false,
      directed: false,
      grid: false,
      fit: true,
      roots: [this.startNodeID],
      nodeDimensionsIncludeLabels: true,
      // Make graph go left to right instead of top down
      transform: (node, position) => {
        return {
          x: position.y,
          y: position.x
        };
      }
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
            // Custom values
            freq: edge.freq,
            abs_freq: edge.abs_freq,
            perf: edge.perf,
            perf_med: edge.perf_med
          }
        });
      }

      if (!Object.keys(nodenames).includes(edge.from)) {
        nodelist.push({ data: { id: edge.from, label: edge.from } });
        nodenames[edge.from] = 0;
      }

      if (typeof edge.freq === 'number') {
        nodenames[edge.from] += edge.freq;
      }

      if (!Object.keys(nodenames).includes(edge.to)) {
        nodelist.push({ data: { id: edge.to, label: edge.to } });
      }
    });
    nodelist.forEach(node => {
      if (
        node.data.id !== this.startNodeID &&
        node.data.id !== this.endNodeID
      ) {
        node.data.label += '\n' + nodenames[node.data.id];
        node.data.freq = nodenames[node.data.id];
      } else {
        node.data.freq = 'N/A';
      }
    });
    return nodelist.concat(edgelist);
  }
}
