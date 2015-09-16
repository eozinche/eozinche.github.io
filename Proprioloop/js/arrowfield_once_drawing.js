function create_arrow_field_new() {
  var indices = get_selected_marker_indices();
    for (var i=0; i<indices.length; i++) {
    var index = indices[i];

       //  var velocity = calc_velocity(index, 30);
       //  var length = velocity.length();
       //  var dir = velocity.normalize();
       // // var origin = new THREE.Vector3( 0, 0, 0 );
       // // origin.copy(trc.data.vertSamples[currentFrame][indices[i

       //      var pointing =  new THREE.Vector3(0,0,0);
       //      pointing.copy(trc.data.vertSamples[currentFrame][indices[i]]);

       //  var hex = 0xE96B56;

       //  var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
       //  scene.add( arrowHelper );
       //  dynObjs.push({
       //      obj: arrowHelper,
       //      index: indices[i],
       //      updateFunc: update_velocity_arrow
       //  });
///////////////

var origin = new THREE.Vector3( 0, 0, 0 );
        origin.copy(trc.data.vertSamples[currentFrame][indices[i]]);

       var aGeometry = new THREE.CylinderGeometry( 0, 20, 100, 2, 1, false);
        aGeometry.applyMatrix( new THREE.Matrix4().makeRotationFromEuler ( 
                               new THREE.Euler( Math.PI / 2, Math.PI, 0 ) ) );
var aMaterial = new THREE.MeshNormalMaterial();
        // var aMesh = new THREE.Mesh( aGeometry, aMaterial );

           for ( var i = 0; i < 100; i ++ ) {

                    var aMesh = new THREE.Mesh( aGeometry, aMaterial );
                    aMesh.position.x = Math.random() * 300 - 50;
                    aMesh.position.y = Math.random() * 300 - 100;
                    aMesh.position.z = Math.random() * 300 - 100;
                    aMesh.scale.x = aMesh.scale.y = aMesh.scale.z = Math.random() * 0.5;
                    scene.add( aMesh );

                    aMesh.lookAt( origin );
                }

                scene.matrixAutoUpdate = false;

                dynObjs.push({
                      obj: aMesh,
                      index: index,
                      pointing: pointing,
                      updateFunc: update_arrow_field_new,
                     // pointing: pointing
                      children: []
        });
    }
}


function update_arrow_field_new(obj) {

    if (currentFrame === 0) { return; }

    // var velocity = calc_velocity(arrowObj.index, 10);
    // arrowObj.obj.setLength(velocity.length()*0.3, velocity.length()*0.2, velocity.length()*0.1);

      var indices = get_selected_marker_indices();
        for (var i=0; i<indices.length; i++) {
            var index = indices[i];

            var pointing =  new THREE.Vector3(0,0,0);
            pointing.copy(trc.data.vertSamples[currentFrame][index]);


        // var aGeometry = new THREE.CylinderGeometry( 0, 4, 25, 2, 1, false);
        // aGeometry.applyMatrix( new THREE.Matrix4().makeRotationFromEuler ( 
        //                        new THREE.Euler( Math.PI / 2, Math.PI, 0 ) ) );

        // var aMaterial = new THREE.MeshNormalMaterial();
        // var aMesh = new THREE.Mesh( aGeometry, aMaterial );

        //         for ( var i = 0; i < 100; i ++ ) {

        //             var aMesh = new THREE.Mesh( aGeometry, aMaterial );
        //             aMesh.position.x = Math.random() * 300 - 50;
        //             aMesh.position.y = Math.random() * 300 - 100;
        //             aMesh.position.z = Math.random() * 300 - 100;
        //             aMesh.scale.x = aMesh.scale.y = aMesh.scale.z = Math.random() * 0.5;
        //             scene.add( aMesh );
        //            obj.children.push(aMesh);

                    obj.lookAt( pointing );
//                }

   // aMesh.lookAt.copy(pointing);
    scene.updateMatrix();

    // var v = velocity.length();
    // console.log("VEL: " + v);
    // arrowObj.obj.setDirection(velocity.normalize());
    // arrowObj.obj.position.copy(trc.data.vertSamples[currentFrame][arrowObj.index]);

    // var col = new THREE.Color();
    // col.setHex(0xBA064E);
    // col.offsetHSL(0.0,0.0,v*0.0005);
    // arrowObj.obj.setColor(col.getHex());

    // for (var i=0; i<obj.children.length; i++) {
    //     obj.children[i].material.opacity *= 0.98;
    //     obj.children[ i ].lookAt( pointing );
    // }

    // obj.children.push(aMesh);
}

}
//////////////////////////////////// ARROW FIELD ///////////////////E//////////////////////////

