import ipywidgets as widgets
from traitlets import Unicode, List, Dict
from pm4py.objects.log.adapters.pandas import csv_import_adapter


@widgets.register
class EventFlow(widgets.Widget):
    """Event flow widget."""

    _model_module = Unicode("ntnu-process-mining").tag(sync=True)
    _view_module = Unicode("ntnu-process-mining").tag(sync=True)
    _view_name = Unicode("EventFlow").tag(sync=True)
    _model_name = Unicode("EventFlowModel").tag(sync=True)
    _view_module_version = Unicode("^0.1.0").tag(sync=True)
    _model_module_version = Unicode("^0.1.0").tag(sync=True)
    value = List(Dict, default_value=[]).tag(sync=True)

    def __init__(
        self,
        df,
        timestamp_field="timestamp",
        case_id_field="case_id",
        activity_field="activity",
    ):

        super(EventFlow, self).__init__()
        self.df = csv_import_adapter.convert_timestamp_columns_in_df(
            df, timest_columns=[timestamp_field]
        )
        events = []
        for index, row in self.df.iterrows():
            events.append(
                {
                    "ENTITY_ID": row[case_id_field],
                    "TS": row[timestamp_field],
                    "EVENT_NAME": row[activity_field],
                }
            )
        self.value = events
