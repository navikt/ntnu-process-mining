ntnu-process-mining
===============================

Enabling the use of event logs to create rich interactive process and event-flow visualisations in jupyter notebooks with a few lines of code.

Installation
------------

To install use pip:

    $ pip install ntnu_process_mining
    $ jupyter nbextension enable --py --sys-prefix ntnu_process_mining

To install for jupyterlab

    $ jupyter labextension install ntnu_process_mining

For a development installation (requires npm),

    $ git clone https://github.com/navikt/ntnu-process-mining.git
    $ cd ntnu-process-mining
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --sys-prefix ntnu_process_mining
    $ jupyter nbextension enable --py --sys-prefix ntnu_process_mining
