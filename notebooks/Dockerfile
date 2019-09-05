FROM jupyter/scipy-notebook

USER root
RUN apt-get update && apt-get install -y --no-install-recommends graphviz && rm -rf /var/lib/apt/lists/*
USER $NB_UID

RUN pip install pm4py

USER root
RUN mkdir /ntnu-process-mining
RUN chown -R $NB_UID /ntnu-process-mining

COPY --chown=$NB_UID MANIFEST.in /ntnu-process-mining/MANIFEST.in
COPY --chown=$NB_UID js /ntnu-process-mining/js
COPY --chown=$NB_UID ntnu_process_mining /ntnu-process-mining/ntnu_process_mining
COPY --chown=$NB_UID setup.cfg /ntnu-process-mining/setup.cfg
COPY --chown=$NB_UID setup.py /ntnu-process-mining/setup.py
COPY --chown=$NB_UID ntnu-process-mining.json /ntnu-process-mining/ntnu-process-mining.json

USER $NB_UID

RUN pip install -e /ntnu-process-mining
RUN jupyter nbextension install --py --symlink --sys-prefix ntnu_process_mining
RUN jupyter nbextension enable --py --sys-prefix ntnu_process_mining
