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
var mInterval = 5000.0;
var dynObjs = [];
var mkrParams;
var gui;
var trailLength = 50;

var radius = 5;
var segments = 6;
var sphere;

var gridHelper;
var isGridHelperVisible = false;
var isPtcVisible = false;
var isLoading = false;

var pointsOption = true;
var isFieldVisible = false;

var oldVelocity =  new THREE.Vector3(),
    currentVelocity =  new THREE.Vector3();

//////// ARROW FIELD /////////
var aMesh, aGeometry, aSphere;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

//-------particle----------//
            var group;
            var container, stats;
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
                particleCount: 500,
                speed: 5000
            }
//-------particle----------//

//-------NEW_LOAD_DATA---S----//

            //var sourceURL = 'http://www.eozinche.com/dataart/source/GreenWood.json';
          

            var mURL0 = 'data/ChangingMo.json',
                mURL1 = 'data/GoingAwayMo.json',
                mURL2 = 'data/GoingWithMo.json';

            var motions;

           ///     getMotionData(mURL0);
           ///     getMotionData(mURL1);
            ///   getMotionData(mURL2);

            function getMotionData(url){
                $.ajax({
                    url: url,
                    type: 'GET',
                    dataType: 'json',
                    error: function(data){
                        console.log('!FAIL LOADING DANCE DATA!!!', data.status);
                    },
                    success: function(data){
                        console.log('!YEY! GOT DANCE DATA');

                        if (!(data instanceof Array)){
                            console.log('!NOPE!!');
                            return;
                        }
                        else {
                            motions = data;
                        }

                        var numOfFrames = data[0].samples.length; // = 2890
                        var numOfIndices = data[0].samples[0].samples.length; // = 147
                        
                    //  for(var j = 0; j < numOfFrames; j++){
                    //      for(var i = 0; i < /*numOfIndices*/2; i++){ 
                                //console.log(data[0].samples[j].samples[i]);
                                console.log(data[0].samples[0].samples[0]);
                    //      }
                    //  }

                    //processData();
                
                    }
                })
            }


//-------NEW_LOAD_DATA---E----//


