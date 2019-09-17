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
  element: Element;
  parent: any;

  initialize() {
    // this.setElement(document.createElementNS(d3.namespaces.svg, 'svg'));
    this.element = document.createElementNS(d3.namespaces.svg, 'svg');
    (<HTMLElement>this.element).style.width = '100%';
    (<HTMLElement>this.element).style.height = '300px';
    this.svg = d3.select(this.element);
    this.el.appendChild(this.element);
    // this.setElement(document.createElementNS(d3.namespaces.svg, "g"));
    // this.d3el = d3.select(this.el);
    // super.initialize.apply(this, arguments);

    this.svg
      .append('svg:defs')
      .append('svg:marker')
      .attr('id', 'triangle')
      .attr('refX', 15)
      .attr('refY', 6)
      .attr('markerWidth', 30)
      .attr('markerHeight', 30)
      .attr('markerUnits', 'userSpaceOnUse')
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 12 6 0 12 3 6')
      .style('fill', 'black');
  }

  destroy() {
    this.el.removeChild(this.element);
  }

  render() {
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
          value: edge.value
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
        return 3;
        // return Math.sqrt(d.value);
      })
      .attr('marker-end', 'url(#triangle)');

    const node = this.svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(graph.nodes)
      .enter()
      .append('g');

    node
      .append('circle')
      .attr('r', 5)
      .attr('fill', function(d) {
        return 'red';
        // return color(d.group);
      })
      .on('mouseover', function(d) {
        d3.select(this)
          .attr('fill', 'blue')
          .attr('r', 10);
      })
      .on('mouseout', function(d) {
        d3.select(this)
          .attr('fill', 'red')
          .attr('r', 5);
      });

    node
      .append('text')
      .text(function(d) {
        return d.id;
      })
      .attr('x', 10)
      .attr('y', 3);

    const edgepaths = this.svg
      .selectAll('.edgepath')
      .data(graph.links)
      .enter()
      .append('path')
      .attr('class', 'edgepath')
      .attr('fill-opacity', 0)
      .attr('stroke-opacity', 0)
      .attr('fill', 'blue')
      .attr('stroke', 'red')
      .attr('id', function(d, i) {
        return 'edgepath' + i;
      })
      .style('pointer-events', 'none');

    const edgelabels = this.svg
      .selectAll('.edgelabel')
      .data(graph.links)
      .enter()
      .append('text')
      .attr('class', 'edgelabel')
      .attr('id', function(d, i) {
        return 'edgelabel' + i;
      })
      .attr('dy', -4)
      .attr('font-size', 10)
      .attr('fill', '#000');
    edgelabels
      .append('textPath')
      .attr('href', function(d, i) {
        return '#edgepath' + i;
      })
      .style('pointer-events', 'none')
      .text(function(d, i) {
        return d.value;
      });

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

      edgepaths.attr('d', function(d) {
        var path =
          'M ' +
          d.source.x +
          ' ' +
          d.source.y +
          ' L ' +
          d.target.x +
          ' ' +
          d.target.y;
        return path;
      });
      edgelabels.attr('transform', function(d, i) {
        if (d.target.x < d.source.x) {
          const bbox = this.getBBox();
          const rx = bbox.x + bbox.width / 2;
          const ry = bbox.y + bbox.height / 2;
          return 'rotate(180 ' + rx + ' ' + ry + ')';
        } else {
          return 'rotate(0)';
        }
      });
      edgelabels.attr('x', function(d, i) {
        const bbox = this.getBBox();
        // TODO: text width calculation is wrong
        const textWidth = Math.max(bbox.width, bbox.height);
        const lineLength = Math.sqrt(
          Math.pow(d.target.x - d.source.x, 2) +
            Math.pow(d.target.y - d.source.y, 2)
        );
        return lineLength / 2 - textWidth / 2;
        if (d.target.x < d.source.x) {
          const bbox = this.getBBox();
          const rx = bbox.x + bbox.width / 2;
          const ry = bbox.y + bbox.height / 2;
          return 'rotate(180 ' + rx + ' ' + ry + ')';
        } else {
          return 'rotate(0)';
        }
      });

      node.attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });
    }
  }
}
