function Net() {
    this.sendData = function (a, b) {
        //a - akcja, b - data

        var tosend = {
            name: $("#txt1").val(),
            action: a
        }
        if (a == "sendchess") {
            tosend.table = encodeURIComponent(b)
        }
        console.warn(tosend)
        $.ajax({
            url: "/upload",
            data: tosend,
            type: "POST",
            success: function (data) {

                var obj = JSON.parse(data)
                console.warn(data)
                if (obj.status == "success") {
                    alert("zalogowano: " + obj.name)
                    game.playerId = obj.id
                } else if (obj.status == "occupied") {
                    alert("nazwa już zajęta")
                } else if (obj.status == "outnumbered") {
                    alert("już dwóch użytkowników")
                } else if (obj.status == "ready") {
                    //informacja o tym, że drugi gracz jest już gotowy
                    alert("Połączono z graczem " + obj.opponent)
                    console.log("ID")
                    console.log(obj.id)
                    if (obj.id)
                        alert("Grasz czerwonymi"),
                        game.playerId = 1, game.blockade = false
                    else alert("Grasz niebieskimi"), game.playerId = 2
                    net.sendData("checkchess")
                    game.start(game.playerId)

                } else if (obj.status == "nready") {
                    console.log("czekam na drugiego gracza")
                } else if (obj.status == "ok") {
                    console.log("wysłano szachownicę na serwer")

                } else if (obj.status == "chessready") {

                    var newtab = JSON.parse(decodeURIComponent(obj.table))
                    //^tablica z serwera, ale jedna, 121-elementowa
                    game.createPlane(newtab)
                    console.log(newtab)
                    if (obj.turn == game.playerId) {
                        game.blockade = false

                    } else game.blockade = true
                    console.log("Odebrano i wyrenderowano planszę")
                    //^pobieranie planszy jest tylko przy rozpoczęciu i wróceniu do gry
                    //normalnie, jest modyfikowana synchronicznie
                }
            },
            error: function (xhr, status, error) {
                console.log('Error: ' + error);
            },
        });


    }


}