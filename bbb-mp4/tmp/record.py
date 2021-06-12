#!/usr/bin/env python # -*- coding: utf-8 -*-

import sys, subprocess, shlex, logging, os, re

from bigbluebutton_api_python import BigBlueButton, exception
from bigbluebutton_api_python import util as bbbUtil
import get_meeting 

# param =

logging.basicConfig(level=os.environ.get("LOGLEVEL", "INFO"))

bbb = BigBlueButton(get_meeting.server, get_meeting.secret)
bbbUB = bbbUtil.UrlBuilder(get_meeting.server, get_meeting.secret)
      
      
def get_join_url(params):
	params = params
	try:
		params = params.split(" ")
		joinParams = {}
		joinParams['meetingID'] = params[0]
		joinParams['fullName'] = params[1]
		joinParams['password'] = params[2]
		return bbbUB.buildUrl("join", params=joinParams) 
	except:
		logging.info("No Meeting")

def create_join_url(id):
    meeting_url = get_join_url(get_meeting.url_param(id))
    return recorder_(meeting_url,id)
    
def recorder_(meeting_url,id):
    meeting_url = meeting_url
    id = id
    params = get_meeting.url_param(id)
    try:
        params = params.split(" ")
        bot_join = 'sudo docker run --rm -d'
                     + meeting_url + ' ' + params[3] 
        bot_args = shlex.split(bot_join)
        return subprocess.Popen(bot_args)
    except:
        logging.info("No Meeting url")
        

idlist = get_meeting.bbb_record_join(bbbUB.bbbServerBaseUrl)
print(idlist)
for id in idlist:
    recorder_(create_join_url(id),id)
    