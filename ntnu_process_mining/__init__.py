from ._version import version_info, __version__

from .widgets.process_map import *
from .widgets.event_flow import *
from .widgets.trace_comparison import *


def _jupyter_nbextension_paths():
    return [
        {
            "section": "notebook",
            "src": "static",
            "dest": "ntnu-process-mining",
            "require": "ntnu-process-mining/extension",
        }
    ]
