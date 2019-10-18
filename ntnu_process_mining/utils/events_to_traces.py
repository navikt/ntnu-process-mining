import os
from pandas import read_csv
import pandas as pd
from collections import OrderedDict


def _read_event_log():
    log = read_csv(
        os.path.join("notebooks", "work", "files", "input_data", "sepsis.csv")
    )
    log["timestamp"] = pd.to_datetime(log.timestamp)
    return log


def convert_to_traces(event_log, apply_filter=False):
    # TODO: Cleanup
    # TODO: Remove hardcoded column names
    # TODO: Test if this works for all cases
    event_log = event_log.groupby("case_id", group_keys=False).apply(
        lambda x: x.sort_values(("timestamp"))
    )

    traces = event_log.groupby("case_id")["activity"].agg(list)

    unique_traces = {}

    for trace in traces:
        if apply_filter:
            unique_traces.setdefault(
                tuple(list(OrderedDict.fromkeys(trace))), list()
            ).append(1)
        else:
            unique_traces.setdefault(tuple(trace), list()).append(1)

    for a, b in unique_traces.items():
        unique_traces[a] = sum(b)

    # Returns dict where the trace is the key (type tuple),
    # and the count is the value (type int)
    return unique_traces
