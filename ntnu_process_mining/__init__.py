from ._version import version_info, __version__

from .process_map import *


def _jupyter_nbextension_paths():
    return [
        {
            "section": "notebook",
            "src": "static",
            "dest": "ntnu-process-mining",
            "require": "ntnu-process-mining/extension",
        }
    ]
