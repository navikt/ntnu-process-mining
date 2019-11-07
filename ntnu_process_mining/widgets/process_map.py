import datetime
import ipywidgets as widgets
from traitlets import Unicode, List, Dict, Int
from collections import Counter
from pandas import concat
from pm4py.algo.discovery.dfg.adapters.pandas import df_statistics
from pm4py.objects.log.adapters.pandas import csv_import_adapter


@widgets.register
class ProcessMap(widgets.DOMWidget):
    """Process map widget."""

    _view_name = Unicode("ProcessMap").tag(sync=True)
    _model_name = Unicode("ProcessMapModel").tag(sync=True)
    _view_module = Unicode("ntnu-process-mining").tag(sync=True)
    _model_module = Unicode("ntnu-process-mining").tag(sync=True)
    _view_module_version = Unicode("^0.1.0").tag(sync=True)
    _model_module_version = Unicode("^0.1.0").tag(sync=True)
    value = List(Dict, default_value=[{"from": "b", "to": "a", "value": 99}]).tag(
        sync=True
    )
    filter = Int(default_value=25).tag(sync=True)

    def __init__(
        self,
        df,
        timestamp_field="timestamp",
        case_id_field="case_id",
        activity_field="activity",
    ):

        super(ProcessMap, self).__init__()

        self.timestamp_field = timestamp_field
        self.case_id_field = case_id_field
        self.activity_field = activity_field
        self.df = csv_import_adapter.convert_timestamp_columns_in_df(
            df, timest_columns=[timestamp_field]
        )
        self.cases = self.df.groupby(case_id_field)
        self.activities = self.cases.agg(
            {activity_field: lambda x: "".join(x)}
        ).groupby(activity_field)
        self.sorted_activities = self.activities.size().sort_values(ascending=False)

        self.observe(self.on_filter_change, names="filter")
        self.on_filter_change()

    def get_duplicate_edges_and_sources_and_sinks(self, filtered_log):
        events = filtered_log.groupby(self.case_id_field)

        duplicate_edge_counter = Counter()
        source_list = []
        sink_list = []
        for case_id, traces in events:
            source_list.append(traces[self.activity_field].iloc[0])
            sink_list.append(traces[self.activity_field].iloc[-1])

            node_pairs = [
                (
                    traces[self.activity_field].iloc[i],
                    traces[self.activity_field].iloc[i + 1],
                )
                for i in range(len(traces) - 1)
            ]
            duplicate_edges = Counter(node_pairs) - Counter(set(node_pairs))
            duplicate_edge_counter += duplicate_edges

        return duplicate_edge_counter, Counter(source_list), Counter(sink_list)

    def on_filter_change(self, change={}):
        percentile = self.filter / 100

        traces_to_include = []
        cumulative = 0
        for trace, count in self.sorted_activities.items():
            traces_to_include.append(trace)
            cumulative += count
            if cumulative > len(self.cases) * percentile:
                break

        case_ids = concat(
            [
                self.activities.get_group(trace).index.to_series()
                for trace in traces_to_include
            ]
        )

        filtered_log = self.df[self.df[self.case_id_field].isin(case_ids)]
        dfg_frequency, dfg_performance = df_statistics.get_dfg_graph(
            filtered_log,
            measure="both",
            activity_key=self.activity_field,
            timestamp_key=self.timestamp_field,
            case_id_glue=self.case_id_field,
        )

        dfg_performance_med = df_statistics.get_dfg_graph(
            filtered_log,
            measure="performance",
            activity_key=self.activity_field,
            perf_aggregation_key="median",
            timestamp_key=self.timestamp_field,
            case_id_glue=self.case_id_field,
        )

        (
            duplicate_edges,
            sources,
            sinks,
        ) = self.get_duplicate_edges_and_sources_and_sinks(filtered_log)

        abs_dfg = Counter(dfg_frequency) - duplicate_edges
        pm_edges = []

        for dst, freq in sources.items():
            abs_freq = freq
            pm_edges.append(
                {
                    "from": "START",
                    "to": dst,
                    "freq": freq,
                    "abs_freq": abs_freq,
                    "perf": "0",
                    "perf_med": "0",
                }
            )

        for (src, dst), freq in dfg_frequency.items():
            abs_freq = abs_dfg[(src, dst)] if abs_dfg[(src, dst)] else 0
            pm_edges.append(
                {
                    "from": src,
                    "to": dst,
                    "freq": freq,
                    "abs_freq": abs_freq,
                    "perf": str(
                        datetime.timedelta(
                            seconds=round(dfg_performance[(src, dst)], 0)
                        )
                    ),
                    "perf_med": str(
                        datetime.timedelta(
                            seconds=round(dfg_performance_med[(src, dst)], 0)
                        )
                    ),
                }
            )

        for src, freq in sinks.items():
            abs_freq = freq
            pm_edges.append(
                {
                    "from": src,
                    "to": "END",
                    "freq": freq,
                    "abs_freq": abs_freq,
                    "perf": "0",
                    "perf_med": "0",
                }
            )

        self.value = pm_edges
