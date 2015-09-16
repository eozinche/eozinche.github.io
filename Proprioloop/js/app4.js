var scene;
var camera;
var renderer;
var controls;

var TOP = ['Top_Head', 'FR_Head', 'BR_Head', 'FL_Head', 'BL_Head', 'R_Shoulder_Top', 'R_Shoulder_Back', 'R_Bicep', 'R_Elbow', 'R_Wrist_Upper', 'R_Wrist_Lower', 'R_Pinky', 'R_Thumb', 'L_Shoulder_Top', 'L_Shoulder_Back', 'L_Bicep', 'L_Elbow', 'L_Wrist_Upper', 'L_Wrist_Lower', 'L_Pinky', 'L_Thumb', 'Topspine', 'Sternum', 'Midback', 'Lowback_Center', 'Lowback_Right', 'Lowback_Left', 'Root']
var BOTTOM = ['BRHip', 'BLHip', 'FRHip', 'FLHip', 'R_Troc', 'R_Thigh', 'R_Knee', 'R_Calf', 'R_Ankle', 'R_Foot_Lat', 'R_Toe_Lat', 'R_Toe_Med', 'L_Troc', 'L_Thigh', 'L_Knee', 'L_Calf', 'L_Ankle', 'L_Foot_Lat', 'L_Toe_Lat', 'L_Toe_Med'];

var SCALE = 0.05;
var trc = {};
var isPlaying = true;
var currentFrame = 0;
var startTime;
var previousTime;
var interval;
var dynObjs = [];
var mkrParams;
var gui;
var trailLength = 50;
var views;

var gridHelper;
var isGridHelperVisible = true;
var isPtcVisible = true;
var isLoading = false;

var isFieldVisible = false;

var oldVelocity =  new THREE.Vector3(),
    currentVelocity =  new THREE.Vector3();


//-------particle----------//
            var group;
            var container, stats;
            var model1 , model2, model3;
            var particlesData = [];
            var camera, scene, Renderer;
            var pPositions,pColors;
            var pointCloud;
            var particlePositions;
            var linesMesh;

            var maxParticleCount = 1500; //1000
            var particleCount = 1000; //500
            var r = 400; //800
            var rHalf = r / 2;

            var effectController = {
                showDots: true,
                showLines: true,
                minDistance: 150,
                limitConnections: false,
                maxConnections: 20,
                particleCount: 500
            }


//-------particle----------//


var radius = 5;
var segments = 6;
var sphere;

function load_data_index(url, callback) {
    $.getJSON(
        url, 
        function(data) {

            for (var folder in data) {
                var innerHeader = $(document.createElement('div'))
                    .attr({id: folder, role: 'tab'})

                    .addClass('panel-heading').append(

                    $(document.createElement('h4'))
                        .addClass('panel-title').append(
                        $(document.createElement('a'))
                            .attr({ "data-toggle":"collapse",
                                "data-parent":"#accordion",
                                href:"#collapse"+folder,
                                "aria-expanded":true,
                                "aria-controls":"collapse"+folder
                            })
                            .html(folder)
                        )
                    )
                ////////////////////////////////

                var body = $(document.createElement('div'))
                    .addClass("panel-body");

                for (var i=0; i<data[folder].length; i++) {
                    var name = data[folder][i].name;
                    var url = data[folder][i].url;
                    var btn = $(document.createElement('button'))
                        .attr({ type:"button",
                                onclick:"open_trc('"+url+"')"})
                        .html(name);
                    body.append(btn);
                }

                var bodyWrapper = $(document.createElement('div'))
                    .attr({ id:"collapse"+folder,
                            role:"tabpanel",
                            "aria-labelledby":"heading"+folder
                    })
                    .addClass("panel-collapse")
                    .addClass("collapse")
                    .append(body)

                $("#trc-accordion").append(
                    $(document.createElement('div'))
                    .addClass("panel")
                    .addClass("panel-default")
                    .append(innerHeader))
                    .append(bodyWrapper);

        }


        init();
    });
}



