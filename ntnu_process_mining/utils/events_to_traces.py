def convert_to_traces(event_log, timestamp_field, case_id_field, activity_field):
    event_log = event_log.groupby(case_id_field, group_keys=False).apply(
        lambda x: x.sort_values(timestamp_field)
    )

    traces = event_log.groupby(case_id_field)[activity_field].agg(list)

    traces_dict = {}

    for trace in traces:
        traces_dict.setdefault(tuple(trace), list()).append(1)

    for a, b in traces_dict.items():
        traces_dict[a] = sum(b)

    return traces_dict
