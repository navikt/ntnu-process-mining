var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');
var d3 = require('d3');

var HelloModel = widgets.DOMWidgetModel.extend({
  defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
    _model_name: 'HelloModel',
    _view_name: 'HelloView',
    _model_module: 'ntnu-process-mining',
    _view_module: 'ntnu-process-mining',
    _model_module_version: '0.1.0',
    _view_module_version: '0.1.0',
    value: 'Hello World!'
  })
});

// Custom View. Renders the widget model.
var HelloView = widgets.DOMWidgetView.extend({
  render: function() {
    this.value_changed();
    this.model.on('change:value', this.value_changed, this);
  },

  value_changed: function() {
    this.el.textContent = this.model.get('value');
  }
});

var ProcessMapModel = widgets.DOMWidgetModel.extend({
  defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
    _model_name: 'ProcessMapModel',
    _view_name: 'ProcessMapView',
    _model_module: 'ntnu-process-mining',
    _view_module: 'ntnu-process-mining',
    _model_module_version: '0.1.0',
    _view_module_version: '0.1.0',
    value: [{ from: 'a', to: 'b', value: 31 }]
  })
});

var ProcessMapView = widgets.DOMWidgetView.extend({
  render: function() {
    var graph = {
      nodes: [],
      links: []
    };
    var edges = this.model.get('value') || [];
    edges.forEach(function(edge) {
      var hasSourceNode = graph.nodes.find(function(node) {
        return node.id === edge.from;
      });
      if (!hasSourceNode) {
        graph.nodes.push({
          id: edge.from
        });
      }
      var hasTargetNode = graph.nodes.find(function(node) {
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

    // var graph = {
    //   nodes: [{ id: 'a', group: 1 }, { id: 'b', group: 2 }],
    //   links: [{ id: 1, source: 'a', target: 'b', value: 9 }]
    // };
    width = 600; // +this.svg.attr('width');
    height = 300; // +this.svg.attr('height');
    console.log(width, height);
    var simulation = d3
      .forceSimulation()
      .force(
        'link',
        d3.forceLink().id(function(d) {
          return d.id;
        })
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    var link = this.svg
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

    var node = this.svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(graph.nodes)
      .enter()
      .append('g');

    var circles = node
      .append('circle')
      .attr('r', 5)
      .attr('fill', function(d) {
        return 'red';
        // return color(d.group);
      })
      .call(
        d3
          .drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      );

    var lables = node
      .append('text')
      .text(function(d) {
        return d.id;
      })
      .attr('x', 6)
      .attr('y', 3);

    node.append('title').text(function(d) {
      return d.id;
    });

    simulation.nodes(graph.nodes).on('tick', ticked);

    simulation.force('link').links(graph.links);
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

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // this.value_changed();
    // this.model.on('change:value', this.value_changed, this);
  },

  initialize: function() {
    var svg = document.createElementNS(d3.namespaces.svg, 'svg');
    svg.style.width = '100%';
    svg.style.height = '300px';
    this.svg = d3.select(svg);
    this.el.appendChild(svg);
  },

  value_changed: function() {
    console.log(this.el);
    console.log(this);

    // this.el.textContent = JSON.stringify(this.model.get('value'));
  }
});

module.exports = {
  HelloModel: HelloModel,
  HelloView: HelloView,
  ProcessMapModel: ProcessMapModel,
  ProcessMapView: ProcessMapView
};
