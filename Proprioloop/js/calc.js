function calc_velocity(index, tDelta) {
    // tDelta in samples | 120 = 1 second
    var points = [];
    for (var i=0; i<tDelta; i++) {
        if (currentFrame+i < trc.data.NumFrames) {
            points.push(trc.data.vertSamples[currentFrame+i][index]);
        }
    }
    var curve = new THREE.SplineCurve3( points );
    var length = curve.getLength();

    var speed = length/ (tDelta / trc.data.DataRate);
    // get normalized vector
    var velocity =  new THREE.Vector3();
    velocity.subVectors(curve.getPoint(1),curve.getPoint(0));
    velocity.normalize();

    velocity.multiplyScalar(speed);

    oldVelocity = new THREE.Vector3( currentVelocity );
    currentVelocity = new THREE.Vector3( velocity );

    return currentVelocity;
}


function calc_accel(index, tDelta){
     
    var accel = new THREE.Vector3();
    accel.subVectors( currentVelocity, oldVelocity );
    
    //currentVelocity.sub( oldVelocity );
    return accel; 
}


function calc_acceloration(index, tDelta){

    var indices = get_selected_marker_indices();

    var accel = new THREE.Vector3();
    accel.subVectors(prevVelocity, velocity);
    accel.divideScalar(30 / trc.data.DataRate);
    
    for (var i=0; i<indices.length; i++) {
        var velocity = calc_velocity(indices[i], 30);
        prevVelocity = velocity;
    }
       return accel;
}


//////////////////////////////////////////


function calc_speed(index) {
    if (currentFrame===0) {
        return 0;
    }
    var t1 = trc.data.vertSamples[currentFrame-1][index];
    var t2 = trc.data.vertSamples[currentFrame][index];
    var len = new THREE.Vector3()
    len.subVectors(t2, t1);
    return len.length();

    console.log(len.length());
} 


function calc_max_speed(index) {
    var maxLength = 0.0;
    for (var i=1; i<trc.data.NumFrames; i++) {
        var t1 = trc.data.vertSamples[i-1][index];
        var t2 = trc.data.vertSamples[i][index];
        var len = new THREE.Vector3()
        len.subVectors(t2, t1);
        if (len.length() > maxLength) {
            maxLength = len.length();
        }
    }
    return maxLength;
}

var degToRad = function(val) {
    return val*Math.PI/180.0;
}