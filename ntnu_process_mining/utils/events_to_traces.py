from pandas import read_csv
import pandas as pd


def read_event_log(path):
    log = read_csv(path)
    log["timestamp"] = pd.to_datetime(log.timestamp)
    return log


def convert_to_traces(event_log):
    event_log = event_log.groupby("case_id", group_keys=False).apply(
        lambda x: x.sort_values(("timestamp"))
    )

    traces = event_log.groupby("case_id")["activity"].agg(list)

    traces_dict = {}

    for trace in traces:
        traces_dict.setdefault(tuple(trace), list()).append(1)

    for a, b in traces_dict.items():
        traces_dict[a] = sum(b)

    return traces_dict
