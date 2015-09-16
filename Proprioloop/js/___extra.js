function create_circles(){
    var indices = get_selected_marker_indices();
        for (var i=0; i<indices.length; i++) {
        var index = indices[i];
        var maxSpeed = calc_max_speed(index);
        maxSpeeds[index] = maxSpeed;
        dynObjs.push({
            obj: null,
            index: index,
            updateFunc: update_circles,
            maxSpeed: maxSpeed,
            children: []
        });
    }
}

function update_circles(obj) {
    if (currentFrame === 0) { return; }

    var speed = calc_speed(obj.index) / obj.maxSpeed;
    var speedwoMaxS = calc_speed(obj.index);
    console.log(speedwoMaxS + "________________" + obj.maxSpeed);

    var radius = 2.0;
    var circle;
    //var scaleFactor = 1/(1000*speed);
    var scaleFactor = 1/(50*speed);
    //var scaleFactor = 20*speed;
   
    if (obj.children.length > trailLength ) {
        circle = obj.children.shift();
        circle.material.opacity = 1.0;
    } else {
        var segments = 50;
        var circleGeometry = new THREE.CircleGeometry( radius, segments );
        var material = new THREE.MeshBasicMaterial({
            color: 0x003399,
            transparent: true
        });
        circle = new THREE.Mesh( circleGeometry, material );
      //  console.log("New circle");
        circle.matrixAutoUpdate = false;
        circle.rotateOnAxis (new THREE.Vector3( 1, 0, 0 ), degToRad(-90.0));
        scene.add( circle );
    }

    circle.position.copy(trc.data.vertSamples[currentFrame][obj.index]);
    //circle.position.setY(0.0);
    circle.scale.copy(new THREE.Vector3(scaleFactor, scaleFactor, 1.0 ));
    circle.updateMatrix();
    for (var i=0; i<obj.children.length; i++) {
        obj.children[i].material.opacity *= 0.95;
    }
    obj.children.push(circle);
}