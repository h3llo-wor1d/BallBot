const WebSocket = require("ws").Server;
const HttpsServer = require('https').createServer;
const WebSocketServer = require('ws').Server;
const fs = require('fs');
const broadcastEvent = require("../functions/broadcastEvent");

module.exports = () => {
    var wss;
    var server = false;

    if (process.platform === "linux") {
        server = HttpsServer({
            cert: fs.readFileSync('/etc/letsencrypt/live/ballbot.projectmuse.live/fullchain.pem'),
            key: fs.readFileSync('/etc/letsencrypt/live/ballbot.projectmuse.live/privkey.pem')
        })
        wss = new WebSocket({
            server: server
        });
    } else {
        wss = new WebSocketServer({
            port: "3030",
        })
    }

    console.log("Serving WebSockets over port 3030!")

    

    wss.on('connection', function connection(ws) {
        global.wsConnections.push(ws)
        // send initial data
        ws.send(JSON.stringify({
            type: "init",
            content: {
                currentUser: global.currentUser === "" ? null : global.currentUser,
                currentUserData: Object.keys(global.currentUserData).length === 0 ? null : global.currentUserData,
                avatar: global.currentUserAvatar
            }
        }))

        console.log("wss >> connection opened")
        console.log("wss >> new connection count ->",global.wsConnections.length);

        ws.on('message', function message(data, isBinary) {
            const message = isBinary ? data : data.toString();
            if (message !== "heartbeat") {
                if (message.startsWith('timer')) {
                    console.log("ws >> handling timer actions...");
                    switch(message.split('.')[2]) {
                        case "start":
                            global.paused = false;
                            global.endTime = new Date(Date.now() + 60*60*1000).getTime();
                            broadcastEvent("timer-start", {
                                endsAt: global.endTime
                            })
                            break;
                        case "stop":
                            global.endTime === false;
                            fs.writeFileSync(`./finished/${global.currentUser}`, JSON.stringify(global.currentUserData, null, 4));
                            global.currentUser = "";
                            global.currentUserAvatar = "";
                            global.currentUserData = {};
                            broadcastEvent("timer-complete", {value: true});
                            break;
                        case "init":
                            if (global.endTime !== false) {
                                broadcastEvent("timer-start", {
                                    endsAt: global.endTime
                                })
                            }
                            break;
                    }
                    return;
                }
                if (message.startsWith(user)) {
                    // user actions
                    console.log("Skipping user prolly...");
                    // todo: implement
                }
            }
        });

        ws.on('error', console.error);
        
        ws.on('close', () => {
            console.log("wss >> connection closed")
            global
                .wsConnections
                .splice(global.wsConnections.indexOf(ws), 1);
            console.log("wss >> new connection count ->",global.wsConnections.length)
        })
    });

    if (server)
    server.listen(3030, () => {
        console.log('BallBot Websocket SSL Server Running On Port 3030!')
    });
}