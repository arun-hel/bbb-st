var express = require("express");
const child_process = require('child_process');
// const path = require("path")
var app = express();
app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({extended: true,limit: '1mb'})); 
// app.set('views', path.join(__dirname, 'views'))

app.listen(3000, () => {
    console.log("Server running on port 3000");
   });

app.post("/api/streaming", (req, res) => {
    res.send(JSON.stringify({"status" : "success"}))
    res.send(req.body)

//     const ls = child_process.spawn('sh',
//     ['launch-docker.sh', ' ',
//         `"${key}"`
//     ],
//     {
//         shell: true
//     }
// );

// ls.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
// });

// ls.stderr.on('data', (data) => {
//     console.error(`stderr: ${data}`);
// });

// ls.on('close', (code) => {
//     console.log(`child process exited with code ${code}`);
// });

});
app.get("/api/test", (req, res) => {
    res.send("Ok...\n")
    console.log("OK")
});