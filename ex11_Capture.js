/*
 * @name Video Capture
 * @frame 710,240
 * @description Capture video from the webcam and display
 * on the canvas as well with invert filter. Note that by
 * default the capture feed shows up, too. You can hide the
 * feed by uncommenting the capture.hide() line.
 */
//let capture;

let cnv;
let videoCapture;
let matSrc;
let matDst;
let matGrey;
let faces;
let classifier;
const videoElem  = document.getElementById('video');

const faceCascadeFile = './haarcascade_frontalface_default.xml';

function preload() 
{
  console.log( 'on OpenCV.js Loaded', cv );
  cv.onRuntimeInitialized = preload;
 
  console.log('On Ready');
  videoElem.width  = 320;
  videoElem.height = 240;
  videoCapture = new cv.VideoCapture( videoElem );

  matSrc  = new cv.Mat( 240, 320, cv.CV_8UC4 );  // For Video Capture
  matDst  = new cv.Mat( 240, 320, cv.CV_8UC4 );  // For Canvas Preview
  matGrey = new cv.Mat();
  faces = new cv.RectVector();

  // Load XML File With XHR
  const utils = new Utils('error-message');  // Set Element ID
  utils.createFileFromUrl(faceCascadeFile, faceCascadeFile, () => {
    console.log( faceCascadeFile );
  }
  );

  classifier = new cv.CascadeClassifier();
  console.log(classifier.load( faceCascadeFile ));
  if ( classifier.load( faceCascadeFile ) == true )
  {
    console.log("ok!");
  }
}

function setup() 
{
  //cnv = createCanvas(320, 240);
  //cnv.id('canvas');

  capture = createCapture(VIDEO);
  capture.size(320, 240);
  capture.hide();

  //videoElem.srcObject = capture;
  //videoElem.play();

  frameRate( 30 );
}

function draw()
{
  background(128);
  //filter(INVERT);

  /*
  for ( let x=0; x<320; x++ )
   {
   for ( let y=0; y<240; y++ )
   {
   matDst.data[(y*320+x)*4+0] = 0;//capture.pixels[(y*320+x)*4+0];
   matDst.data[(y*320+x)*4+1] = 0;//capture.pixels[(y*320+x)*4+0];
   matDst.data[(y*320+x)*4+2] = 0;//capture.pixels[(y*320+x)*4+0];
   matDst.data[(y*320+x)*4+3] = 0;//255;
   }
   }*/

  //videoCapture.read(matSrc); 

  //matSrc.copyTo( matDst );  // Copy Src To Dst  
  cv.cvtColor( matDst, matGrey, cv.COLOR_RGBA2GRAY, 0 );  // Get Grey Image
  //console.log( matDst );
  //console.log( matGrey );
  classifier.detectMultiScale( matGrey, faces, 1.1, 3, 0 );  // Detect Faces
  // Draw Faces Rectangle
  for (let i = 0; i < faces.size(); i++) 
  {
    const face = faces.get(i);
    const point1 = new cv.Point(face.x, face.y);
    const point2 = new cv.Point(face.x + face.width, face.y + face.height);
    cv.rectangle(matDst, point1, point2, [255, 0, 0, 255]);
  }

  /*
    videoCapture.read(matSrc);  // Capture Video Image To Mat Src
   
   matSrc.copyTo(matDst);  // Copy Src To Dst
   cv.cvtColor(matDst, matGrey, cv.COLOR_RGBA2GRAY, 0);  // Get Grey Image
   classifier.detectMultiScale(matGrey, faces, 1.1, 3, 0);  // Detect Faces
   console.log("check3") ;
   // Draw Faces Rectangle
   for (let i = 0; i < faces.size(); ++i) 
   {
   const face = faces.get(i);
   const point1 = new cv.Point(face.x, face.y);
   const point2 = new cv.Point(face.x + face.width, face.y + face.height);
   cv.rectangle(matDst, point1, point2, [255, 0, 0, 255]);
   }
   
   */

  //cv.imshow('canvas', matSrc);  // Set Element ID

  image(capture, 0, 0, width, height );
}