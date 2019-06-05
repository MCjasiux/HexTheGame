/*
Do zrobienia:
    1. płynne zaznaczanie krawędzi kostek (estetyka) - szare -> białe
    2. rozróżnienie stron graczy (zamiast pasków)
    3. oczekiwanie na przeciwnika z wykorzystaniem socketów 
    4. podświetlanie kostek + sockety - (przeciwnik widzi na co wskazujemy)
    5. dodatkowa zasada - drugi ruch w grze może zastąpić kostkę zajętą przez pierwszego gracza
    6. ciekawostki wyświetlane przy czekaniu na przeciwnika
*/
var game, net, client, myId
$(document).ready(function () {
    net = new Net()
    game = new Game();
    client = io()

    client.on("move", function (data) {
        game.simpleMark(data.x, data.y, data.player)
        game.blockade = false
    })
    client.on("victory", function (data) {
        console.warn("koniec gry!")
        //    console.log(data)
        game.simpleUp(data.route)
        alert("Zwyciężył gracz " + data.winner)
        game.blockade = true
    })
    client.on("ready", function (data) {
        switch (game.playerId) {
            case 1:
                alert("Połączono z graczem " + data.users[0])
                alert("Grasz czerwonymi")
                game.blockade = false
                break;
            case 0:
                alert("Połączono z graczem " + data.users[1])
                alert("Grasz niebieskimi")
                break;
            default:
                alert("Coś nie tak (nieprawidłowe id gracza)")
        }

        net.sendData("checkchess")
        //game.createPlane()
        game.start(game.playerId)

    })

    $("#login").click(function () {
        net.sendData("login")
    })
    $("#wait").click(function () {
        net.sendData("check")
    })
})