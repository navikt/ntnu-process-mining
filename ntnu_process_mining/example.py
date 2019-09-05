import ipywidgets as widgets
from traitlets import Unicode, List, Dict

@widgets.register
class HelloWorld(widgets.DOMWidget):
    """An example widget."""
    _view_name = Unicode('HelloView').tag(sync=True)
    _model_name = Unicode('HelloModel').tag(sync=True)
    _view_module = Unicode('ntnu-process-mining').tag(sync=True)
    _model_module = Unicode('ntnu-process-mining').tag(sync=True)
    _view_module_version = Unicode('^0.1.0').tag(sync=True)
    _model_module_version = Unicode('^0.1.0').tag(sync=True)
    value = Unicode('Hello World!').tag(sync=True)


@widgets.register
class ProcessMap(widgets.DOMWidget):
    """Process map widget."""
    _view_name = Unicode('ProcessMapView').tag(sync=True)
    _model_name = Unicode('ProcessMapModel').tag(sync=True)
    _view_module = Unicode('ntnu-process-mining').tag(sync=True)
    _model_module = Unicode('ntnu-process-mining').tag(sync=True)
    _view_module_version = Unicode('^0.1.0').tag(sync=True)
    _model_module_version = Unicode('^0.1.0').tag(sync=True)
    value = List(Dict, default_value=[{'from': 'b', 'to': 'a', 'value': 99}]).tag(sync=True)

