#!/usr/bin/env python3
# -*- coding: utf-8 -*-

### to use this script you will need to ###
# apt install pip3
# pip3 install bigbluebutton_api_python

import  sys, os, logging, urllib, json
from bigbluebutton_api_python import BigBlueButton

logging.basicConfig(level=os.environ.get("LOGLEVEL", "INFO"))

server = "https://bbb1.bmhss.online/bigbluebutton/"
secret = "STAQFPFjUzOSEeALBj2ZbBPyX6ECfCmUNjvvWugfuc"
bbb  = BigBlueButton(server, secret)

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

def bbb_record_join(server):
    meetings = get_meeting(server)
    old_meet = []
    meeting_ids = []
    idbook = open('meetingids.txt', 'r')
    meeting_ids = [x.strip() for x in idbook.readlines()]
    idbook.close()
    for meeting in meetings:
        if(bbb.is_meeting_running( meeting['meetingID']).get_field('running') == 'true'):
            old_meet.append(meeting['meetingID'])
    dump_list =list(set(old_meet)-set(meeting_ids)) 
    idbook = open('meetingids.txt', 'w')
    for id in old_meet:
        id = id + "\n"
        idbook.write(id)
    idbook.close()
    return dump_list

def url_param(meetingID):
    meetings = bbb.get_meeting_info(meetingID)
    return meetings.get_field('meetingID') + " " + "bbb-reorder " + meetings.get_field('attendeePW') + " " + meetings.get_field('internalMeetingID')