import { DOMWidgetView } from '@jupyter-widgets/base';
import * as d3 from 'd3';
import { SimulationNodeDatum, SimulationLinkDatum } from 'd3';

type Edge = {
  from: string;
  to: string;
  value: number;
};
export class ProcessMap extends DOMWidgetView {
  svg: d3.Selection<Element, any, null, undefined>;
  parent: any;

  initialize() {
    // this.setElement(document.createElementNS(d3.namespaces.svg, 'svg'));
    const svg = document.createElementNS(d3.namespaces.svg, 'svg');
    (<HTMLElement>svg).style.width = '100%';
    (<HTMLElement>svg).style.height = '300px';
    this.svg = d3.select(svg);
    this.el.appendChild(svg);

    // this.setElement(document.createElementNS(d3.namespaces.svg, "g"));
    // this.d3el = d3.select(this.el);

    // super.initialize.apply(this, arguments);
  }

  render() {
    console.log('render x');
    const graph = {
      nodes: [],
      links: []
    };
    type NodeDatum = SimulationNodeDatum & { id: string };
    type LinkDatum = SimulationLinkDatum<NodeDatum>;

    const edges: Edge[] = this.model.get('value') || [];
    edges.forEach(function(edge) {
      const hasSourceNode = graph.nodes.find(function(node) {
        return node.id === edge.from;
      });
      if (!hasSourceNode) {
        graph.nodes.push({
          id: edge.from
        });
      }
      const hasTargetNode = graph.nodes.find(function(node) {
        return node.id === edge.to;
      });
      if (!hasTargetNode) {
        graph.nodes.push({
          id: edge.to
        });
      }

      if (edge.from !== edge.to) {
        graph.links.push({
          source: edge.from,
          target: edge.to,
          value: 9 // edge.value
        });
      }
    });

    const width = 600; // +this.svg.attr('width');
    const height = 300; // +this.svg.attr('height');

    const link = this.svg
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graph.links)
      .enter()
      .append('line')
      .attr('stroke', function(d) {
        return '#999';
      })
      .attr('stroke-width', function(d) {
        return Math.sqrt(d.value);
      });

    link
      .append('text')
      .text(function(d) {
        return 'test';
      })
      .attr('x', 5)
      .attr('y', 3);

    const node = this.svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(graph.nodes)
      .enter()
      .append('g');

    node
      .append('circle')
      .attr('r', 10)
      .attr('fill', function(d) {
        return 'red';
        // return color(d.group);
      });

    node
      .append('text')
      .text(function(d) {
        return d.id;
      })
      .attr('x', 10)
      .attr('y', 3);

    d3.forceSimulation(graph.nodes)
      .force(
        'link',
        d3
          .forceLink<NodeDatum, LinkDatum>()
          .id(function(d) {
            return d.id;
          })
          .links(graph.links)
      )
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .on('tick', ticked);

    function ticked() {
      link
        .attr('x1', function(d) {
          return d.source.x;
        })
        .attr('y1', function(d) {
          return d.source.y;
        })
        .attr('x2', function(d) {
          return d.target.x;
        })
        .attr('y2', function(d) {
          return d.target.y;
        });

      node.attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });
    }
  }
}
