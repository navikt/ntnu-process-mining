import os
from ntnu_process_mining.utils.events_to_traces import convert_to_traces, read_event_log

path = os.path.join("notebooks", "work", "files", "input_data", "sepsis.csv")
log = read_event_log(path)

unique_traces = convert_to_traces(log, apply_filter=True)

# Embedding
activies = log.activity.unique()
embedding = {}
for i, activity in enumerate(activies):
    embedding[activity] = i


embedded_traces = {}
for k, v in unique_traces.items():
    embedded = tuple([embedding[activity] for activity in k])
    embedded_traces[embedded] = v
print(embedded_traces)


def levenshtein_distance(a, b):
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
