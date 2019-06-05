var http = require("http");
var fs = require("fs");
var turn = 1
var users = []
var gameStarted = false
var qs = require("querystring")
var socketio = require("socket.io")
var Datastore = require('nedb')

var coll1 = new Datastore({
    filename: 'kolekcja.db',
    autoload: true
});
var chess = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]
let ruchNumber = 0
var server = http.createServer(function (req, res) {
    console.log(req.url)
    if (req.url == "/index.html") {
        fs.readFile("index.html", function (error, data) {
            if (error) {
                res.writeHead(404, {
                    'Content-Type': 'text/html;charset=utf-8'
                });
                res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                res.end();
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/html;charset=utf-8'
                });
                res.write(data);
                res.end();
            }
        });
    } else if (req.url == "/static/css/style.css") {
        console.log("ok css")
        fs.readFile("static/css/style.css", function (error, data) {
            if (error) {
                res.writeHead(404, {
                    'Content-Type': 'text/html;charset=utf-8'
                });
                res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                res.end();
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/css;charset=utf-8'
                });
                res.write(data);
                res.end();
            }
        });
    } else if (req.url == "/upload") {

        var allData = "";
        req.on("data", function (data) {
            //   console.log("data: " + data)
            allData += data;

        })
        req.on("end", function (data) {
            var finishObj = qs.parse(allData)

            switch (finishObj.action) {

                case "login":
                    if (users.length < 2 && users.indexOf(finishObj.name) == -1) {
                        users.push(finishObj.name) //dodanie usera
                        console.log("dodaję" + finishObj.name)
                        console.log("userzy: " + users)
                        res.end(JSON.stringify({
                            status: "success",
                            name: finishObj.name,
                            id: users.indexOf(finishObj.name) //zwrócenie id
                        }))
                    } else if (users.length >= 2) {
                        res.end(JSON.stringify({
                            status: "outnumbered"
                        }))
                    } else if (users.indexOf(finishObj.name) != -1) {
                        res.end(JSON.stringify({
                            status: "occupied"
                        }))
                    }
                    /*
                    if (users.length = 2) {
                        client.broadcast.emit(ready, {
                            users: users,
                        })
                    }
                    */
                    break;
                case "reset":
                    console.log("resetting game")
                    users = []
                    break;
                case "check": //czekanie na przeciwnika
                    if (users.length == 2) {
                        res.end(JSON.stringify({
                            status: "ready",
                            opponent: users[Number(!users.indexOf(finishObj.name))],
                            id: users.indexOf(finishObj.name)
                        }))
                    }
                    /* else {
                        res.end(JSON.stringify({
                            status: "nready"
                        }))
                    }
                    */
                    break;
                case "move":
                    move = decodeURIComponent(finishObj.table)
                    changeturn()
                    res.end(JSON.stringify({
                        status: "ok"
                    }))

                    break;
                case "checkchess":
                    res.end(JSON.stringify({
                        status: "chessready",
                        table: encodeURIComponent(JSON.stringify(chess)),
                        "turn": turn
                    }))
                    break;
            }
        })
        //       }
    } else {
        fs.readFile(req.url.substring(1), function (error, data) {
            if (error) {
                res.writeHead(404, {
                    'Content-Type': 'text/html;charset=utf-8'
                });
                res.write("<h1>błąd 404 - nie ma pliku!<h1>");
                res.end();
            } else {
                //  res.writeHead(200, { 'Content-Type': 'text/css;charset=utf-8' });
                res.write(data);
                res.end();
            }
        });
    }
})

server.listen(3000, function () {
    console.log("serwer startuje na porcie 3000")
});

var io = socketio.listen(server) // server -> server nodejs

io.sockets.on("connection", function (client) {

    console.log("klient się podłączył" + client.id)

    setInterval(function () {
        if (users.length == 2 && !gameStarted) {
            io.sockets.emit("ready", {
                users: users,
            })
            gameStarted = true
        }
    }, 500)

    client.on("onconnect", function (data) {
        alert(data.clientName)
    })

    client.on("move", function (data) {
        if (data.player == 1) turn = 2
        else turn = 1
        console.log(data)
        chess[data.y][data.x] = data.player
        console.log(chess)
        ruchNumber++
        client.broadcast.emit("move", data);
    })
    client.on("login", function (data) {
        if (users.length < 2 && users.indexOf(data.name) == -1) {
            users.push(data.name) //dodanie usera
            console.log("dodaję" + data.name)
            console.log("userzy: " + users)
            /*
            res.end(JSON.stringify({
                status: "success",
                name: finishObj.name,
                id: users.indexOf(data.name) //zwrócenie id
            }))
            */
            //^logowanie na socketach
        } else if (users.length >= 2) {

        } else if (users.indexOf(data.name) != -1) {

        }


    })
    client.on("victory", function (data) {
        console.log("wiktoria")
        var currentdate = new Date();

        var datetime = currentdate.getDate() + "/" +
            (currentdate.getMonth() + 1) + "/" +
            currentdate.getFullYear() + " @ " +
            currentdate.getHours() + ":" +
            currentdate.getMinutes() + ":" +
            currentdate.getSeconds();

        //console.log(Date.now())


        var doc = {
            player1: users[0],
            player2: users[1],
            winner: users[data.winner - 1],
            moves: Math.ceil(ruchNumber / 2),
            date: datetime,
            sortBy: Date.now()
        }
        coll1.insert(doc, function (err, newDoc) {
            console.log("dodano dokument (obiekt):")
            console.log(newDoc)
            console.log("losowe id dokumentu: " + newDoc._id)
        })

        client.broadcast.emit("victory", data);
    })

    client.on("results", function (data) {
        coll1.find({}).sort({
            sortBy: 1
        }).exec(function (err, docs) {

            docsy = docs
        });
        client.broadcast.emit("aaa", data);
        setTimeout(function () {
            console.log(docsy)
            client.emit("resulty", docsy);
        }, 200)

    })

})