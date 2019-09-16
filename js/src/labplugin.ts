import * as plugin from './index';
import * as base from '@jupyter-widgets/base';

module.exports = {
  id: 'ntnu-process-mining',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
    widgets.registerWidget({
      name: 'ntnu-process-mining',
      version: plugin.version,
      exports: plugin
    });
  },
  autoStart: true
};
