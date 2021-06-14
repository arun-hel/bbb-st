var express = require("express");
const child_process = require('child_process');
var stream = require("./bbb_stream")
const test = require("./bbb_api_test")
var app = express();
app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({extended: true,limit: '1mb'})); 
app.listen(3000, () => {
    console.log("Server running on port 3000");
   });

app.post("/api/streaming", (req, res) => {
    res.send(JSON.stringify({"status" : "succuss"}))
    // console.log(`${JSON.stringify(req.body)} \n`)
    var MEETING_ID = req.body["MEETING_ID"]
    var MODORATOR_PW = req.body["MODORATOR_PW"]
    var HIDE_PRESENTATION = req.body["HIDE_PRESENTATION"]
    var HIDE_CHAT = req.body["HIDE_CHAT"]
    var HIDE_USER_LIST = req.body["HIDE_USER_LIST"]
    var RTMP_URL = req.body["RTMP_URL"]
    var VIEWER_URL = req.body["VIEWER_URL"]
    if (RTMP_URL && MEETING_ID){
        stream.Log(MEETING_ID, MODORATOR_PW,HIDE_PRESENTATION,HIDE_CHAT,HIDE_USER_LIST,RTMP_URL,VIEWER_URL)
        stream.Start(MEETING_ID, MODORATOR_PW,HIDE_PRESENTATION,HIDE_CHAT,HIDE_USER_LIST,RTMP_URL,VIEWER_URL)
    }
});

app.get("/api/test", (req, res) => {
    res.send("Ok...\n")
    var MEETING_ID = req.body["MEETING_ID"]
    var MODORATOR_PW = req.body["MODORATOR_PW"]
    var HIDE_PRESENTATION = req.body["HIDE_PRESENTATION"]
    var HIDE_CHAT = req.body["HIDE_CHAT"]
    var HIDE_USER_LIST = req.body["HIDE_USER_LIST"]
    var RTMP_URL = req.body["RTMP_URL"]
    var VIEWER_URL = req.body["VIEWER_URL"]
    test.t(MEETING_ID, MODORATOR_PW,HIDE_PRESENTATION,HIDE_CHAT,HIDE_USER_LIST,RTMP_URL,VIEWER_URL)
    console.log("OK")
});