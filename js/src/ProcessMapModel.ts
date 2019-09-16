import { WidgetModel } from '@jupyter-widgets/base';

export class ProcessMapModel extends WidgetModel {
  defaults() {
    return {
      ...WidgetModel.prototype.defaults(),
      _model_name: 'ProcessMapModel',
      _view_name: 'ProcessMap',
      _model_module: 'ntnu-process-mining',
      _view_module: 'ntnu-process-mining',
      _model_module_version: '0.1.0',
      _view_module_version: '0.1.0',
      value: [{ from: 'a', to: 'b', value: 31 }]
    };
  }
}
