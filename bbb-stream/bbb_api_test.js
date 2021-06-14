function t(MEETING_ID, MODORATOR_PW,HIDE_PRESENTATION,HIDE_CHAT,HIDE_USER_LIST,RTMP_URL,VIEWER_URL){
const bbb = require('bigbluebutton-js')
require('dotenv').config()
var BBB_URL = process.env.BBB_URL;
var BBB_SECRET = process.env.BBB_SECRET;
var MEETING_ID = MEETING_ID
var MODORATOR_PW = MODORATOR_PW
var HIDE_PRESENTATION = HIDE_PRESENTATION
var HIDE_CHAT = HIDE_CHAT
var HIDE_USER_LIST = HIDE_USER_LIST
var RTMP_URL =RTMP_URL
var VIEWER_URL = VIEWER_URL

let api = bbb.api(BBB_URL, BBB_SECRET)
let http = bbb.http //axios wrapper
async function main(){
function IS_MEETING_RUNNING(meetingID){
    let meet = api.monitoring.isMeetingRunning(MEETING_ID) // it givs url for isMeetingRunning api call
    var status = http(meet).then((result) => {
        return result["running"] //  return value true /false
    })
    return status
}
function timer(ms) { return new Promise(res => setTimeout(res, ms)); }
var running = await IS_MEETING_RUNNING(MEETING_ID) // it returning Promise { <pending> }
while(!running){
    running = await IS_MEETING_RUNNING(MEETING_ID);
    console.log("Meeting is not running, We will check in 5 sec ...")
    await timer(5000);
   }
   var JOIN_PARAM = {
    'userdata-bbb_force_listen_only' : 'true',
    'userdata-bbb_listen_only_mode': 'true',
    'userdata-bbb_skip_check_audio': 'true',
    'userdata-bbb_show_participants_on_login':'false'
 }
 if (HIDE_PRESENTATION){
    JOIN_PARAM['userdata-bbb_auto_swap_layout']= 'true'
 }
   let JOIN_URL = api.administration.join('Live Stream', MEETING_ID, MODORATOR_PW, JOIN_PARAM)
   console.log(JOIN_URL)
}
main()
}
module.exports = {t}