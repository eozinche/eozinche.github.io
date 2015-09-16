function calc_accel(index, tDelta) {
    // tDelta in samples | 120 = 1 second
    var points = [];
    for (var i=0; i<tDelta; i++) {
        if (currentFrame+i < trc.data.NumFrames) {
            points.push(trc.data.vertSamples[currentFrame+i][index]);
        }
    }

    var indices = get_selected_marker_indices();
    for (var i=0; i<indices.length; i++) {
            var velocity = calc_velocity(indices[i], 30);
            var length = velocity.length();
            var dir = velocity.normalize();
            var origin = new THREE.Vector3( 0, 0, 0 );
            origin.copy(trc.data.vertSamples[currentFrame][indices[i]]);
    }



if(currentFram)
    var v1 = velocity.length(); //previousFrame
    var v2 = velocity.length(); // currentFrame


    arrowObj.obj.setDirection(velocity.normalize());
    arrowObj.obj.position.copy(trc.data.vertSamples[currentFrame]
    [arrowObj.index]);



    // var curve = new THREE.SplineCurve3( points );
    // var length = curve.getLength();

    // var speed = length/ (tDelta / trc.data.DataRate);

    // // get normalized vector
    // var velocity1 =  new THREE.Vector3();
    // velocity1.subVectors(curve.getPoint(1),curve.getPoint(0));
    // velocity1.normalize();
    // velocity1.multiplyScalar(speed);

    
    // var velocity2 =  new THREE.Vector3();
    // velocity2.subVectors(curve.getPoint(2),curve.getPoint(1));
    // velocity2.normalize();
    // velocity2.multiplyScalar(speed);



    var accel = new THREE.Vector3();
    accel.subVectors(velocity2.getPoint(0),velocity1.getPoint(0));

    return accel/(tDelta / trc.data.DataRate);

    console.log(accel/(tDelta / trc.data.DataRate));
}