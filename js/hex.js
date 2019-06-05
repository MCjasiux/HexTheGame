function Hex() {
    var cylinder

    this.getHex = function (edged) {
        /*
        Kostka będzie renderowana z krawędziami w kolorze edged
        To w rzeczysistości cylinder o 6 krawędziach bocznych
        */
        var geometry = new THREE.CylinderGeometry(settings.size, settings.size, 30, 6);
        var material = new THREE.MeshPhongMaterial({
            specular: 0xffffff,
            shininess: 50,
            side: THREE.DoubleSide,
            color: settings.tileColor.hex
        })




        cylinder = new THREE.Mesh(geometry, material);
        cylinder.receiveShadow = true
        cylinder.castShadow = true
        if (edged) {
            var geometry = new THREE.EdgesGeometry(cylinder.geometry); // or WireframeGeometry
            var material = new THREE.LineBasicMaterial({
                color: edged,
                linewidth: 2
            });
            var edges = new THREE.LineSegments(geometry, material);
            cylinder.add(edges); // add wireframe as a child of the parent mesh
            cylinder.edgeColor = edged

        }
        cylinder.__proto__.addEdges = function (color) {
            //^dodaje do mesha krawędzie o podanym kolorze
            var egeometry = new THREE.EdgesGeometry(cylinder.geometry);
            var ematerial = new THREE.LineBasicMaterial({
                color: color,
                linewidth: 80
            });
            var edges = new THREE.LineSegments(egeometry, ematerial);
            cylinder.add(edges);
        }
        cylinder.__proto__.removeEdges = function (color) {
            //^usuwa z kostki krawędzie
            cylinder.children = []
        }
        cylinder.__proto__.addLight = function (color) {
            var l = new Light()
            var lamp = l.getLamp()
            lamp.intensity = 3.1
            lamp.distance = 200
            if (color == 1) {
                lamp.color.r = 1

            } else if (color == 2) {
                lamp.color.b = 1
            }

            lamp.position.x = cylinder.position.x
            lamp.position.z = cylinder.position.z
            lamp.position.y = cylinder.position.y + 120
            game.addToScene(lamp)
        }
        cylinder.name = "Tile"
        return cylinder
    }
}