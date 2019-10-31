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
    return HTML('<style>.Select-control{.user-select: text;font-family: BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif !important;font-size: 12px !important;-webkit-box-direction: normal !important;font-weight: 700 !important;background-color: #fff;border-color: #d9d9d9 #ccc #b3b3b3;border-radius: 4px;border: 1px solid #ccc;color: #333;cursor: default;display: table;border-spacing: 0;border-collapse: separate;height: 36px;outline: 0;overflow: hidden;position: relative;width: 100%;box-sizing: border-box;} .Select-multi-value-wrapper{user-select: text;font-family: BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif !important;font-size: 12px !important;-webkit-box-direction: normal !important;font-weight: 700 !important;color: #333;cursor: default;border-spacing: 0;border-collapse: separate;box-sizing: border-box;} .Select-value{user-select: text;font-family: BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif !important;font-size: 12px !important;-webkit-box-direction: normal !important;font-weight: 700 !important;cursor: default;border-spacing: 0;border-collapse: separate;box-sizing: border-box;bottom: 0;color: #aaa;left: 0;line-height: 34px;padding-left: 10px;padding-right: 10px;position: absolute;right: 0;top: 0;max-width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}  .Select-input{user-select: text;font-family: BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif !important;font-size: 12px !important;-webkit-box-direction: normal !important;font-weight: 700 !important;color: #333;cursor: default;border-spacing: 0;border-collapse: separate;height: 34px;padding-left: 10px;padding-right: 10px;vertical-align: middle;box-sizing: border-box;display: inline-block;} .Select-arrow-zone{user-select: text;font-family: BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif !important;font-size: 12px !important;-webkit-box-direction: normal !important;font-weight: 700 !important;color: #333;border-spacing: 0;border-collapse: separate;cursor: pointer;display: table-cell;position: relative;text-align: center;vertical-align: middle;width: 25px;box-sizing: border-box;padding-right: 5px;} .Select-menu-outer{background-color: lightgrey; border-radius:2px;} .SplitPane{flex-direction: column !important; overflow: auto !important;} .Resizer.vertical{display:none;} ._lqge4f{display: flex; flex-direction: row; flex-wrap: wrap; justify-content:space-between; width: 50vw;} ._lqge4f div{margin:1%;} ._wgmchy{flex-direction:row !important} .vx-legend{height: 25vh; overflow-y:auto;}</style>')

