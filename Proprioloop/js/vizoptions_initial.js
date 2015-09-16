
// function create_surface(){
//         var geometry = new THREE.SphereGeometry(0.5, segments, segments);
//         var material = new THREE.MeshBasicMaterial({
//             //color: 0xD24344,
//             color: 0xFFFFFF,
//             transparent: true
//         });
//         trc.ptc = new THREE.Mesh(geometry, material);
//             scene.add(trc.ptc);

// }

function create_mkr_path() {
    var indices = get_selected_marker_indices();
    console.log(indices);
    for (var i=0; i<indices.length; ++i){
        var mkrIndex = indices[i];
        var mkrName = trc.data.groups[mkrIndex];
        var points = [];
        for (var j=0; j<trc.data.vertSamples.length; j++) {
            points.push(trc.data.vertSamples[j][mkrIndex]);
        }
        var geometry = new THREE.Geometry();
        var curve = new THREE.SplineCurve3( points );
        geometry.vertices = curve.getPoints( points.length );
        var color;
        if (mkrName.lastIndexOf("L_") === 0) {
            color = 0xE0E7AB;
        } else if (mkrName.lastIndexOf("R_") === 0) {
            color = 0xA2CFA5;
        } else {
            color = 0xF5974E;
        }
        var material = new THREE.LineBasicMaterial( { color : color } );
        var splineObject = new THREE.Line( geometry, material );
        scene.add(splineObject);
    }
}

function create_mkr_curve() {


  var indices = [];
    for (var i=0; i<trc.data.groups.length; i++) {
        var name = trc.data.groups[i];
            var mkrIndex = trc.data.groups.indexOf(name);
            indices.push(mkrIndex);
    }

  //  var indices = get_selected_marker_indices();
    var points = [];
    var follow = true;

    for (var i=0; i<indices.length; i++) {
        var mkrIndex = indices[i];
        points.push(trc.data.vertSamples[currentFrame][mkrIndex]);
    }
    var geometry = new THREE.Geometry();
    var curve = new THREE.SplineCurve3( points );
    geometry.vertices = curve.getPoints( indices.length*10 );
    var material = new THREE.LineBasicMaterial( { color : 0xffffff } );
    var splineObject = new THREE.Line( geometry, material );
    scene.add(splineObject);
    if (follow) {
        dynObjs.push({
            obj: splineObject,
            indices: indices,
            resolution: indices.length*20,
            isFollowing: follow,
            updateFunc: update_curve
        });
    }
}

function update_curve(splineObject) {
    if (!(splineObject.isFollowing)) {
        return;
    }
    var points = [];
    for (var i=0; i<splineObject.indices.length; i++) {
        points.push(trc.data.vertSamples[currentFrame][splineObject.indices[i]]);
    }
    var curve = new THREE.SplineCurve3( points );
    splineObject.obj.geometry.vertices = curve.getPoints( splineObject.resolution );
    splineObject.obj.geometry.verticesNeedUpdate = true;
}

function create_vertical_arrows() {
    var indices = get_selected_marker_indices();
    for (var i=0; i<indices.length; i++) {

        var origin = new THREE.Vector3( 0, 0, 0 );
        origin.copy(trc.data.vertSamples[currentFrame][indices[i]]);

        var mkrName = trc.data.groups[indices[i]];
        var dir, hex, length, up;
        if (TOP.indexOf(mkrName) != -1) {
            dir = new THREE.Vector3( 0, 1, 0 );
            hex = 0xD24344;
            length = 100-origin.y;
            up = true;
        } else {
            dir = new THREE.Vector3( 0, -1, 0 );
            hex = 0xA2CFA5;
            length = 10; //origin.y;
            up = false;
        }

        var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
        scene.add( arrowHelper );
        dynObjs.push({
            obj: arrowHelper,
            index: indices[i],
            updateFunc: update_vertical_arrow,
            up: up
        });
    }
}

function update_vertical_arrow(arrowObj) {
    arrowObj.obj.position.copy(trc.data.vertSamples[currentFrame][arrowObj.index]);
    if (arrowObj.up) {
        arrowObj.obj.setLength(100-arrowObj.obj.position.y, 1,10);
    } else {
        arrowObj.obj.setLength(arrowObj.obj.position.y, 1,10);
    }
}


var prevVelocity = new THREE.Vector3( 0, 0, 0 );

function create_velocity_arrows() {
  var indices = get_selected_marker_indices();
    for (var i=0; i<indices.length; i++) {

        var velocity = calc_velocity(indices[i], 30);
        var length = velocity.length();
        var dir = velocity.normalize();
        var origin = new THREE.Vector3( 0, 0, 0 );
        origin.copy(trc.data.vertSamples[currentFrame][indices[i]]);

        var hex = 0xE96B56;

        var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
        scene.add( arrowHelper );
        dynObjs.push({
            obj: arrowHelper,
            index: indices[i],
            updateFunc: update_velocity_arrow
        });
    }
}


