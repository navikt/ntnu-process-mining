/* 
The MIT License (MIT)

Copyright (c) 2017 Christopher Card Williams

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/* eslint react/no-access-state-in-setstate: 0 */
import React from 'react';
import PropTypes from 'prop-types';

import ControlPanel from './ControlPanel';
import Visualization, {
  margin as VIS_MARGIN
} from '@data-ui/event-flow/src/components/Visualization';

import {
  findNthIndexOfX,
  getEventCountLookup
} from '@data-ui/event-flow/src/utils/data-utils';
import { buildGraph } from '@data-ui/event-flow/src/utils/graph-utils';
import {
  buildAllScales,
  nodeSorters
} from '@data-ui/event-flow/src/utils/scale-utils';
import { dataShape } from '@data-ui/event-flow/src/propShapes';

import {
  ANY_EVENT_TYPE,
  EVENT_NAME,
  ELAPSED_TIME_SCALE,
  EVENT_COUNT_SCALE,
  EVENT_SEQUENCE_SCALE,
  NODE_COLOR_SCALE,
  ORDER_BY_EVENT_COUNT
} from '@data-ui/event-flow/src/constants';

const propTypes = {
  data: dataShape,
  initialShowControls: PropTypes.bool,
  initialMinEventCount: PropTypes.number,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

const defaultProps = {
  data: [],
  initialShowControls: true,
  initialMinEventCount: 1
};

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleToggleShowControls = this.handleToggleShowControls.bind(this);
    this.handleAlignByIndex = this.handleAlignByIndex.bind(this);
    this.handleAlignByEventType = this.handleAlignByEventType.bind(this);
    this.handleClickLegend = this.handleClickLegend.bind(this);
    this.handleMinEventCountChange = this.handleMinEventCountChange.bind(this);

    const {
      width,
      height,
      data,
      initialShowControls: showControls,
      initialMinEventCount: minEventCount
    } = props;

    const visualizationWidth = width;
    const alignByEventType = ANY_EVENT_TYPE;
    const alignByIndex = 1;
    const hiddenEventTypes = {};
    const graph = this.getGraph({
      data,
      alignByIndex,
      alignByEventType,
      hiddenEventTypes,
      minEventCount
    });
    const scales = this.getScales(graph, visualizationWidth, height);

    this.state = {
      xScaleType: EVENT_SEQUENCE_SCALE,
      yScaleType: EVENT_COUNT_SCALE,
      orderBy: ORDER_BY_EVENT_COUNT,
      alignByIndex,
      alignByEventType,
      showControls,
      hiddenEventTypes,
      visualizationWidth,
      graph,
      scales,
      selectedNode: null,
      minEventCount
    };
  }

  componentWillReceiveProps(nextProps) {
    const nextState = {};
    if (this.props.data !== nextProps.data) {
      const { alignByIndex, alignByEventType } = this.state;
      nextState.hiddenEventTypes = {};
      nextState.graph = this.getGraph({
        data: nextProps.data,
        alignByIndex,
        alignByEventType,
        hiddenEventTypes: nextState.hiddenEventTypes
      });
    }
    if (
      this.props.width !== nextProps.width ||
      this.props.height !== nextProps.height ||
      nextState.graph
    ) {
      const { graph, scales: prevScales } = this.state;
      nextState.visualizationWidth = this.state.visualizationWidth;
      nextState.scales = this.getScales(
        nextState.graph || graph,
        nextState.visualizationWidth,
        nextProps.height
      );
      if (!nextState.hiddenEventTypes) {
        nextState.scales[NODE_COLOR_SCALE].scale =
          prevScales[NODE_COLOR_SCALE].scale;
      }
    }
    if (Object.keys(nextState).length > 0) {
      nextState.selectedNode = null;
      this.setState(nextState);
    }
  }

  getGraph({
    data,
    alignByIndex,
    alignByEventType,
    hiddenEventTypes,
    minEventCount
  }) {
    // the graph is built from a root event derived from event type + index
    return buildGraph({
      cleanedEvents: data,
      getStartIndex: eventSequence =>
        findNthIndexOfX(
          eventSequence,
          alignByIndex,
          event =>
            alignByEventType === ANY_EVENT_TYPE ||
            event[EVENT_NAME] === alignByEventType
        ),
      ignoreEventTypes: hiddenEventTypes,
      minEventCount
    });
  }

  getScales(graph, width, height) {
    const innerWidth = width - VIS_MARGIN.left - VIS_MARGIN.right;
    const innerHeight = height - VIS_MARGIN.top - VIS_MARGIN.bottom;
    console.time('buildScales');
    const scales = buildAllScales(graph, innerWidth, innerHeight);
    console.timeEnd('buildScales');

    return scales;
  }

  handleToggleShowControls() {
    const { height } = this.props;
    const { showControls: prevShowControls, graph } = this.state;
    const showControls = !prevShowControls;
    const visualizationWidth = this.state.visualizationWidth;

    this.setState({
      visualizationWidth,
      // use the previous color scale in case event types are hidden
      scales: {
        ...this.getScales(graph, visualizationWidth, height),
        [NODE_COLOR_SCALE]: this.state.scales[NODE_COLOR_SCALE]
      },
      showControls
    });
  }

  handleAlignByIndex(alignByIndex) {
    const { data, height } = this.props;

    const graph = this.getGraph({
      data,
      alignByIndex,
      alignByEventType: this.state.alignByEventType,
      hiddenEventTypes: this.state.hiddenEventTypes,
      minEventCount: this.state.minEventCount
    });

    const scales = {
      // use the previous color scale in case event types are hidden
      ...this.getScales(graph, this.state.visualizationWidth, height),
      [NODE_COLOR_SCALE]: this.state.scales[NODE_COLOR_SCALE]
    };
    this.setState({ alignByIndex, graph, scales });
  }

  handleAlignByEventType(alignByEventType) {
    const { data, height } = this.props;

    const graph = this.getGraph({
      data,
      alignByEventType,
      alignByIndex: this.state.alignByIndex,
      hiddenEventTypes: this.state.hiddenEventTypes,
      minEventCount: this.state.minEventCount
    });

    const scales = {
      // use the previous color scale in case event types are hidden
      ...this.getScales(graph, this.state.visualizationWidth, height),
      [NODE_COLOR_SCALE]: this.state.scales[NODE_COLOR_SCALE]
    };
    this.setState({ alignByEventType, graph, scales });
  }

  handleClickLegend(eventType) {
    const { data, height } = this.props;
    const { hiddenEventTypes, visualizationWidth } = this.state;

    const nextHiddenEventTypes = {
      ...hiddenEventTypes,
      [eventType]: !hiddenEventTypes[eventType]
    };

    const graph = this.getGraph({
      data,
      alignByEventType: this.state.alignByEventType,
      alignByIndex: this.state.alignByIndex,
      hiddenEventTypes: nextHiddenEventTypes,
      minEventCount: this.state.minEventCount
    });

    const scales = {
      // use the previous color scale in case event types are hidden
      ...this.getScales(graph, visualizationWidth, height),
      [NODE_COLOR_SCALE]: this.state.scales[NODE_COLOR_SCALE]
    };

    this.setState({ graph, scales, hiddenEventTypes: nextHiddenEventTypes });
  }

  handleMinEventCountChange(minEventCount) {
    const { data, height } = this.props;
    const {
      alignByIndex,
      visualizationWidth,
      alignByEventType,
      hiddenEventTypes
    } = this.state;

    const graph = this.getGraph({
      data,
      alignByIndex,
      alignByEventType,
      hiddenEventTypes,
      minEventCount
    });

    const scales = {
      // use the previous color scale in case event types are hidden
      ...this.getScales(graph, visualizationWidth, height),
      [NODE_COLOR_SCALE]: this.state.scales[NODE_COLOR_SCALE]
    };

    this.setState({ graph, scales, minEventCount });
  }

  render() {
    const {
      alignByIndex,
      alignByEventType,
      orderBy,
      hiddenEventTypes,
      graph,
      scales,
      showControls,
      minEventCount,
      xScaleType,
      yScaleType,
      visualizationWidth,
      selectedNode
    } = this.state;

    const { width, height } = this.props;

    let { metaData } = graph;
    if (selectedNode) {
      // use meta data from selected subtree
      metaData = {
        ...metaData,
        ...getEventCountLookup({ [selectedNode.id]: selectedNode })
      };
    }

    return (
      <div style={{ position: 'relative', width, height }}>
        <Visualization
          onClickNode={node => {
            this.setState({ selectedNode: node });
          }}
          width={visualizationWidth}
          height={height}
          graph={graph}
          xScale={scales[xScaleType]}
          yScale={scales[yScaleType]}
          timeScale={scales[ELAPSED_TIME_SCALE]}
          colorScale={scales[NODE_COLOR_SCALE]}
          nodeSorter={nodeSorters[orderBy]}
        />
        <ControlPanel
          showControls={showControls}
          alignByIndex={alignByIndex}
          alignByEventType={alignByEventType}
          minEventCount={minEventCount}
          orderBy={orderBy}
          colorScale={scales[NODE_COLOR_SCALE]}
          xScaleType={xScaleType}
          onToggleShowControls={this.handleToggleShowControls}
          onChangeAlignByEventType={this.handleAlignByEventType}
          onChangeAlignByIndex={this.handleAlignByIndex}
          onChangeMinEventCount={this.handleMinEventCountChange}
          onClickLegendShape={this.handleClickLegend}
          onChangeXScale={type => {
            this.setState({ xScaleType: type });
          }}
          onChangeOrderBy={value => {
            this.setState({ orderBy: value });
          }}
          metaData={metaData}
          hiddenEventTypes={hiddenEventTypes}
          width={visualizationWidth}
        />
      </div>
    );
  }
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default App;
