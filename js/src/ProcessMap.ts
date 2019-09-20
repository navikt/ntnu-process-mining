import { DOMWidgetView } from '@jupyter-widgets/base';
import * as d3 from 'd3';
import { SimulationLinkDatum, SimulationNodeDatum } from 'd3';

interface IEdge {
  from: string;
  to: string;
  value: number;
}
export class ProcessMap extends DOMWidgetView {
  private svg: d3.Selection<Element, any, null, undefined>;
  private element: Element;

  public initialize() {
    // this.setElement(document.createElementNS(d3.namespaces.svg, 'svg'));
    this.element = document.createElementNS(d3.namespaces.svg, 'svg');
    (this.element as HTMLElement).style.width = '100%';
    (this.element as HTMLElement).style.height = '300px';
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

  public render() {
    const graph = {
      links: [],
      nodes: []
    };
    type NodeDatum = SimulationNodeDatum & { id: string };
    type LinkDatum = SimulationLinkDatum<NodeDatum>;

    const edges: IEdge[] = this.model.get('value') || [];
    edges.forEach(edge => {
      const hasSourceNode = graph.nodes.find(n => {
        return n.id === edge.from;
      });
      if (!hasSourceNode) {
        graph.nodes.push({
          id: edge.from
        });
      }
      const hasTargetNode = graph.nodes.find(n => {
        return n.id === edge.to;
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
      .attr('stroke', d => {
        return '#999';
      })
      .attr('stroke-width', d => {
        return 3;
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
      .attr('fill', d => {
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
      .text(d => {
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
      .attr('id', (d, i) => {
        return 'edgepath' + i;
      })
      .style('pointer-events', 'none');

    const edgelabels = this.svg
      .selectAll('.edgelabel')
      .data(graph.links)
      .enter()
      .append('text')
      .attr('class', 'edgelabel')
      .attr('id', (d, i) => {
        return 'edgelabel' + i;
      })
      .attr('dy', -4)
      .attr('font-size', 10)
      .attr('fill', '#000');
    edgelabels
      .append('textPath')
      .attr('href', (d, i) => {
        return '#edgepath' + i;
      })
      .style('pointer-events', 'none')
      .text((d, i) => {
        return d.value;
      });

    d3.forceSimulation(graph.nodes)
      .force(
        'link',
        d3
          .forceLink<NodeDatum, LinkDatum>()
          .id(d => {
            return d.id;
          })
          .links(graph.links)
      )
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .on('tick', ticked);

    function ticked() {
      link
        .attr('x1', d => {
          return d.source.x;
        })
        .attr('y1', d => {
          return d.source.y;
        })
        .attr('x2', d => {
          return d.target.x;
        })
        .attr('y2', d => {
          return d.target.y;
        });

      edgepaths.attr('d', d => {
        const path =
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
      edgelabels.attr('transform', (d, i) => {
        if (d.target.x < d.source.x) {
          const bbox = this.getBBox();
          const rx = bbox.x + bbox.width / 2;
          const ry = bbox.y + bbox.height / 2;
          return 'rotate(180 ' + rx + ' ' + ry + ')';
        } else {
          return 'rotate(0)';
        }
      });
      edgelabels.attr('x', (d, i) => {
        const bbox = this.getBBox();
        // TODO: text width calculation is wrong
        const textWidth = Math.max(bbox.width, bbox.height);
        const lineLength = Math.sqrt(
          Math.pow(d.target.x - d.source.x, 2) +
            Math.pow(d.target.y - d.source.y, 2)
        );
        return lineLength / 2 - textWidth / 2;
      });

      node.attr('transform', d => {
        return 'translate(' + d.x + ',' + d.y + ')';
      });
    }
  }
}
