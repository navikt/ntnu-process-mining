import ipywidgets as widgets
from traitlets import Unicode, Dict, List
import collections
import itertools
from pm4py.objects.log.adapters.pandas import csv_import_adapter
from ntnu_process_mining.utils.events_to_traces import convert_to_traces


@widgets.register
class TraceComparison(widgets.DOMWidget):

    _view_name = Unicode("TraceComparisonView").tag(sync=True)
    _model_name = Unicode("TraceComparisonModel").tag(sync=True)
    _view_module = Unicode("ntnu-process-mining").tag(sync=True)
    _model_module = Unicode("ntnu-process-mining").tag(sync=True)
    _view_module_version = Unicode("^0.1.0").tag(sync=True)
    _model_module_version = Unicode("^0.1.0").tag(sync=True)
    result = Dict({}).tag(sync=True)
    activities = List([]).tag(sync=True)
    trace = List([]).tag(sync=True)

    def __init__(
        self,
        df,
        timestamp_field="timestamp",
        case_id_field="case_id",
        activity_field="activity",
    ):

        super(TraceComparison, self).__init__()

        self.timestamp_field = timestamp_field
        self.case_id_field = case_id_field
        self.activity_field = activity_field

        self.event_log = csv_import_adapter.convert_timestamp_columns_in_df(
            df, timest_columns=[timestamp_field]
        )
        self.observe(self.on_trace_change, names="trace")
        self.activities = self.event_log[self.activity_field].unique().tolist()
        self.on_trace_change()

    def on_trace_change(self, change={}):
        result = _find_similar_traces(
            self.event_log,
            self.trace,
            top_n=5,
            timestamp_field=self.timestamp_field,
            case_id_field=self.case_id_field,
            activity_field=self.activity_field,
        )
        self.result = result


def _levenshtein_distance(a, b):
    n, m = len(a), len(b)
    if n > m:
        a, b = b, a
        n, m = m, n

    current = range(n + 1)
    for i in range(1, m + 1):
        previous, current = current, [i] + [0] * n
        for j in range(1, n + 1):
            add, delete = previous[j] + 1, current[j - 1] + 1
            change = previous[j - 1]
            if a[j - 1] != b[i - 1]:
                change = change + 1
            current[j] = min(add, delete, change)

    return current[n]


def _compare_traces(embedded_log, comparison_trace, top_n):
    sorted_x = sorted(
        embedded_log.items(),
        key=lambda pair: _levenshtein_distance(comparison_trace, pair[0]),
    )
    sorted_traces = collections.OrderedDict(sorted_x)
    return dict(itertools.islice(sorted_traces.items(), top_n))


def _embed_traces(log, trace, timestamp_field, case_id_field, activity_field):
    unique_traces = convert_to_traces(
        log, timestamp_field, case_id_field, activity_field
    )
    activies = log["activity"].unique()
    embedding = {}
    for i, activity in enumerate(activies):
        embedding[activity] = i

    embedded_log = {}
    for k, v in unique_traces.items():
        embedded = tuple([embedding[activity] for activity in k])
        embedded_log[embedded] = v

    embedded_trace = [embedding[activity] for activity in trace]

    inverse_embedding = {v: k for k, v in embedding.items()}
    return embedded_log, embedded_trace, inverse_embedding


def _find_similar_traces(
    log, trace, top_n, timestamp_field, case_id_field, activity_field
):
    embedded_log, embedded_trace, inverse_embedding = _embed_traces(
        log, trace, timestamp_field, case_id_field, activity_field
    )
    result = _compare_traces(embedded_log, embedded_trace, top_n)
    similar_traces = {}
    for k, v in result.items():
        inv_embedded = tuple([inverse_embedding[activity] for activity in k])
        similar_traces[inv_embedded] = v
    return similar_traces