//////////////////////INIT///////////////////////////////////

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

            var info = document.createElement('div');
            info.style.position = 'absolute';
           // info.style.background = 'black';
            info.style.left = '20px';
            info.style.bottom = '20px';
            info.style.width = '40%';
            info.style.height = '20%';
            info.style.textAlign = 'left';
            info.innerHTML = 'HERE IS INFO CANVAS';
            info.innerHTML += '</div>';
            container.appendChild(info);

            model1 = document.createElement('div');
            document.body.appendChild(model1);

            var viz1 = document.createElement('div');
            viz1.style.position = 'absolute';
            viz1.style.background = '#E6E6E6';
            viz1.style.right = '0px';
            viz1.style.top = '0px';
            viz1.style.width = '100%';
            viz1.style.height = '33.4%';
            viz1.style.textAlign = 'right';
            viz1.innerHTML = 'Spline Extrusion Examples by <a href="http://www.lab4games.net/zz85/blog">zz85</a><br/>Select spline:';
          
            model1.appendChild(viz1);

            model2 = document.createElement('div');
            document.body.appendChild(model2);

            var viz2 = document.createElement('div');
            viz2.style.position = 'absolute';
            viz2.style.background = '#B8B8B8';
            viz2.style.right = '0px';
            viz2.style.top = '33%';
            viz2.style.width = '100%';
            viz2.style.height = '33.4%';
            viz2.style.textAlign = 'right';
            viz2.innerHTML = 'Spline Extrusion Examples by <a href="http://www.lab4games.net/zz85/blog">zz85</a><br/>Select spline:';
          
          //  model2.appendChild(viz2);

            model3 = document.createElement('div');
            document.body.appendChild(model3);

            var viz3 = document.createElement('div');
            viz3.style.position = 'absolute';
            viz3.style.background = '#8A8A8A';
            viz3.style.right = '0px';
            viz3.style.top = '66%';
            viz3.style.width = '100%';
            viz3.style.height = '33.4%';
            viz3.style.textAlign = 'right';
            viz3.innerHTML = 'Spline Extrusion Examples by <a href="http://www.lab4games.net/zz85/blog">zz85</a><br/>Select spline:';
          
          //  model3.appendChild(viz3);

//////////////

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor( 0x212538 );
    //renderer.setClearColor( 0xCFCFCF );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 10000);

    window.addEventListener('resize', function() {
        var WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH/HEIGHT;
        camera.updateProjectionMatrix();
    });
    camera.position.z = 120;
    camera.position.y = 100;

    $('#shortcutModal').modal({
        keyboard: true,
        show: false
    })
    $('#loadModal').modal({
        keyboard: false
    })
}

//////////////////////INIT///////////////////////////////////


function new_scene() {
    if (scene != undefined) {
        scene = {};
    }
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
    var ambient = new THREE.AmbientLight( 0x101030 );
    scene.add( ambient );

    var directionalLight = new THREE.DirectionalLight( 0xffeedd );
    directionalLight.position.set( 0, 0, 0.5 );
    scene.add( directionalLight );

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.damping = 0.2;

    gridHelper = new THREE.GridHelper(100, 10);
    scene.add(gridHelper);



    //Particle System

                    pGeometry = new THREE.BufferGeometry();
                    var pMaterial = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });

                    var pSegments = maxParticleCount * maxParticleCount;

                    pPositions = new Float32Array( pSegments * 3 );
                    pColors = new Float32Array( pSegments * 3 );

                    var pMaterial = new THREE.PointCloudMaterial({
                        color: 0xFF5050,
                        size: 3,
                        blending: THREE.AdditiveBlending,
                        transparent: true,
                        sizeAttenuation: false
                    });

                particles = new THREE.BufferGeometry();
                particlePositions = new Float32Array( maxParticleCount * 3 );

                for ( var i = 0; i < maxParticleCount; i++ ) {

                    var x = Math.random() * r - r / 2;
                    var y = Math.random() * r - r / 2;
                    var z = Math.random() * r - r / 2;

                    particlePositions[ i * 3     ] = x;
                    particlePositions[ i * 3 + 1 ] = y;
                    particlePositions[ i * 3 + 2 ] = z;

                    // add it to the geometry
                    particlesData.push({
                        velocity: new THREE.Vector3( -1 + Math.random() * 2, -1 + Math.random() * 2,  -1 + Math.random() * 2 ),
                        numConnections: 0
                    });

                }

                particles.drawcalls.push( {
                    start: 0,
                    count: particleCount,
                    index: 0
                } );

                particles.addAttribute( 'position', new THREE.BufferAttribute( particlePositions, 3 ) );

                // create the particle system
                pointCloud = new THREE.PointCloud( particles, pMaterial );

                group = new THREE.Object3D();

                // add it to the scene
                group.add( pointCloud );

                pGeometry.addAttribute( 'position', new THREE.BufferAttribute( pPositions, 3 ) );
                pGeometry.addAttribute( 'color', new THREE.BufferAttribute( pColors, 3 ) );

                pGeometry.computeBoundingSphere();

                pGeometry.drawcalls.push( {
                    start: 0,
                    count: 0,
                    index: 0
                } );

                linesMesh = new THREE.Line( pGeometry, pMaterial, THREE.LinePieces );
                group.add( linesMesh );

              //  scene.add( group );


    //

    currentFrame = 0;
    dynObjs = [];
    mkrParams = [];
    isGridHelperVisible = true;
    isPtcVisible = true;
}

