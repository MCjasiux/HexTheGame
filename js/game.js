function Game() {
    clock = new THREE.Clock();
    this.getPlayerColor = function () {
        var id = game.playerId
        if (id == 1) {
            return 2
        } else if (id == 0) {
            return 1
        } else {
            console.error("Błąd id")
        }

    }
    var tris = new Player()
    this.youWantItDarker = true
    this.playerId = 1
    var temphighlight
    this.map = []
    this.clock = 0
    this.fade = {

        speed: 30,
        tab: [],
        glowing: function (what) {
            /*
                Po najechaniu myszą na kostkę, będzie się stopniowo podświetlać
            */
            var sat = 150 + Math.abs(Math.sin(game.clock / game.fade.speed)) * 100
            what.material.color.r = sat / 250
            what.material.color.g = sat / 250
            what.material.color.b = sat / 250
        },
        dimm: function (what) {
            //^ po wyjechaniu za kostkę, wraca do neutralnego koloru
            what.material.color.g = settings.tileColor.g
            what.material.color.r = settings.tileColor.r
            what.material.color.b = settings.tileColor.b
            if (what.color == 0) {
                //      what.material.color.r = settings.tileColor.r
                what.material.color.b = 1
            } else if (what.color == 1) {
                what.material.color.r = 1
                //    what.material.color.b = settings.tileColor.b
            }

        },
        iterate: function () {

            /*
            for (let i = 0; i < game.fade.tab.length; i++) {
                var el = game.fade.tab[i];
                //  var sat = (0.6 + Math.floor(el.prog / 10) / 10)
                //    game.addEdges(el.obj, "rgb(" + sat + "," + sat + "," + sat + ")")
                var sat = 150 + Math.sin(game.clock / game.fade.speed) * 100
                el.obj.material.color.r = sat / 250
                el.obj.material.color.g = sat / 250
                el.obj.material.color.b = sat / 250
                game.fade.tab[i].prog--
                    if (el.prog <= 0) {
                        game.fade.tab.splice(i, 1)
                    }
            }
            */
        }
    }
    this.blockade = true
    // this.map.__proto__.
    this.map.__proto__.simplify = function () {
        //^zwraca planszę w postaci zer i jedynek
        //    console.warn(this)
        var temp = []

        //    console.log(temp)
        for (var i = 0; i < this.length; i++) {
            temp.push([])
            for (var j = 0; j < this[i].length; j++) {
                var element = this[i][j];
                if (element.color == 1) {
                    temp[i].push(element.color)
                } else if (element.color == 0)
                    temp[i].push(2)
                else temp[i].push(0)
            }
        }

        return temp
    }

    var material = new THREE.MeshBasicMaterial({
        color: 0x8a38ff,
        side: THREE.DoubleSide,
        wireframe: false,
        transparent: true,
        opacity: 0.5
    });

    var renderer = new THREE.WebGLRenderer();
    var axes = new THREE.AxesHelper(1000)

    var geometry = new THREE.BoxGeometry(100, 40, 100);

    var pointgeometry = new THREE.CylinderGeometry(40, 40, 20, 32);

    var scene = new THREE.Scene();

    var amb = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(amb);


    var camera = new THREE.PerspectiveCamera(
        45, // kąt patrzenia kamery (FOV - field of view)
        4 / 3, // proporcje widoku, powinny odpowiadać proporjom naszego ekranu przeglądarki
        0.1, // minimalna renderowana odległość
        10000 // maxymalna renderowana odległość
    );
    camera.position.x = 0;
    camera.position.y = 1500;
    camera.position.z = 0;
    camera.lookAt(scene.position);

    var plansza_m = new THREE.MeshPhongMaterial({
        specular: 0xffffff,
        shininess: 50,
        side: THREE.DoubleSide,
        color: settings.tileColor.hex
    })

    var plansza_g = new THREE.CylinderGeometry(3000, 3000, 2, 6);
    var plansza = new THREE.Mesh(plansza_g, plansza_m)
    plansza.position.y = -10
    plansza.rotation.x = Math.PI / 2

    this.clearScene = function () {
        var len = scene.children.length
        for (var i = 0; i < len - 1; i++) {
            scene.remove(scene.children[i])
        }
    }
    this.addToScene = function (what) {
        scene.add(what)
    }


    var init = function () {

        scene.add(axes)
        //     scene.add(plansza)
        plansza.rotateX(Math.PI / 2);
        renderer.setClearColor(0x000000);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        $("#root").append(renderer.domElement);
        //^okno renderera
        $(window).resize(function () {
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        //^resize okna
        var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
        orbitControl.addEventListener('change', function () {
            renderer.render(scene, camera)
        });
        //^orbitcontrol
        function render() {
            //REDERER
            var delta = clock.getDelta();
            tris.updateModel(delta)
            if (game.clock >= 60)
                game.clock++
                else {
                    game.clock++
                }
            if (temphighlight && temphighlight.color == undefined)
                game.fade.glowing(temphighlight)
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }
        render();
    }


    this.info = function () {
        return scene
    }

    this.start = function (index) {
        //kamera zaczyna na stronie gracza
        init()
        // game.createPlane()
        game.createFloor()
        $(document).mousemove(function (event) {
            game.highlight((-(event.clientY / $(window).height()) * 2 + 1), ((event.clientX / $(window).width()) * 2 - 1))

        })

        $(document).click(function (event) {
            game.mark((-(event.clientY / $(window).height()) * 2 + 1), ((event.clientX / $(window).width()) * 2 - 1))

        })
        console.log(index)
        switch (index) {
            case 1:
                camera.position.z = 1000
                break;
            case 2:
                camera.position.x = -1000
                break;
        }
        var light = new Light()
        var lamp = light.getLight()
        if (!game.youWantItDarker) {
            game.addToScene(lamp)
        }

        lamp.position.y = 600
        camera.lookAt(scene.position);


        game.addToScene(tris.getPlayerCont())
    }
    this.createPlane = function (arr) {
        game.map = []
        //^renderowanie mapki + center, game.map będzie tablicą obiektów
        for (var i = 0; i < 11; i++) {
            game.map.push([])
            for (var j = 0; j < 11; j++) {

                /*
                var element = arr[i][j];
                if (element == 0) {
                    var hex
                    if ((i == 0 || i == 10) ^ (j == 0 || j == 10)) {
                        // hex = new Hex().getHex("red")
                        hex = new Hex().getHex()
                    } else {
                        hex = new Hex().getHex()

                    }
                    */
                hex = new Hex().getHex()

                hex.y = i
                hex.x = j
                if (arr) {
                    hex.color = arr[i][j]
                    if (arr[i][j] == 1)
                        hex.material.color.r = 1
                    else if (arr[i][j] == 2)
                        hex.material.color.b = 1
                    else hex.color = undefined
                }

                game.addToScene(hex)
                hex.position.z = i * settings.size * 2 - 10 * settings.size
                hex.position.x = j * settings.size * 2 + i * settings.size - 15 * settings.size
                game.map[i].push(hex)

            }
        }


    }

    this.highlight = function (x, y) {
        //^podświetla mesh na hoverze, po zejściu myszy, krawędzie znikają
        var raycaster = new THREE.Raycaster();
        var mouseVector = new THREE.Vector2()
        mouseVector.x = y
        mouseVector.y = x
        raycaster.setFromCamera(mouseVector, camera);

        var intersects = raycaster.intersectObjects(scene.children);
        //  console.log(intersects)
        if (intersects.length > 0 && intersects[0].object.name == "Tile" && intersects[0].object.color == undefined) {
            if (temphighlight && temphighlight.id != intersects[0].object.id) {
                //^warunek wjechania na inną kostkę
                temphighlight.children = []
                game.fade.dimm(temphighlight)
                //^czyszczenie kostki
                game.clock = 0


            }
            temphighlight = intersects[0].object
            game.addEdges(temphighlight, "0xffffff")
            /*
            game.fade.tab.push({
                obj: temphighlight,
                prog: game.fade.speed
            })
            */
            //    game.addEdges(intersects[0].object, "hsb(180,100,100)")
        } else {
            //^wyjechanie poza kostkę

            if (temphighlight) {
                temphighlight.children = []
                game.fade.dimm(temphighlight)
                game.clock = 0


                temphighlight = undefined
            }
        }

    }
    this.addEdges = function (to, color) {
        //^dodaje do mesha krawędzie o podanym kolorze
        var egeometry = new THREE.EdgesGeometry(to.geometry);
        var ematerial = new THREE.LineBasicMaterial({
            color: color,
            linewidth: 80
        });
        var edges = new THREE.LineSegments(egeometry, ematerial);
        to.add(edges);
    }

    this.mark = function (x, y) {
        //^klikanie raycasterem - blokada socketami
        if (!game.blockade) {
            var raycaster = new THREE.Raycaster();
            var mouseVector = new THREE.Vector2()
            mouseVector.x = y
            mouseVector.y = x
            raycaster.setFromCamera(mouseVector, camera);
            var intersects = raycaster.intersectObjects(scene.children);
            var occupation = intersects[0].object.color
            if (intersects.length > 0 && intersects[0].object.name == "Tile" && occupation == undefined) {
                console.log(intersects[0].object.x, intersects[0].object.y)
                console.log(intersects[0])
                //    game.map[intersects[0].object.y][intersects[0].object.x].color = game.playerId
                //czerwone jedynki

                intersects[0].object.color = game.playerId
                if (game.playerId == 1) {
                    intersects[0].object.material.color.r = 1
                } else if (game.playerId == 0) {
                    intersects[0].object.material.color.b = 1
                }
                //^Oznaczanie kostek
                //    $("#helper").html(JSON.stringify(game.map.simplify().join("<br>")))
                client.emit("move", {
                    player: game.playerId,
                    x: intersects[0].object.x,
                    y: intersects[0].object.y
                })
                //^dane o ruchu
                if (game.playerId == 0) {
                    game.waterFall(2)
                    if (game.youWantItDarker)
                        game.addLamp(intersects[0].object.x, intersects[0].object.y, 2)
                } else if (game.playerId == 1) {
                    game.waterFall(1)
                    if (game.youWantItDarker)
                        game.addLamp(intersects[0].object.x, intersects[0].object.y, 1)
                }

                game.blockade = true
            }
            /*
            net.sendData("move", {
                player: game.playerId,
                x: intersects[0].object.x,
                y: intersects[0].object.y
            })
            */

        }

    }
    this.simpleMark = function (x, y, id_color) {
        game.map[y][x].color = id_color
        if (id_color == 1) {
            game.map[y][x].material.color.r = 1
            if (game.youWantItDarker)
                game.addLamp(x, y, 1)
        } else {
            game.map[y][x].material.color.b = 1
            if (game.youWantItDarker)
                game.addLamp(x, y, 2)
        }

    }
    this.waterFall = function (clue) {
        /*
            ^funkcja znajdująca ścieżkę z góry na dół
            NIE RUSZAĆ
        
                1. Zaczyna z góry - z 11 kostek jednocześnie - 11 ścieżek
                2. Każdą odwiedzoną oznacza -1
                3. Sprawdza kostki w otoczeniu
                    3.1 jeśli w pobliżu nie ma wolnych kostek, ścieżka wygasa
                    3.2 jeśli jest wolna, oznacza ją i dodaje do stacku
                    3.3 jeśli jest po drugiej stronie (index == 10), kończy ścieżkę i zwraca trasę 

                Jedynki (czerwone - z góry na dół)
                Dwójki (niebieskie) - z prawej do lewej
            */
        var helper = game.map.simplify()
        var routes = []
        //   var clue = 1
        //^szuka po czerwonych/niebieskich
        if (clue == 1)
            for (var i = 0; i < game.map[0].length; i++) {
                if (helper[0][i] == clue) {
                    var element = game.map[0][i];
                    routes.push([element])
                    helper[0][i] = -1
                    console.log(routes)
                }

            }
        else if (clue == 2) {
            for (var i = 0; i < game.map.length; i++) {
                if (helper[i][0] == clue) {
                    var element = game.map[i][0];
                    routes.push([element])
                    helper[i][0] = -1
                    console.log(routes)
                }

            }
        }

        //^init - pierwsza fala inaczej dla czerwonych (pierwszy rząd), i niebieskich (kolumna)
        var k = 0
        total:
            while (k < 50) {
                para: for (var i = 0; i < routes.length; i++) {
                    //miało być falami, ale wychodzi nieskończona pętla
                    var element = routes[i][0];
                    //^ostatnia kostka trasy to pierwsza na liście
                    var x = element.x
                    var y = element.y
                    /*
                sąsiadujące kostki są oznaczane począwszy od "po prawej u góry", jak godziny w zegarze
                1 -> [y-1][x+1]
                2 -> [y][x+1]
                3 -> [y+1][x]
                4 -> [y+1][x-1]
                5 -> [y][x-1]
                6 -> [y-1][x]
                Inny przykład na helperze:

                00610
                05X20
                04300
            
                   */
                    function checkBreak(arr) {
                        if (arr[0].y == 10 && clue == 1 || arr[0].x == 10 && clue == 2) {
                            game.up(arr)
                            //   break para
                            //   break total
                            console.warn("Znaleziono trasę (" + arr.length + ")")
                            console.log(arr)
                            var simpleRoute = []
                            for (let i = 0; i < arr.length; i++) {
                                var el = arr[i];
                                simpleRoute.push({ //uproszczenie trasy, aby mogłą być wyświetlona u drugiego gracza
                                    x: el.x,
                                    y: el.y
                                })
                            }
                            client.emit("victory", {
                                winner: game.playerId,
                                route: simpleRoute
                            })
                            alert("Zwyciężyłeś!")
                            return true
                        } else return false
                    }


                    if (helper[y - 1] != undefined && helper[y - 1][x + 1] == clue) {
                        var temp = routes[i].slice()
                        //^korzeń kolejnego drzewka - trasa może się rozgałęziać
                        temp.unshift(game.map[y - 1][x + 1])
                        //^dołożenie gałęzi do drzewka
                        helper[y - 1][x + 1] = -1
                        //^oznaczenie 
                        routes.push(temp)
                        //^dodanie do tras
                        if (checkBreak(temp)) {
                            break para
                            break total
                        }
                    }
                    //1
                    if (helper[y][x + 1] == clue) {
                        var temp = routes[i].slice()
                        temp.unshift(game.map[y][x + 1])
                        helper[y][x + 1] = -1
                        routes.push(temp)
                        if (checkBreak(temp)) {
                            break para
                            break total
                        }
                    }
                    //2
                    if (helper[y + 1] != undefined && helper[y + 1][x] == clue) {
                        var temp = routes[i].slice()
                        temp.unshift(game.map[y + 1][x])
                        helper[y + 1][x] = -1
                        routes.push(temp)
                        if (checkBreak(temp)) {
                            break para
                            break total
                        }
                    }
                    //3
                    if (helper[y + 1] != undefined && helper[y + 1][x - 1] == clue) {
                        var temp = routes[i].slice()
                        temp.unshift(game.map[y + 1][x - 1])
                        helper[y + 1][x - 1] = -1
                        routes.push(temp)
                        if (checkBreak(temp)) {
                            break para
                            break total
                        }
                    }
                    //4
                    if (helper[y][x - 1] == clue) {
                        var temp = routes[i].slice()
                        temp.unshift(game.map[y][x - 1])
                        helper[y][x - 1] = -1
                        routes.push(temp)
                        if (checkBreak(temp)) {
                            break para
                            break total
                        }
                    }
                    //5
                    if (helper[y - 1] != undefined && helper[y - 1][x] == clue) {
                        var temp = routes[i].slice()
                        temp.unshift(game.map[y - 1][x])
                        helper[y - 1][x] = -1
                        routes.push(temp)
                        if (checkBreak(temp)) {
                            break para
                            break total
                        }
                    }
                    //6
                    if (routes[i][0].y == 10) {
                        // game.up(routes[i])
                        //   break total
                    }
                }

                k++

            }
        console.log("TRASY:")
        console.log(routes)
        // game.up(routes[routes.length - 1])
    }
    this.up = function (arr) {
        //^podnieś kostki
        for (var i = 0; i < arr.length; i++) {
            var element = arr[i];
            element.position.y = 60
        }
    }
    this.simpleUp = function (arr) {
        //podnosi kostki na podstawie tablicy koordynatów
        for (var i = 0; i < arr.length; i++) {
            var el = arr[i]
            var element = game.map[el.y][el.x]
            element.position.y = 60
        }
    }
    this.addLamp = function (x, y, color) {
        //jedynki niebieskie
        //dwójki czerwone
        var l = new Light()
        var lamp = l.getLamp()
        lamp.intensity = 1, 4
        lamp.distance = 160
        lamp.color.r = 0.3
        lamp.color.g = 0.3
        lamp.color.b = 0.3
        if (color == 1) {
            lamp.color.r = 1
            //     lamp.color = "0xff0000"

        } else if (color == 2) {
            //          lamp.color = "0x0000ff"
            lamp.color.b = 1
        }


        lamp.position.x = game.map[y][x].position.x
        lamp.position.z = game.map[y][x].position.z
        lamp.position.y = game.map[y][x].position.y + 120
        console.log(lamp)
        game.addToScene(lamp)

    }

    this.createFloor = function () {
        function newPlane(color) {
            var geometry = new THREE.PlaneGeometry(10, 50, 32);
            var material = new THREE.MeshBasicMaterial({
                color: color,
                side: THREE.DoubleSide
            });
            var plane = new THREE.Mesh(geometry, material);
            plane.rotation.x = Math.PI / 2
            plane.scale.x = settings.size * 2
            return plane
        }
        var one = new newPlane("red")


        one.position.z = 12 * settings.size
        one.position.x = 5 * settings.size
        scene.add(one);
        var two = new newPlane("red")
        two.position.x = -5 * settings.size
        two.position.z = -12 * settings.size
        scene.add(two)
        var three = new newPlane("blue")
        three.rotation.z = Math.PI / 3
        //^rotacja lokalna
        three.position.x = 11 * settings.size
        scene.add(three)

        var four = new newPlane("blue")
        four.rotation.z = Math.PI / 3

        four.position.x = -11 * settings.size
        scene.add(four)


    }
}