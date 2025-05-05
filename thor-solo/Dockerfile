FROM vechain/thor:v2.1.3

USER root

RUN apk update && apk upgrade && apk add curl

ENTRYPOINT thor solo --on-demand \
    --persist \
    --data-dir /data/thor \
    --api-addr 0.0.0.0:8669 \
    --api-cors '*' \
    --verbosity 3
