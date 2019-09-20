import * as base from '@jupyter-widgets/base';
import * as plugin from './index';

module.exports = {
  id: 'ntnu-process-mining',
  requires: [base.IJupyterWidgetRegistry],
  activate: (app, widgets) => {
    widgets.registerWidget({
      name: 'ntnu-process-mining',
      version: plugin.version,
      exports: plugin
    });
  },
  autoStart: true
};