function load_data_index(url, callback) {
    $.getJSON(url, function(data) {
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

            var body = $(document.createElement('div'))
                .addClass("panel-body");

            for (var i=0; i<data[folder].length; i++) {

                var name = data[folder][i].name;
                var url = data[folder][i].url;
                var btn = $(document.createElement('button'))
                    .attr({ type:"button",
                            onclick:"open_trc('  "+url+"  ')"})
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


if(pointsOption){
            var geometry = new THREE.Geometry();
            geometry.vertices = trc.data.vertSamples[currentFrame];
            var material = new THREE.PointCloudMaterial({size: 1});
            trc.ptc = new THREE.PointCloud( geometry, material );

        
 } else {

            var geometry = new THREE.SphereGeometry(0.5, segments, segments);
            var material = new THREE.MeshBasicMaterial({
            //color: 0xD24344,
          //  opacity: 70,
            blending: THREE.AdditiveBlending,
            color: 0xB2B2B2,
            transparent: true
        });
        trc.ptc = new THREE.Mesh(geometry, material);
        trc.ptc.updateMatrix();
    //        scene.add(trc.ptc);

 }   

     trc.ptc.updateMatrix();
            trc.ptc.matrixAutoUpdate = false;

             scene.add( trc.ptc );



            interval = (mInterval / trc.data.DataRate);

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

    var info = document.createElement('div');
            info.style.position = 'absolute';
            info.style.left = '20px';
            info.style.text = '10px'; 
            info.style.bottom = '20px';
            info.style.width = '100%';
            info.style.color = 'white';
            info.style.textAlign = 'left';
            info.innerHTML = "";
            info.innerHTML += url;
            info.innerHTML += '</div>';
            container.appendChild(info);
}

//////////////////////INIT////////////S///////////////////////

function init() {

            container = document.createElement('div');
            document.body.appendChild(container);

            // var info = document.createElement('div');
            // info.style.position = 'absolute';
            // info.style.left = '20px';
            // info.style.bottom = '20px';
            // info.style.width = '100%';
            // info.style.color = 'white';
            // info.style.textAlign = 'left';
            // info.innerHTML = "";
            //  onclick:"open_trc('"+url+"')"})
            // info.innerHTML += '</div>';
            // container.appendChild(info);


    renderer = new THREE.WebGLRenderer({ antialias: true });
   //// renderer.setClearColor( 0x212538 );
    //renderer.setClearColor( 0xCFCFCF );
    renderer.setClearColor(0x161617);
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.sortObjects = false;

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



//////////////////////INIT/////////////E//////////////////////

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

    gridHelper = new THREE.GridHelper(150, 10);
    gridHelper.setColors (0x000000, 0x000000);
   // scene.add(gridHelper);

    callParticleSystem();
   // create_arrow_field();


    ///////////////////////////////////////////////////

    currentFrame = 0;
    dynObjs = [];
    mkrParams = [];
    isGridHelperVisible = false;
    isPtcVisible = true;
}

function initGui() {
    if (gui != undefined) {
        gui = {};
        $(".dg.ac").html('');
    }



    //----------pGui-------------//
                var pGui = new dat.GUI({autoPlace: true});

                 //pGui.add( effectController, "pointsOption" ).onChange( function( ) { pointsOption = !pointsOption; } );

                 pGui.add( effectController, "showDots" ).onChange( function( value ) { pointCloud.visible = value; } );
                // pGui.add( effectController, "showLines" ).onChange( function( value ) { linesMesh.visible = value; } );
                // pGui.add( effectController, "minDistance", 10, 300 );
                // pGui.add( effectController, "limitConnections" );
                // pGui.add( effectController, "maxConnections", 0, 30, 1 );
                // pGui.add( effectController, "particleCount", 0, maxParticleCount, 1 ).onChange( function( value ) {
                // particleCount = parseInt( value );
                // particles.drawcalls[ 0 ].count = particleCount;
                // });
                pGui.add( effectController, "speed", 500, 10000 ,10).onChange( function( value ) {
               // interval = mInterval;
                mInterval = value;
                });

     
     //----------pGui-------------//
    gui = new dat.GUI({autoPlace: true});

    mkrParams = {
        all:selectAll,
        none:selectNone,
        toggle:toggleSelection,

        Arm_L:selLArm,
        Hand_L:selLHand,

        Arm_R:selRAm,
        Hand_R:selRHand,

        Leg_L:selLLeg,
        Foot_L:selLFoot,

        Leg_R:selRLeg,
        Foot_R:selRFoot
    };

    for (var i=0; i<trc.data.groups.length; i++) {
        mkrParams[trc.data.groups[i]] = false;
    }
    gui.add(mkrParams, "all");
    gui.add(mkrParams, "none");
    gui.add(mkrParams, "toggle");
    gui.add(mkrParams, "Arm_L");
    gui.add(mkrParams, "Hand_L");
    gui.add(mkrParams, "Arm_R");
    gui.add(mkrParams, "Hand_R");
    gui.add(mkrParams, "Leg_L");
    gui.add(mkrParams, "Foot_L");
    gui.add(mkrParams, "Leg_R");
    gui.add(mkrParams, "Foot_R");
    
       for (var i=0; i<trc.data.groups.length; i++) {
        pGui.add(mkrParams, trc.data.groups[i]).listen();
    }



    gui.close();              
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

//arm + hand

function selLArm() {
    for (var i=11; i<17; i++ ) {
        mkrParams[trc.data.groups[i]] = true;
    }
}

function selLHand() {
    for (var i=17; i<22; i++ ) {
        mkrParams[trc.data.groups[i]] = true;
    }
}

function selRAm() {
    for (var i=22; i<28; i++ ) {
        mkrParams[trc.data.groups[i]] = true;
    }
}

function selRHand() {
    for (var i=28; i<33; i++ ) {
        mkrParams[trc.data.groups[i]] = true;
    }
}

//leg + foot

function selLLeg() {
    for (var i=33; i<37; i++ ) {
        mkrParams[trc.data.groups[i]] = true;
    }
}

function selLFoot() {
    for (var i=37; i<41; i++ ) {
        mkrParams[trc.data.groups[i]] = true;
    }
}

function selRLeg() {
    for (var i=41; i<45; i++ ) {
        mkrParams[trc.data.groups[i]] = true;
    }
}

function selRFoot() {
    for (var i=45; i<49; i++ ) {
        mkrParams[trc.data.groups[i]] = true;
    }
}


/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

            function onWindowResize() {

                windowHalfX = window.innerWidth / 2;
                windowHalfY = window.innerHeight / 2;

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize( window.innerWidth, window.innerHeight );

            }

            function onDocumentMouseMove(event) {

                mouseX = ( event.clientX - windowHalfX ) * 10;
                mouseY = ( event.clientY - windowHalfY ) * 10;

            }

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////


function create_surface(){
        var geometry = new THREE.SphereGeometry(0.5, segments, segments);
        var material = new THREE.MeshBasicMaterial({
            //color: 0xD24344,
            color: 0xFFFFFF,
            transparent: true
        });
        trc.ptc = new THREE.Mesh(geometry, material);
    //        scene.add(trc.ptc);

}



function callParticleSystem(){
    //Particle System : grab from app3.js //

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
     //interval = mInterval;
     interval = (mInterval / trc.data.DataRate);

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


    ////////////

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
          //  isPlaying = !isPlaying;
         // var preVelo = new THREE.Vector3(0,0,0);
            create_test_circles();
            break;


//////////////////////////////////////////number 1 -4

        case 49: // num 1 - change points view option
            pointsOption = !pointsOption; 
            break;

        case 50: // number 2 : ACCELO circles  
        //var preVelo = new THREE.Vector3(0,0,0);
            create_test_circles();
            //  create_speed_circles(); // create_circles();
            break;

       case 51: // number 3
            
            //  create_speed_circles(); // create_circles();
            break;

        case 52: // number 4
            
            //  create_speed_circles(); // create_circles();
            break;
////////////////////////////////////////////////////////////

        case 65: // a - creates a curve that spans through the selected points over the duration of the clip
           // create_mkr_path(); 
           create_arrow_field_new();
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
                 scene.add(gridHelper);
            } else { 
               // scene.add(gridHelper);
                scene.remove(gridHelper);
            }
            isGridHelperVisible = !isGridHelperVisible;
            break;
        case 75: // k - show keyboard shortcuts
            $('#shortcutModal').modal('show');
            break;
        case 77: // m - toggles the marker visibility
            if (isPtcVisible) {
                scene.remove(trc.ptc);
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
            create_velocity_arrows();
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

////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////


var preVelo = new THREE.Vector3(0,0,0);



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








load_data_index("data/trc.json", init);

//init();