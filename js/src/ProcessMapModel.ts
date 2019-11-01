import { DOMWidgetModel } from '@jupyter-widgets/base';

export class ProcessMapModel extends DOMWidgetModel {
  public defaults() {
    return {
      ...DOMWidgetModel.prototype.defaults(),
      _model_name: 'ProcessMapModel',
      _view_name: 'ProcessMap',
      _model_module: 'ntnu-process-mining',
      _view_module: 'ntnu-process-mining',
      _model_module_version: '0.1.0',
      _view_module_version: '0.1.0',
      value: [{ from: 'a', to: 'b', value: 31 }],
      filter: 25
    };
  }
}
