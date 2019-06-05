function Light(mode, power) {

    var container = new THREE.Object3D();
    var ligh

    function init() {
        var material = new THREE.MeshBasicMaterial({
            color: 0x2c512c,
            side: THREE.DoubleSide,
            wireframe: true,
            transparent: true,
            opacity: 0.5,

        });
        var geometry = new THREE.BoxGeometry(100, 100, 100);
        var lightbox = new THREE.Mesh(geometry, material)

        light = new THREE.SpotLight(0xffffff, 1.3, 2200, 3.14);
        container.add(light);

        container.add(lightbox)
        // tu utwórz materiał , geometrię, światło, mesh
        // i dodaj je do kontenera (add)


    }

    init();

    this.getLight = function () {
        return container;
    }
    this.getLamp = function () {
        return light
    }

}