function initGui() {
    if (gui != undefined) {
        gui = {};
        $(".dg.ac").html('');
    }

    gui = new dat.GUI({ autoPlace: true });

    mkrParams = {
        all:selectAll,
        none:selectNone,
        toggle:toggleSelection
    };

    for (var i=0; i<trc.data.groups.length; i++) {
        mkrParams[trc.data.groups[i]] = false;
    }
    gui.add(mkrParams, "all");
    gui.add(mkrParams, "none");
    gui.add(mkrParams, "toggle");

    for (var i=0; i<trc.data.groups.length; i++) {
        gui.add(mkrParams, trc.data.groups[i]).listen();
    }

    //----------pGui-------------//
                var pGui = new dat.GUI({autoPlace: true});
                pGui.add( effectController, "showDots" ).onChange( function( value ) { pointCloud.visible = value; } );
                pGui.add( effectController, "showLines" ).onChange( function( value ) { linesMesh.visible = value; } );
                pGui.add( effectController, "minDistance", 10, 300 );
                pGui.add( effectController, "limitConnections" );
                pGui.add( effectController, "maxConnections", 0, 30, 1 );
                pGui.add( effectController, "particleCount", 0, maxParticleCount, 1 ).onChange( function( value ) {

                particleCount = parseInt( value );
                particles.drawcalls[ 0 ].count = particleCount;

                });
     //----------pGui-------------//
                 
    isLoading = false;
    animate();
}

function selectAll() {
    for (var i=0; i<trc.data.groups.length; i++ ) {
        mkrParams[trc.data.groups[i]] = true;
    }
}

function selectNone() {
    for (var i=0; i<trc.data.groups.length; i++ ) {
        mkrParams[trc.data.groups[i]] = false;
    }
}

function toggleSelection() {
    for (var i=0; i<trc.data.groups.length; i++ ) {
        mkrParams[trc.data.groups[i]] = !mkrParams[trc.data.groups[i]];
    }
}

