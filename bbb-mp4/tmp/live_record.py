#!/usr/bin/env python # -*- coding: utf-8 -*-

import sys, subprocess, shlex, logging, os, re

from bigbluebutton_api_python import BigBlueButton, exception
from bigbluebutton_api_python import util as bbbUtil
import  sys, os, logging, urllib, json
from bigbluebutton_api_python import BigBlueButton

logging.basicConfig(level=os.environ.get("LOGLEVEL", "INFO"))

server = "https://bbb1.bmhss.online/bigbluebutton/"
secret = "STAQFPFjUzOSEeALBj2ZbBPyX6ECfCmUNjvvWugfuc"
bbb  = BigBlueButton(server, secret)
bbbUB = bbbUtil.UrlBuilder(server,secret)

def get_meeting(server):
    logging.info("fetching meetings from {}".format(server))
    try:
        meetingsXML = bbb.get_meetings()
        if meetingsXML.get_field('returncode') == 'SUCCESS':
            if  meetingsXML.get_field('meetings') == '':
               
                return []
            else:
                rawMeetings = meetingsXML.get_field('meetings')['meeting']
                if isinstance(rawMeetings, list):
                   
                    return json.loads(json.dumps(rawMeetings))
                else:
                    
                    return [json.loads(json.dumps(rawMeetings))]
        else:
            logging.error("api request failed")
            return []
    except urllib.error.URLError as ERR:
        logging.error(ERR)
        return []


def is_meetings_happening(meetings):
    if meetings:
        return True
    else:
        return False

def is_recording_enabled(meeting):
    return  meeting[0]['recording'] == "true"

def is_bot_joined(meeting):
    attendies_list = []
    attendies = meeting['attendees']['attendee']
    try:
        for user_ in attendies:
            attendies_list.append(user_['fullName'])
        return "bbb-reorder" in attendies_list
        
    except:
        attendies = [meeting['attendees']['attendee']]
        for user_ in attendies:
            attendies_list.append(user_['fullName'])
        return "bbb-reorder" in attendies_list
        
def get_meeting_params(meetings):
    meeting_ids = []
    attendeepw = []
    internal_meeting_id = []
    for meeting in meetings:
        meeting_ids.append(meeting['meetingID'])
        attendeepw.append(meeting['attendeePW'])
        internal_meeting_id.append(meeting['internalMeetingID'])
    return (meeting_ids, attendeepw, internal_meeting_id)

      
def start_recording(meeting_id, ap, internal_meeting_id):
    joinParams = {}
    joinParams['meetingID'] = meeting_id
    joinParams['fullName'] = "bbb-recorder"
    joinParams['password'] = ap
    join_url = bbbUB.buildUrl("join", params=joinParams)
    bot_join = 'sh start-recording.sh ' + join_url + ' ' + internal_meeting_id + internal_meeting_id
    bot_args = shlex.split(bot_join)
    # return bot_args
    return subprocess.Popen(bot_args)

meetings = get_meeting(server)
meeting_ids, a_passwords, internal_meeting_ids = get_meeting_params(meetings)
print(meeting_ids, a_passwords, internal_meeting_ids)
i = 0
if is_meetings_happening(meetings):
    for meeting in meetings:
        if is_recording_enabled(meetings):
            if is_bot_joined(meeting):
                i += 1
            else:
                start_recording(meeting_ids[i], a_passwords[i],internal_meeting_ids[i])
                i += 1

else:
    logging.info("No meetings in {}".format(server))