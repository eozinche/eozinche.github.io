var scene;
var camera;
var renderer;
var controls;

var TOP = ['Top_Head', 
			'FR_Head', 
			'BR_Head', 
			'FL_Head', 
			'BL_Head', 
			'R_Shoulder_Top', 
			'R_Shoulder_Back', 
			'R_Bicep', 
			'R_Elbow', 
			'R_Wrist_Upper', 
			'R_Wrist_Lower', 
			'R_Pinky', 
			'R_Thumb', 
			'L_Shoulder_Top', 
			'L_Shoulder_Back', 
			'L_Bicep', 
			'L_Elbow', 
			'L_Wrist_Upper', 
			'L_Wrist_Lower', 
			'L_Pinky', 
			'L_Thumb', 
			'Topspine', 
			'Sternum', 
			'Midback', 
			'Lowback_Center', 
			'Lowback_Right', 
			'Lowback_Left', 
			'Root']

var BOTTOM = ['BRHip', 
			  'BLHip', 
			  'FRHip', 
			  'FLHip', 
			  'R_Troc', 
			  'R_Thigh', 
			  'R_Knee', 
			  'R_Calf', 
			  'R_Ankle', 
			  'R_Foot_Lat', 
			  'R_Toe_Lat', 
			  'R_Toe_Med', 
			  'L_Troc', 
			  'L_Thigh', 
			  'L_Knee', 
			  'L_Calf', 
			  'L_Ankle', 
			  'L_Foot_Lat', 
			  'L_Toe_Lat', 
			  'L_Toe_Med'];

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

var gridHelper;
var isGridHelperVisible = true;
var isPtcVisible = true;
var isLoading = false;

function init(){
}

function initGui(){
}

function animate(){
}

function render(){
}

var keyPressed = function(event){
	console.log(event);
	switch (event.keyCode) {
	}
}
document.addEventListener("keydown", keyPressed, false);


var degToRad = function(val) {
    return val*Math.PI/180.0;
}




