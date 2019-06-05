function Player() {
    this.state = "stand"
    var meshModel
    var container = new THREE.Object3D()

    var geometry = new THREE.BoxGeometry(50, 50, 50)
    var material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
    })
    var player = new THREE.Mesh(geometry, material); // player sześcian
    //  player.name = "player"
    var mixer


    var loader = new THREE.JSONLoader();
    var modelmaterial = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture("CRAKHORB.png"),
        morphTargets: true // odpowiada za animację materiału modelu

    });
    loader.load("js/TRIS.js", function (geometry) {

        // ładowanie modelu jak porzednio
        meshModel = new THREE.Mesh(geometry, modelmaterial)
        meshModel.name = "player";
        meshModel.rotation.y = Math.PI / 2; // ustaw obrót modelu
        meshModel.position.y = 520; // ustaw pozycje modelu
        meshModel.position.x = 1100; // ustaw pozycje modelu
        meshModel.scale.set(20, 20, 20); // ustaw skalę modelu
        //utworzenie mixera
        mixer = new THREE.AnimationMixer(meshModel);

        //dodanie modelu do kontenera

        container.add(meshModel)

        // zwrócenie kontenera

    });



    container.add(player)

    var axes = new THREE.AxesHelper(200) // osie do kontroli kierunku ruchu
    container.add(axes)

    //funkcja zwracająca kontener
    this.getPlayerCont = function () {
        return container
    }
    this.getPlayerAxes = function () {
        return axes
    }
    //funkcja zwracająca playera
    this.getPlayerMesh = function () {
        return player
    }
    this.setRotation = function (ag) {
        meshModel.rotation.y = ag - Math.PI / 2
    }
    this.updateModel = function (delta) {

        if (mixer) {
            if (this.state) {
                mixer.clipAction(this.state).play();
                mixer.update(delta)
            }


        }
    }
    this.setAnimation = function () {

        mixer.clipAction("run").play();
    }
    this.stopAnimation = function (what) {
        if (what) {
            mixer.clipAction(what).stop()
            this.state = "stand"
        } else if (this.state) {
            mixer.clipAction(this.state).stop()
            this.state = undefined
        } else
            console.warn("Nie ma animacji do zatrzymania")

    }


}