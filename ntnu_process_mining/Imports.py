from ntnu_process_mining import EventFlow
import os
from pm4py.algo.discovery.dfg import factory as dfg_factory
from pm4py.objects.log.adapters.pandas import csv_import_adapter
from pm4py.algo.discovery.dfg.adapters.pandas import df_statistics
from pm4py import util as pmutil
from pandas import read_csv
from IPython.display import HTML




def Event(file_in):
    
    file = read_csv(os.path.join("files", "input_data", file_in))
    
    log = csv_import_adapter.convert_timestamp_columns_in_df(file, timest_columns=['timestamp'])

    events = []
    for index, row in log.iterrows():
        events.append({
            "ENTITY_ID": row['case_id'],
            "TS": row['timestamp'],
            "EVENT_NAME": f"{row['activity']}-{row['lifecycle']}"
        })
    
    ef = EventFlow()
    ef.value = events
    return  ef

def Style():
    return HTML('<style>.Select-multi-value-wrapper{height:2ch;} .Select-multi-value-wrapper input{display:none;} .Select-input{display:none;}</style>')