function load_trc(url, callback) {
  //  console.log("Reading ", url);
    $("#loadingText").html(url);
    $("#loadingModal").modal({
        keyboard: false,
        show: true
    })
    if (trc!=undefined) {
        trc = {};
    }
    $.ajax({
        url: url,
        dataType: 'json',
        method: 'GET',
        progress:  function(e) {
        //make sure we can compute the length
            if(e.lengthComputable) {
                //calculate the percentage loaded
                var pct = Math.floor((e.loaded / e.total) * 100);
                $("#loadingProgress").attr({"aria-valuenow":pct});
                $("#loadingProgress").css("width",pct+"%");
                $("#loadingProgress").html(pct+"%");
            }
            //this usually happens when Content-Length isn't set
            else {
                $("#loadingProgress").attr({"aria-valuenow":100});
                $("#loadingProgress").addClass("active progress-bar-striped");
                $("#loadingProgress").css("width","100%");
                $("#loadingProgress").html("Please be patient...");
                console.warn('Content Length not reported!');
            }
        },
        success: function(trcData) {
            trcData.vertSamples = [];
            for (var i=0; i<trcData.samples.length; i++) {
                var sample = trcData.samples[i].samples;
                var vertices = [];
                for (var j=0; j<sample.length; j=j+3) {
                    var vert = new THREE.Vector3(
                        sample[j]   * SCALE,
                        sample[j+1] * SCALE,
                        sample[j+2] * SCALE);
                    vertices.push(vert);
                }
                trcData.vertSamples.push(vertices);
            }
            trc.data = trcData;


            var geometry = new THREE.Geometry();
            geometry.vertices = trc.data.vertSamples[currentFrame];
            var material = new THREE.PointCloudMaterial({size: 1});
            trc.ptc = new THREE.PointCloud( geometry, material );

            // var geometry = new THREE.Geometry();
            // geometry.vertices = trc.data.vertSamples[currentFrame];
            // var material = new THREE.PointCloudMaterial({size: 1});
            // trc.ptc = new THREE.PointCloud( geometry, material );


            ///////////////

        //\\    var geometry = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
        //\\    var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );
        //\\    trc.ptc = new THREE.Mesh( geometry, material );

            trc.ptc.updateMatrix();
            trc.ptc.matrixAutoUpdate = false;
            scene.add( trc.ptc );

/*
        var geometry = new THREE.SphereGeometry(0.5, segments, segments);
        var material = new THREE.MeshBasicMaterial({
            //color: 0xD24344,
            color: 0xFFFFFF,
            transparent: true
        });
        trc.ptc = new THREE.Mesh(geometry, material);
    //    scene.add(trc.ptc);


            ///////////////

            scene.add(trc.ptc);

*/
            interval = (5000.0 / trc.data.DataRate);
            startTime = Date.now();
            previousTime = Date.now();
            $('#loadingModal').modal('hide');
            callback();
        } 
    });
}

function open_trc(url) {
    isLoading = true;
    // clean scene
    $('#loadModal').modal('hide');
    new_scene();
    load_trc(url, initGui);
}

function pAnimate() {
                var vertexpos = 0;
                var colorpos = 0;
                var numConnected = 0;

                for ( var i = 0; i < particleCount; i++ )
                    particlesData[ i ].numConnections = 0;

                for ( var i = 0; i < particleCount; i++ ) {

                    // get the particle
                    var particleData = particlesData[i];

                    particlePositions[ i * 3     ] += particleData.velocity.x;
                    particlePositions[ i * 3 + 1 ] += particleData.velocity.y;
                    particlePositions[ i * 3 + 2 ] += particleData.velocity.z;

                    if ( particlePositions[ i * 3 + 1 ] < -rHalf || particlePositions[ i * 3 + 1 ] > rHalf )
                        particleData.velocity.y = -particleData.velocity.y;

                    if ( particlePositions[ i * 3 ] < -rHalf || particlePositions[ i * 3 ] > rHalf )
                        particleData.velocity.x = -particleData.velocity.x;

                    if ( particlePositions[ i * 3 + 2 ] < -rHalf || particlePositions[ i * 3 + 2 ] > rHalf )
                        particleData.velocity.z = -particleData.velocity.z;

                    if ( effectController.limitConnections && particleData.numConnections >= effectController.maxConnections )
                        continue;

                    // Check collision
                    for ( var j = i + 1; j < particleCount; j++ ) {

                        var particleDataB = particlesData[ j ];
                        if ( effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections )
                            continue;

                        var dx = particlePositions[ i * 3     ] - particlePositions[ j * 3     ];
                        var dy = particlePositions[ i * 3 + 1 ] - particlePositions[ j * 3 + 1 ];
                        var dz = particlePositions[ i * 3 + 2 ] - particlePositions[ j * 3 + 2 ];
                        var dist = Math.sqrt( dx * dx + dy * dy + dz * dz );

                        if ( dist < effectController.minDistance ) {

                            particleData.numConnections++;
                            particleDataB.numConnections++;

                            var alpha = 1.0 - dist / effectController.minDistance + 0.2;

                            pPositions[ vertexpos++ ] = particlePositions[ i * 3     ];
                            pPositions[ vertexpos++ ] = particlePositions[ i * 3 + 1 ];
                            pPositions[ vertexpos++ ] = particlePositions[ i * 3 + 2 ];

                            pPositions[ vertexpos++ ] = particlePositions[ j * 3     ];
                            pPositions[ vertexpos++ ] = particlePositions[ j * 3 + 1 ];
                            pPositions[ vertexpos++ ] = particlePositions[ j * 3 + 2 ];

                            pColors[ colorpos++ ] = alpha;
                            pColors[ colorpos++ ] = alpha;
                            pColors[ colorpos++ ] = alpha;

                            pColors[ colorpos++ ] = alpha;
                            pColors[ colorpos++ ] = alpha;
                            pColors[ colorpos++ ] = alpha;

                            numConnected++;
                        }
                    }
                }

                linesMesh.geometry.drawcalls[ 0 ].count = numConnected * 2;
                linesMesh.geometry.attributes.position.needsUpdate = true;
                linesMesh.geometry.attributes.color.needsUpdate = true;

                pointCloud.geometry.attributes.position.needsUpdate = true;
}