function update_velocity_arrow(arrowObj) {
    var velocity = calc_velocity(arrowObj.index, 10);
    arrowObj.obj.setLength(velocity.length()*0.3, velocity.length()*0.2, velocity.length()*0.1);
    var v = velocity.length();
    console.log("VEL: " + v);
    arrowObj.obj.setDirection(velocity.normalize());
    arrowObj.obj.position.copy(trc.data.vertSamples[currentFrame][arrowObj.index]);

    var col = new THREE.Color();
    col.setHex(0xBA064E);
    col.offsetHSL(0.0,0.0,v*0.0005);
    arrowObj.obj.setColor(col.getHex());

///////////////////////////////////
///////////////////////////////////
}


/////////////////////////////////// ARROW FIELD //////////////////S/////////////////////////


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
       var aGeometry = new THREE.CylinderGeometry( 0, 20, 100, 2, 1, false);
        aGeometry.applyMatrix( new THREE.Matrix4().makeRotationFromEuler ( 
                               new THREE.Euler( Math.PI / 2, Math.PI, 0 ) ) );


                scene.matrixAutoUpdate = false;

                dynObjs.push({
                      obj: aGeometry,
                      index: index,
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


        var aGeometry = new THREE.CylinderGeometry( 0, 4, 25, 3, 1, false);
        aGeometry.applyMatrix( new THREE.Matrix4().makeRotationFromEuler ( 
                               new THREE.Euler( Math.PI / 2, Math.PI, 0 ) ) );

 // var pMaterial = new THREE.PointCloudMaterial({
 //                        color: 0xFF5050,
 //                        size: 3,
 //                        blending: THREE.AdditiveBlending,
 //                        transparent: true,
 //                        sizeAttenuation: false
 //                    });

        var aMaterial = new THREE.MeshNormalMaterial( { 
                            blending: THREE.SubtractBlending,
                           // blending: THREE.ScreenBlending,
                            transparent: true
                        });

//        var aMesh = new THREE.Mesh( aGeometry, aMaterial );

//                for ( var i = 0; i < 100; i ++ ) {
      //  if (obj.children.length<=50) {
              //   for ( var i = 0; i < 49; i ++ ) {
                    var aMesh = new THREE.Mesh( aGeometry, aMaterial );
                    aMesh.position.x = Math.random() * 200 - 50;
                    aMesh.position.y = Math.random() * 200 - 50;
                    aMesh.position.z = Math.random() * 200 - 50;
                    aMesh.scale.x = aMesh.scale.y = aMesh.scale.z = Math.random() * 0.8;
                    scene.add( aMesh );
                    obj.children.push(aMesh);
                    aMesh.lookAt( pointing );
           //   } 
          //  }
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

    for (var i=0; i<obj.children.length; i++) {
        obj.children[i].material.opacity *= 0.99;
        obj.children[ i ].lookAt( pointing );
    }

    // obj.children.push(aMesh);
}

}
//////////////////////////////////// ARROW FIELD ///////////////////E//////////////////////////




var maxSpeeds = {};
function create_speed_circles() {
    var indices = get_selected_marker_indices();
    for (var i=0; i<indices.length; i++) {
        var index = indices[i];
        var maxSpeed = calc_max_speed(index)

        maxSpeeds[index] = maxSpeed;
        dynObjs.push({
            obj: null,
            index: index,
            updateFunc: update_speed_circles,
            maxSpeed: maxSpeed,
            children: []
        });
    }
}


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

function update_speed_circles(obj) {
    if (currentFrame === 0) { return; }

    var speed = calc_speed(obj.index) / obj.maxSpeed;
    var radius = 1.0;
    var circle;
    var scaleFactor = speed*8;

    if (obj.children.length > trailLength ) {
        circle = obj.children.shift();
        circle.material.opacity = 1.0;
    } else {
        var segments = 8;
        var circleGeometry = new THREE.CircleGeometry( radius, segments );
        var material = new THREE.MeshBasicMaterial({
            color: 0xA2CFA5,
            transparent: true
        });
        circle = new THREE.Mesh( circleGeometry, material );
      //  console.log("New circle");
        circle.matrixAutoUpdate = false;
        circle.rotateOnAxis (new THREE.Vector3( 1, 0, 0 ), degToRad(-90.0));
        scene.add( circle );
    }
    circle.position.copy(trc.data.vertSamples[currentFrame][obj.index]);
    circle.position.setY(0.0);
    circle.scale.copy(new THREE.Vector3(scaleFactor, scaleFactor, 1.0 ));
    circle.updateMatrix();
    for (var i=0; i<obj.children.length; i++) {
        obj.children[i].material.opacity *= 0.95;
    }
    obj.children.push(circle);
}

