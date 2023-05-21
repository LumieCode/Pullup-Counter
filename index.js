let detector;
let detectorConfig;
let poses;
let video;
let skeleton = true;
let model;
let reps = 0;
let rightWrist;
let leftWrist;
let rightWristMax;
let rightWristMin;
let leftWristMax;
let leftWristMin;
let initPosRightWrist;
let initPosLeftWrist;
let wristSameCord = false;
let nose;
let initialPos;
let landingPos;
let rightElbow;
let leftElbow;
let didInitialPosHppen;
let fullBodyCheck;

async function setup() {
  var msg = new SpeechSynthesisUtterance('Loading, please wait...');
  window.speechSynthesis.speak(msg);
 
 createCanvas(960, 720);
  video = createCapture(VIDEO, videoReady);
 video.size(960, 720);
  video.hide()


  await init();
}

async function init() {
  detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER };
  detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
  edges = {
    '5,7': 'm',
    '7,9': 'm',
    '6,8': 'c',
    '8,10': 'c',
    '5,6': 'y',
    '5,11': 'm',
    '6,12': 'c',
    '11,12': 'y',
    '11,13': 'm',
    '13,15': 'm',
    '12,14': 'c',
    '14,16': 'c'
  };
  getPoses();

}

async function videoReady() {
  console.log('video ready');
}



async function getPoses() {
  poses = await detector.estimatePoses(document.querySelector('canvas'));

  setTimeout(getPoses, 0);
}

function draw() {
    
  background(220);

   image(video, 0, 0, video.width, video.height);
  // Draw keypoints and skeleton
  drawKeypoints();
  if (skeleton) {
    drawSkeleton();
  }
  translate(width, 0);
  scale(-1, 1);
 

  
  // Write text
  fill(255);
  strokeWeight(2);
  stroke(51);
    translate(width, 0);
  scale(-1, 1);
  textSize(40);

  if (poses && poses.length > 0) {
    let pusinitialPosString = `Pull-ups completed: ${reps}`;
    text(pusinitialPosString, 100, 90);
  }
  else {
    text('Loading, please wait...', 100, 90);
  }

}

function drawKeypoints() {
  var count = 0;
  if (poses && poses.length > 0) {
    for (let kp of poses[0].keypoints) {
      const { x, y, score } = kp;
      if (score > 0.3) {
        count = count + 1;
        fill(255);
        stroke(0);
        strokeWeight(4);
        circle(x, y, 16);
     
}
}
 repCount(); }

          
     
}
function repCount(){

    rightWrist = Math.floor(poses[0].keypoints[10].y);
   leftWrist = Math.floor(poses[0].keypoints[9].y);
   nose = Math.floor(poses[0].keypoints[0].y);
   rightElbow = Math.floor(poses[0].keypoints[7].y);
   leftElbow = Math.floor(poses[0].keypoints[8].y);
 
   rightWristMax = rightWrist + 20;
   rightWristMin = rightWrist - 20;
   leftWristMax = leftWrist + 20;
   leftWristMin = leftWrist - 20;
   
    if(nose < leftWrist && nose < rightWrist){
    initPosRightWrist = Math.floor(poses[0].keypoints[10].y);
     initPosLeftWrist = Math.floor(poses[0].keypoints[9].y);
     didInitialPosHppen = true; 
    }

    if (initPosRightWrist > rightWristMax || initPosRightWrist < rightWristMin || initPosLeftWrist > leftWristMax || initPosLeftWrist < leftWristMin) {
     landingPos = false;
     didInitialPosHppen= false;}
     else
     {wristSameCord = true;}
       
    if(nose > leftElbow && nose > rightElbow && nose > rightWrist && nose > leftWrist){
     landingPos = true;
    }else{
     landingPos = false;
    }

    if(didInitialPosHppen && landingPos && wristSameCord){
     reps = reps + 1;
     landingPos = false;
     didInitialPosHppen = false;
     wristSameCord = false;
    }
    
   }


// Draws lines between the keypoints
function drawSkeleton() {
  confidence_threshold = 0.5;

  if (poses && poses.length > 0) {
    for (const [key, value] of Object.entries(edges)) {
      const p = key.split(",");
      const p1 = p[0];
      const p2 = p[1];

      const y1 = poses[0].keypoints[p1].y;
      const x1 = poses[0].keypoints[p1].x;
      const c1 = poses[0].keypoints[p1].score;
      const y2 = poses[0].keypoints[p2].y;
      const x2 = poses[0].keypoints[p2].x;
      const c2 = poses[0].keypoints[p2].score;

      if ((c1 > confidence_threshold) && (c2 > confidence_threshold)) {
        
          strokeWeight(2);
          stroke('rgb(0, 255, 0)');
          line(x1, y1, x2, y2);
        
      }
    }
  }
}