function animate() {
    if (isLoading) return;
    var currentTime=Date.now();


    if (isPlaying) {
        var frameNumber = Math.floor(((currentTime - startTime)/interval) % trc.data.NumFrames);
        if (currentFrame != frameNumber) {
            currentFrame = frameNumber;
            trc.ptc.geometry.vertices = trc.data.vertSamples[currentFrame];
            trc.ptc.geometry.verticesNeedUpdate = true;
            //
            for (var i=0; i<dynObjs.length; i++) {
                dynObjs[i].updateFunc(dynObjs[i]);
            }

            if(isFieldVisible == false) pAnimate();
        }

    } else {
        trc.ptc.geometry.vertices = trc.data.vertSamples[currentFrame];
        trc.ptc.geometry.verticesNeedUpdate = true;
        for (var i=0; i<dynObjs.length; i++) {
            dynObjs[i].updateFunc(dynObjs[i]);
        }
    }
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
    controls.update();
}

var keyPressed = function(event) {
   // console.log(event);
    switch (event.keyCode) {
        case 32: // space - stop and start playback
            isPlaying = !isPlaying;
            break;
        case 65: // a - creates a curve that spans through the selected points over the duration of the clip
            create_mkr_path();
            break;
        case 66: // b - creates brush strokes along the ground, following the selected markers
            //create_speed_circles();
            create_circles();
            break;
        case 67: // c - creates a spline curve between the selected markers that travels with them
            create_mkr_curve();
            break;
        case 71: // g - toggles the grid visibility
            if (isGridHelperVisible) {
                scene.remove(gridHelper)
            } else {
                scene.add(gridHelper);
            }
            isGridHelperVisible = !isGridHelperVisible;
            break;
        case 75: // k - show keyboard shortcuts
            $('#shortcutModal').modal('show');
            break;
        case 77: // m - toggles the marker visibility
            if (isPtcVisible) {
                scene.remove(trc.ptc)
            } else {
                scene.add(trc.ptc);
            }
            isPtcVisible = !isPtcVisible;
            break;
        case 79: // o - open load dialog
            $('#loadModal').modal('show');
            break;
        case 83: // s - toggle selection menu visibility
            if (gui.closed) { gui.open(); } else { gui.close(); }
            break;
        case 84: // t - create motion trails
            create_speed_spheres();
            break;
        case 85: // u - create "up" arrows
            create_vertical_arrows();
            break;
        case 86: // v - create velocity vector arrows
            //create_velocity_arrows();
            create_accel_arrows();
            break;
        case 88: // x - step one frame forward in time
            if (!isPlaying) {
                currentFrame += 1;
            }
            break;
        case 90: // z - step one frame back in time
            if (!isPlaying) {
                currentFrame -= 1;
            }
            break;
        case 192: // ` - remove all lines
            // `
            for(var i=scene.children.length-1; i>=0; i--) {
                if (scene.children[i].type === "Line" || scene.children[i].type === "ArrowHelper") {
                    scene.remove(scene.children[i]);
                }
            }
            break;
        case 70: // f - on/off field
            if (isFieldVisible) {
                scene.add(group);
            } else {
                scene.remove(group);
            }
            isFieldVisible = !isFieldVisible;
            break;
    }
}
document.addEventListener("keydown", keyPressed, false);

function get_selected_marker_indices() {
    var indices = [];
    for (var i=0; i<trc.data.groups.length; i++) {
        var name = trc.data.groups[i];
        if ( mkrParams[name]) {
            var mkrIndex = trc.data.groups.indexOf(name);
            indices.push(mkrIndex);
        }
    }
    return indices;

}

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

    var indices = get_selected_marker_indices();
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