function create_speed_spheres() {
    var indices = get_selected_marker_indices();
    for (var i=0; i<indices.length; i++) {
        var index = indices[i];
        var maxSpeed = calc_max_speed(index)
        maxSpeeds[index] = maxSpeed;
        dynObjs.push({
            obj: null,
            index: index,
            updateFunc: update_speed_spheres_original,
            maxSpeed: maxSpeed,
            children: []
        });
    }
}


/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

function update_speed_spheres_original(obj) {
    if (currentFrame === 0) { return; }
    var speed = calc_speed(obj.index) / obj.maxSpeed;
    var radius = speed*5;
    var segments = 20;
    var sphere;

    if (obj.children.length > 80 ) {
        sphere = obj.children.shift();
        sphere.material.opacity = 1.0;
    } else {
        var geometry = new THREE.SphereGeometry(1.0, segments, segments);
        var material = new THREE.MeshBasicMaterial({
            color: 0xFFE0A3,
            transparent: true
        });
        sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
    }
    sphere.position.copy(trc.data.vertSamples[currentFrame][obj.index]);
    sphere.scale.copy(new THREE.Vector3(radius, radius, radius ));
    sphere.updateMatrix();
    for (var i=0; i<obj.children.length; i++) {
        obj.children[i].material.opacity *= 0.98;
    }
    obj.children.push(sphere);
}

function update_speed_spheres(obj) {
    if (currentFrame === 0) { return; }
    var speed = calc_speed(obj.index) / obj.maxSpeed;
    var radius = speed*1.5;
    var segments = 6;
 //   var sphere;

    var particles = 50;   
    var positions = new Float32Array( particles * 3 );
    var colors = new Float32Array( particles * 3 );
    var color = new THREE.Color();
    var n = 100, n2 = n / 2; // particles spread in the cube

    for ( var i = 0; i < positions.length; i += 10 ) {

                    // positions

                    var x = Math.random() * n - n2;
                    var y = Math.random() * n - n2;
                    var z = Math.random() * n - n2;

                    positions[ i ]     = x;
                    positions[ i + 1 ] = y;
                    positions[ i + 2 ] = z;

                    // colors

                    var vx = ( x / n ) + 0.5;
                    var vy = ( y / n ) + 0.5;
                    var vz = ( z / n ) + 0.5;

                    color.setRGB( vx, vy, vz );

                    colors[ i ]     = color.r;
                    colors[ i + 1 ] = color.g;
                    colors[ i + 2 ] = color.b;

                }


    if (obj.children.length > trailLength ) {
        particles = obj.children.shift();
        particles.material.opacity *=0.97;
    } else {



        var geometry = new THREE.BufferGeometry();

                geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
                geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

                geometry.computeBoundingSphere();


        var material = new THREE.PointCloudMaterial( { size: 2, vertexColors: THREE.VertexColors } );

                particleSystem = new THREE.PointCloud( geometry, material );
                scene.add( particleSystem );
                
    }


    particleSystem.position.copy(trc.data.vertSamples[currentFrame][obj.index]);
    particleSystem.scale.copy(new THREE.Vector3(radius, radius, radius ));
    particleSystem.updateMatrix();


    for (var i=0; i<obj.children.length; i++) {
        obj.children[i].material.opacity *= 0.95;
    }
    obj.children.push(particleSystem);
}

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////



function create_test_circles(){

var indices = get_selected_marker_indices();
    for (var i=0; i<indices.length; i++) {

        var velocity = calc_velocity(indices[i], 30);
        var length = velocity.length();
        var dir = velocity.normalize();


        ///////changed by chanwook
        var accel = new THREE.Vector3();

        accel.subVectors(preVelo, velocity);
        accel.divideScalar(0.033333);

        var accel_length = accel.length();
        var accel_dir = accel.normalize();
        ////////////////
    //    console.log(velocity);

        var origin = new THREE.Vector3( 0, 0, 0 );
        origin.copy(trc.data.vertSamples[currentFrame][indices[i]]);

        var hex = 0xE96B56;

        dynObjs.push({
            obj: null,
            index: indices[i],
            updateFunc: update_test_circles,
            children: []
        });
    }

}

function update_test_circles(obj) {
   
 //   var speed = calc_speed(obj.index) / obj.maxSpeed;
  //  var speedwoMaxS = calc_speed(obj.index);


 var velocity = calc_velocity(obj.index, 10);
    ///////changed by chanwook
        var accel = new THREE.Vector3();

        accel.subVectors(velocity,preVelo);
        accel.divideScalar(0.0833333);


    var radius = 2.0;
    var circle;
    //var scaleFactor = 1/(1000*speed);
   // var scaleFactor = 1/(50*speed);
    //var scaleFactor = 20*speed;
   

  // 1/(1000*speed)

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
    circle.scale.copy(new THREE.Vector3(accel.length()*0.001, accel.length()*0.001, 1.0));
    circle.updateMatrix();
    
    preVelo = velocity;


    for (var i=0; i<obj.children.length; i++) {
        obj.children[i].material.opacity *= 0.95;
    }
    obj.children.push(circle);
}




