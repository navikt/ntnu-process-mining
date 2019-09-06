docker run -it \
    -p 8888:8888 \
    -v "$(pwd)/work:/home/jovyan/work" \
    -v "$(pwd)/..:/ntnu-process-mining" \
    ntnu-process-mining-notebook $1