var preVelo = new THREE.Vector3(0,0,0);



//  function create_velocity_arrows() {
//      var indices = get_selected_marker_indices();
//      for (var i=0; i<indices.length; i++) {

//          var velocity = calc_velocity(indices[i], 30);
//          var length = velocity.length();
//          var dir = velocity.normalize();

//    
//          console.log(velocity);

//          var origin = new THREE.Vector3( 0, 0, 0 );
//          origin.copy(trc.data.vertSamples[currentFrame][indices[i]]);

//          var hex = 0xE96B56;

//          var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
//          scene.add( arrowHelper );
//          dynObjs.push({
//              obj: arrowHelper,
//              index: indices[i],
//              updateFunc: update_velocity_arrow
//          });
//      }
// }


// function update_velocity_arrow(arrowObj) {
//      var velocity = calc_velocity(arrowObj.index, 10);
//      arrowObj.obj.setLength(velocity.length()*0.3, velocity.length()*0.2, velocity.length()*0.1);
//      var v = velocity.length();
//      arrowObj.obj.setDirection(velocity.normalize());
//      arrowObj.obj.position.copy(trc.data.vertSamples[currentFrame][arrowObj.index]);

//      var col = new THREE.Color();
//      col.setHex(0xE96B56);
//      col.offsetHSL(0.0,0.0,v*0.0005);

//      arrowObj.obj.setColor(col.getHex());
// }


function create_accel_arrows() {
    var indices = get_selected_marker_indices();
    for (var i=0; i<indices.length; i++) {

        var velocity = calc_velocity(indices[i], 30);
        var length = velocity.length();
        var dir = velocity.normalize();

        ///////changed by chanwook
        var accel = new THREE.Vector3();

        accel.subVectors(preVelo, velocity);
        accel.divideScalar(0.033333);

        var accel_length = accel.length()/2;
        var accel_dir = accel.normalize();
        ////////////////
        console.log(velocity);

        var origin = new THREE.Vector3( 0, 0, 0 );
        origin.copy(trc.data.vertSamples[currentFrame][indices[i]]);

        var hex = 0x00CC66;

        var arrowHelper = new THREE.ArrowHelper( accel_dir, origin, accel_length, hex );
        scene.add( arrowHelper );
        dynObjs.push({
            obj: arrowHelper,
            index: indices[i],
            updateFunc: update_accel_arrow
        });
    }
}

function update_accel_arrow(arrowObj) {
    var velocity = calc_velocity(arrowObj.index, 10);
    ///////changed by chanwook
    var accel = new THREE.Vector3();

    accel.subVectors(velocity,preVelo);
    accel.divideScalar(0.0833333);

        ////////////////
    arrowObj.obj.setLength(accel.length()*0.3/2, accel.length()*0.2/2, accel.length()*0.1/2);
    var v = accel.length();
    arrowObj.obj.setDirection(accel.normalize());
    arrowObj.obj.position.copy(trc.data.vertSamples[currentFrame][arrowObj.index]);

    var col = new THREE.Color();
    col.setHex(0xE96B56);
    col.offsetHSL(0.0,0.0,v*0.0005);

    arrowObj.obj.setColor(col.getHex());

    preVelo = velocity;

    console.log("A: " + accel.x + "  V: " + velocity.x);
   // console.log(tDelta / trc.data.DataRate);
}

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
    var scaleFactor = 1/(5000*speed);

    //var scaleFactor = 8*speed;
   // var accelo = calc_accel(obj.index) / obj.maxSpeed;

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
            updateFunc: update_speed_spheres,
            maxSpeed: maxSpeed,
            children: []
        });
    }
}


// function create_speed_spheres_test() {
//     var indices = get_selected_marker_indices();
//     for (var i=0; i<indices.length; i++) {
//         var index = indices[i];
//         var maxSpeed = calc_max_speed(index)
//         maxSpeeds[index] = maxSpeed;
//         dynObjs.push({
//             obj: null,
//             index: index,
//             updateFunc: update_speed_spheres,
//             maxSpeed: maxSpeed,
//             children: []
//         });
//     }
// }

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

