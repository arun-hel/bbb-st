function Start(MEETING_ID, MODORATOR_PW,HIDE_PRESENTATION,HIDE_CHAT,HIDE_USER_LIST,RTMP_URL,VIEWER_URL){
    const puppeteer = require('puppeteer');
const Xvfb = require('xvfb');
const child_process = require('child_process');
const bbb = require('bigbluebutton-js')
// variables
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
let http = bbb.http
var disp_num = Math.floor(Math.random() * (200 - 99) + 99);
var xvfb = new Xvfb({
    displayNum: disp_num,
    silent: true,
    xvfb_args: ["-screen", "0", "1280x800x24", "-ac", "-nolisten", "tcp", "-dpi", "96", "+extension", "RANDR"]
});
var width       = 1280;
var height      = 720;
var options     = {
  headless: false,
  args: [
    '--disable-infobars',
    '--no-sandbox',
    '--shm-size=2gb',
    '--disable-dev-shm-usage',
    `--window-size=${width},${height}`,
    '--start-fullscreen',
  ],
}

options.executablePath = "/usr/bin/google-chrome"

async function main() {
    
    // Checks if  meeting running for a given MEETING_ID and returns true|false
    function IS_MEETING_RUNNING(meetingID){
        let meet = api.monitoring.isMeetingRunning(MEETING_ID) 
        var status = http(meet).then((result) => {
            return result["running"] 
        })
        return status
    }
    // timer fuction
    function timer(ms) { return new Promise(res => setTimeout(res, ms)); }

    var running = await IS_MEETING_RUNNING(MEETING_ID);

    // If meeting not running wait until meeting to start,
    // Check meeting status every 5 sec util meeting running.
    while(!running){
        running = await IS_MEETING_RUNNING(MEETING_ID);
        console.log("Meeting is not running, We will check in 5 sec ...")
        await timer(5000);
    }

    let browser, page;

    try{
        xvfb.startSync()

        
        var JOIN_PARAM = {
            'userdata-bbb_force_listen_only' : 'true',
            'userdata-bbb_listen_only_mode': 'true',
            'userdata-bbb_skip_check_audio': 'true'          
         } 

        //  Hides presentation if HIDE_PRESENTATION is true
         if (HIDE_PRESENTATION == 'true'){
             JOIN_PARAM['userdata-bbb_auto_swap_layout'] = 'true'
         }

        //  Create Join url 
        let url = api.administration.join('Live Stream', MEETING_ID, MODORATOR_PW, JOIN_PARAM)      
        browser = await puppeteer.launch(options)
        const pages = await browser.pages()
        page = pages[0]
        // page.on('console', msg => {
        //     var m = msg.text();
        //     console.log('PAGE LOG:', m) // uncomment if you need
        // });
        await page._client.send('Emulation.clearDeviceMetricsOverride')
        await page.goto(url, {waitUntil: 'networkidle2'})
        await page.setBypassCSP(true)

        // Select Listen only mode
        await page.waitForSelector('[aria-label="Listen only"]');
        await page.click('[aria-label="Listen only"]', {waitUntil: 'domcontentloaded'});
        await page.waitForXPath('/html/body/div[5]/div/div',{hidden:true})

        // Hide User List
        if (HIDE_USER_LIST == 'true'){
            // Hides user list if HIDE_USER_LIST is true
            await page.waitForSelector('#app > main > section > div:nth-child(2)', {waitUntil: 'domcontentloaded'})
            .then(()=> page.$eval('#app > main > section > div:nth-child(2)', element => element.style.display = "none"));
       
            // hides padding of user list
            page.$eval('#app > main > section > div:nth-child(3)', element => element.style.display = "none");
        }

        // Hides chat is HIDE_CHAT is true
        if(HIDE_CHAT == 'true'){
            await page.waitForSelector('button[aria-label="Hide Public Chat"]');
            await page.click('button[aria-label="Hide Public Chat"]', {waitUntil: 'domcontentloaded'});
        }

        // Send VIEWER_URL in chat only if chat is enabled in .env
        if((HIDE_CHAT == 'false') && (VIEWER_URL.length>0)){
            try{
                await page.waitForSelector('[id="message-input"]');
                await page.focus('[id="message-input"]', {waitUntil: 'domcontentloaded'})
                await page.keyboard.type(`Visit this url to view live stream  ${VIEWER_URL}`)
                await page.click('button[aria-label="Send message"]', {waitUntil: 'domcontentloaded'});
            }
            catch(err){
                console.log(err)
            }
        }
        else{
            console.warn("Could\'t send viewer url, Please enable chat")
        }
        await page.$eval('.Toastify', element => element.style.display = "none"); // Hide Toast alerts
        await page.waitForSelector('button[aria-label="Change/Leave audio"]');    // Wait until Change/Leave audio button appearence

        // Hide bottom action bar
        await page.$eval('[class^=actionsbar] > [class^=center]' , element => element.style.display = "none");        
        await page.$eval('[class^=actionsbar] > [class^=left]' , element => element.style.display = "none");        
        await page.$eval('[class^=actionsbar] > [class^=right]' , element => element.style.display = "none"); 
        
        //Hide Top navbar icon execpt meeting title 
        await page.$eval('[class^=navbar] > [class^=top] > [class^=left]' , element => element.style.display = "none"); 
        await page.$eval('[class^=navbar] > [class^=top] > [class^=right]' , element => element.style.display = "none");     
        
        // Hide mouse
        await page.mouse.move(0, 700);
        await page.addStyleTag({content: '@keyframes refresh {0%{ opacity: 1 } 100% { opacity: 0.99 }} body { animation: refresh .01s infinite }'});

        //  ffmpeg screen record start
         const ls = child_process.spawn('sh',
                    ['start.sh',' ',`${RTMP_URL}`,' ', `${disp_num}`],
                    { shell: true });
        
                    ls.stdout.on('data', (data) => {
                        console.log(`stdout: ${data}`);
                    });
                
                    ls.stderr.on('data', (data) => {
                        console.error(`stderr: ${data}`);
                    });
                
                    ls.on('close', (code) => {
                        console.log(`child process exited with code ${code}`);});
  
        await page.waitForSelector('[data-test="meetingEndedModal"]', {timeout: 0});

        console.log("meeting ended")


        const rec = child_process.spawn('sh',
                    ['stop.sh'],
                    { shell: true });
        
                    rec.stdout.on('data', (data) => {
                        console.log(`stdout: ${data}`);
                    });
                
                    rec.stderr.on('data', (data) => {
                        console.error(`stderr: ${data}`);
                    });
                
                    rec.on('close', (code) => {
                        console.log(`child process exited with code ${code}`);});



    }catch(err) {
        console.log(err)
    } finally {
        page.close && await page.close()
        browser.close && await browser.close()
        xvfb.stopSync()
        
    }
}
main()
}
// var VIEWER_URL = process.env.VIEWER_URL
function Log(MEETING_ID, MODORATOR_PW,HIDE_PRESENTATION,HIDE_CHAT,HIDE_USER_LIST,RTMP_URL,VIEWER_URL){
    console.log(`
    MEETING_ID: ${MEETING_ID}
    MODORATOR_PW: ${MODORATOR_PW}
    HIDE_PRESENTATION: ${HIDE_PRESENTATION}
    HIDE_CHAT: ${HIDE_CHAT}
    HIDE_USER_LIST: ${HIDE_USER_LIST}
    RTMP_URL: ${RTMP_URL}
    VIEWER_URL: ${VIEWER_URL}
    `)
}
module.exports = {Start,Log}

