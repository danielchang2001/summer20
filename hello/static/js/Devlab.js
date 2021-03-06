var width = window.innerWidth;
var height = window.innerHeight;

var stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height,
  x: 20,
  y: 50,
  draggable: true,
});

var layer = new Konva.Layer({
  //scaleX: 1.2,
  //scaleY: 0.8,
  //rotation: 5,
});
stage.add(layer);


var group = new Konva.Group({
  //draggable: false,
  //x: 30,
  //rotation: 10,
  //scaleX: 1.5,
});
layer.add(group);

var text = new Konva.Text({
  text: 'Click on the canvas to draw a circle',
  fontSize: 20,
});
//group.add(text);
layer.draw();

// this function will return pointer position relative to the passed node
function getRelativePointerPosition(node) {
  var transform = node.getAbsoluteTransform().copy();
  // to detect relative position we need to invert transform
  transform.invert();

  // get pointer (say mouse or touch) position
  var pos = node.getStage().getPointerPosition();

  // now we can find relative point
  return transform.point(pos);
}

var scaleBy = 1.05;
stage.on('wheel', (e) => {
  e.evt.preventDefault();
  var oldScale = stage.scaleX();

  var pointer = stage.getPointerPosition();

  var mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  };

  var newScale =
    e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

  stage.scale({ x: newScale, y: newScale });

  var newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  };
  stage.position(newPos);
  stage.batchDraw();
});

// ================================================== //
// SECTION BELOW IS FOR CREATING NEW SHAPES (CIRCLE & SQUARE) //
// ================================================== //

// makes id of selected shape a global variable
function createShape(shapeID) {
  window.idString = shapeID;
}

increasingID = 0;

// event listener for creating new shapes:

stage.on('dblclick dbltap', function () {
  var combined = new Konva.Group({
    draggable: true,
  });
  var txtobj = new Konva.Group({
    //draggable: true,
  });
  var shpobj = new Konva.Group({
    //draggable: true,
  });
  layer.add(txtobj);
  layer.add(shpobj);
  layer.add(combined);
  var pos = getRelativePointerPosition(group);
  var textbox = new Konva.Text({
    text: 'Text',
    fontSize: 15,
    fill: 'black',
    x: pos.x - 15,
    y: pos.y - 5,
    //draggable: true,
  });
  if (idString == 'square') { // creates a square
    stringID = 'shape' + increasingID;
    var shape = new Konva.Rect({
      x: pos.x,
      y: pos.y,
      width: 60,
      height: 60,
      fill: 'white',
      id: stringID,
      shadowBlur: 25,
      draggable: true,
    });
    increasingID++;
  }
  else if (idString == 'circle') { // creates a circle
    stringID = 'shape' + increasingID;
    var shape = new Konva.Circle({
      x: pos.x,
      y: pos.y,
      fill: 'white',
      radius: 60,
      id: stringID,
      shadowBlur: 25,
      draggable: true,
    });
    increasingID++;
  }
  
  txtobj.add(textbox);
  shpobj.add(shape);
  combined.add(txtobj);
  combined.add(shpobj);
  txtobj.moveToTop();
  layer.batchDraw();
});

// ================================================== //
// SECTION BELOW IS FOR CREATING LINES BETWEEN SHAPES //
// ================================================== //

shapeCounter = 0; // keeps track of which shape is selected first and second

var linePressed = false; // variable for whether line button is pressed initialized

// linePressed becomes true when the Line button is clicked in NavBar
function createLine() {
  linePressed = true;
}

var arrayOfShapes = []; // array used to store shapes outside of local scope.

// When any shape is clicked:

layer.on('click tap', function(e){
  if (linePressed == true) { // if Line button pressed, do this. lse do nothing.
    var selectedID = e.target.attrs.id;
    if (shapeCounter == 0) { // if shape clicked is the first shape selected:
      var Shape1 = stage.findOne("#" + selectedID);
      arrayOfShapes.push(Shape1);
      shapeCounter++;
      document.getElementById('alrt').innerHTML='<b>Please wait, Your download will start soon!!!</b>'; 
      setTimeout(function() {document.getElementById('alrt').innerHTML='';},5000);

    }
    else { // if shape clicked is second shape selected:
      var Shape1 = arrayOfShapes[0];
      arrayOfShapes = [];
      var Shape2 = stage.findOne("#" + selectedID);
      shapeCounter = 0;

      var arrow = new Konva.Arrow({
        points: [Shape1.getX(), Shape1.getY(), Shape2.getX(), Shape2.getY()],
        pointerLength: 10,
        pointerWidth: 15,
        fill: 'white',
        stroke: 'skyblue',
        strokeWidth: 8,
        opacity: 0.5
      });

      function adjustPoint(e){
        var p=[Shape1.getX(), Shape1.getY(), Shape2.getX(), Shape2.getY()];
        arrow.setPoints(p);
        layer.draw();
      }

      Shape1.on('dragmove', adjustPoint);

      Shape2.on('dragmove', adjustPoint);
      layer.add(arrow);
      layer.add(Shape2);
      layer.add(Shape1);
      Shape2.moveToTop();
      Shape1.moveToTop();
      layer.batchDraw();
      linePressed = false; // resets linePressed variable
    }
  }
  else {
    
  }
})  
stage.add(layer);

// ================================================== //
// ================================================== //
// ================================================== //

// VVV zooming into shapes, still need to fix. VVV
/*
var zoomLevel = 2;
layer.on('mouseenter', function () {
  layer.scale({
    x: zoomLevel,
    y: zoomLevel,
  });
  layer.draw();
});

layer.on('mousemove', function (e) {
  var pos = stage.getPointerPosition();
  layer.x(-pos.x);
  layer.y(-pos.y);
  layer.draw();
});

layer.on('mouseleave', function () {
  layer.x(0);
  layer.y(0);
  layer.scale({
    x: 1,
    y: 1,
  });
  layer.draw();
});
*/