function update_speed_spheres(obj) {
    if (currentFrame === 0) { return; }
    var speed = calc_speed(obj.index) / obj.maxSpeed;
    var radius = speed*1.5;
    var segments = 6;
 //   var sphere;

    var particles = 100;   
    var positions = new Float32Array( particles * 3 );
    var colors = new Float32Array( particles * 3 );
    var color = new THREE.Color();
    var n = 50, n2 = n / 2; // particles spread in the cube

    for ( var i = 0; i < positions.length; i += 3 ) {

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
        particles.material.opacity = 1.0;
    } else {



        var geometry = new THREE.BufferGeometry();

                geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
                geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

                geometry.computeBoundingSphere();


        var material = new THREE.PointCloudMaterial( { size: 15, vertexColors: THREE.VertexColors } );

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


//var accel = [];


function calc_fakeAccel(index, tDelta) {
    // tDelta in samples | 120 = 1 second
    // var points = [];
    // for (var i=0; i<tDelta; i++) {
    //     if (currentFrame+i < trc.data.NumFrames) {
    //         points.push(trc.data.vertSamples[currentFrame+i][index]);
    //     }
    // }

    // var prevPoints = [];
    // for (var i=0; i<tDelta; i++) {
    //     if (currentFrame < trc.data.NumFrames && currentFrame > -1) {
    //         prevPoints.push(trc.data.vertSamples[currentFrame][index]);
    //     }
    // }    



var currentVelocity;
var indices = get_selected_marker_indices();
    for (var i=0; i<indices.length; i++) {
        var oldVelocity = currentVelocity;
        currentVelocity = calc_velocity(indices[i], 30);

        var tempVec = new THREE.Vector3();
        tempVec.subVectors(currentVelocity,oldVelocity);
        tempVec = tempVec.divideScalar(0.333333);
        accel.push(tempVec);
    
}
     return accel;

}
    // var curve = new THREE.SplineCurve3( points );
    // var length = curve.getLength();

    // var speed = length/ (tDelta / trc.data.DataRate);
    // // get normalized vector
    // var velocity =  new THREE.Vector3();
    // velocity.subVectors(curve.getPoint(1),curve.getPoint(0));
    // velocity.normalize();

    // velocity.multiplyScalar(speed);


/////////////////////////////////////////////////

// function calc_fakeAccel(index, tDelta) {
//     if (currentFrame===0) {
//     return 0;
//     }
//     var p1 = trc.data.vertSamples[currentFrame-1][index];
//     var p2 = trc.data.vertSamples[currentFrame][index];
    

//     var v1 = 
//     var len = new THREE.Vector3();

//     len.subVectors(p2, p1);
    

//     return len.length();

//     var speed = length.length()/ (tDelta / trc.data.DataRate);

//     var points = [];
//     for (var i=0; i<tDelta; i++) {
//         if (currentFrame+i < trc.data.NumFrames) {
//             points.push(trc.data.vertSamples[currentFrame+i][index]);
//     }

// }



// function calc_accel(index, tDelta) {
//     // tDelta in samples | 120 = 1 second
//       var points = [];
//     for (var i=0; i<tDelta; i++) {
//         if (currentFrame+i < trc.data.NumFrames) {
//             points.push(trc.data.vertSamples[currentFrame+i][index]);
//         }
//     }
//     var curve = new THREE.SplineCurve3( points );
//     var length = curve.getLength();

//     var speed = length/ (tDelta / trc.data.DataRate);



//     // get normalized vector
//     var velocity1 =  new THREE.Vector3();
//     velocity1.subVectors(curve.getPoint(1),curve.getPoint(0));
//     velocity1.normalize();
//     velocity1.multiplyScalar(speed);

    
//     var velocity2 =  new THREE.Vector3();
//     velocity2.subVectors(curve.getPoint(2),curve.getPoint(1));
//     velocity2.normalize();
//     velocity2.multiplyScalar(speed);



//     var accel = new THREE.Vector3();
//     accel.subVectors(velocity2.getPoint(0),velocity1.getPoint(0));

//     return accel/(tDelta / trc.data.DataRate);

//     console.log(accel/(tDelta / trc.data.DataRate));
// }


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

load_data_index("data/trc.json", init);
//init();