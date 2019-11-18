import { DOMWidgetModel } from '@jupyter-widgets/base';

export class TraceExplorerModel extends DOMWidgetModel {
  public defaults() {
    return {
      ...DOMWidgetModel.prototype.defaults(),
      _model_name: 'TraceExplorerModel',
      _view_name: 'TraceExplorer',
      _model_module: 'ntnu-process-mining',
      _view_module: 'ntnu-process-mining',
      _model_module_version: '0.1.0',
      _view_module_version: '0.1.0',
      value: []
    };
  }
}
