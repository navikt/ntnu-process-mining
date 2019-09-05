FROM jupyter/scipy-notebook

USER root

RUN apt-get update && apt-get install -y --no-install-recommends graphviz && rm -rf /var/lib/apt/lists/*

USER $NB_UID

RUN pip install pm4py


