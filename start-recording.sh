#!usr/bin/sh
. ./.env

sudo docker run --rm -d \
                --name "$MEETING_ID" \
                --env-file .env \
                bbb-live-streaming:v1