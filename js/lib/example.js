var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');

var HelloModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
        _model_name : 'HelloModel',
        _view_name : 'HelloView',
        _model_module : 'ntnu-process-mining',
        _view_module : 'ntnu-process-mining',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
        value : 'Hello World!'
    })
});


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
        _model_name : 'ProcessMapModel',
        _view_name : 'ProcessMapView',
        _model_module : 'ntnu-process-mining',
        _view_module : 'ntnu-process-mining',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
        value : [{"from":"a", "to":"b", value:31}]
    })
});

var ProcessMapView = widgets.DOMWidgetView.extend({
    render: function() {
        this.value_changed();
        this.model.on('change:value', this.value_changed, this);
    },

    value_changed: function() {
        this.el.textContent = JSON.stringify(this.model.get('value'));
    }
});

module.exports = {
    HelloModel : HelloModel,
    HelloView : HelloView,
    ProcessMapModel: ProcessMapModel,
    ProcessMapView: ProcessMapView
};
