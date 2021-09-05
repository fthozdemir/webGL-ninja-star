/*author: Fatih Özdemir
  Final Project Gazi University-2021*/
var gl;
var canvas;
var program;

var theta = 0.0;
var rotateLoc;
var scale = 1;
var scaleLoc;
var spiralAngle = 0;
var spiralSpeed = 5;
var translationComp = 0.0;

var isRotating = false;
var rotateSpeed = 0.01;

var isSNGactive = false;
var isSpiralActive = false;

var scaleDirection = true;

var cVertices = [];
var tVertices = [];
var vertices = [];
var colors = [];
var mediumGrayColor = [0.0, 0.0, 0.0, 0.5];
var yellowColor = [1.0, 1.0, 0.0, 1.0];

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("webGL is not avaible");
  }

  // Configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 0.0, 1.0);

  // SET vertices and colors
  setStarVertices();
  setCircleVertices();

  //Load shaders and initialize attribute buffers
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  //SET LOCATIONS
  rotateLoc = gl.getUniformLocation(program, "_rotateTheta");
  scaleLoc = gl.getUniformLocation(program, "_scale");
  spiralTheta = gl.getUniformLocation(program, "_spiralTheta");
  spiralComp = gl.getUniformLocation(program, "_translation_comp");

  UIHandler();
  draw();
};

function setStarVertices() {
  // 4 point star Vertices witf TRIANGLES mode
  tVertices = [
    vec2(0.0, 0.0),
    vec2(-0.25, 0.0),
    vec2(-0.5, 0.5),

    vec2(0.0, 0.0),
    vec2(-0.5, 0.5),
    vec2(0.0, 0.25),

    vec2(0.0, 0.0),
    vec2(0.0, 0.25),
    vec2(0.5, 0.5),

    vec2(0.0, 0.0),
    vec2(0.5, 0.5),
    vec2(0.25, 0.0),

    vec2(0.0, 0.0),
    vec2(0.25, 0.0),
    vec2(0.5, -0.5),

    vec2(0.0, 0.0),
    vec2(0.5, -0.5),
    vec2(0.0, -0.25),

    vec2(0.0, 0.0),
    vec2(0.0, -0.25),
    vec2(-0.5, -0.5),

    vec2(0.0, 0.0),
    vec2(-0.5, -0.5),
    vec2(-0.25, 0.0),
  ];

  //concatenate triangle vertices and colors
  for (var i = 0; i < tVertices.length; i++) {
    vertices.push(tVertices[i]);
    colors.push(mediumGrayColor);
  }
}

function setCircleVertices() {
  //center points of circles
  var cc = [
    vec2(0, 0),
    vec2(0, 0.25),
    vec2(0.25, 0),
    vec2(-0.25, 0),
    vec2(0, -0.25),
  ];

  // calculate Circle vertices
  for (var k = 0; k < cc.length; k++) {
    for (var i = 0.0; i <= 369; i += 1) {
      var j = (i * Math.PI) / 180;

      var vert1 = vec2(
        cc[k][0] + 0.05 * Math.sin(j),
        cc[k][1] + 0.05 * Math.cos(j)
      );
      var vert2 = vec2(
        cc[k][0] + 0.05 * Math.sin(i),
        cc[k][1] + 0.05 * Math.cos(i)
      );
      var vert3 = cc[k];

      cVertices.push(vert1);
      cVertices.push(vert2);
      cVertices.push(vert3);
    }
  }

  //concatenate circles vertices and colors
  for (var i = 0; i < cVertices.length; i++) {
    vertices.push(cVertices[i]);
    colors.push(yellowColor);
  }
}

function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  if (isRotating) {
    theta += rotateSpeed;
  }

  if (isSNGactive) {
    if (Math.abs(1.0 - scale) > 0.5) {
      scaleDirection = !scaleDirection;
    }
    //change interval of the scale
    scale += scaleDirection ? 0.02 : -0.02;
  }

  if (isSpiralActive) {
    if (spiralSpeed < 0 && spiralAngle >= 450) {
      spiralAngle -= 900;
    } else if (spiralSpeed > 0 && spiralAngle <= -450) {
      spiralAngle += 900;
    }
    spiralAngle -= spiralSpeed;

    /* 
    divide by scale value makes the ninja star spinning global
    z axis according to its diameter because of avoiding to touch the edges
     */
    translationComp = spiralAngle / (1550 * scale);
  }

  //reattach colors to the color buffer
  var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  gl.uniform1f(rotateLoc, theta);
  gl.uniform1f(scaleLoc, scale);
  gl.uniform1f(spiralTheta, spiralAngle);
  gl.uniform1f(spiralComp, translationComp);

  gl.drawArrays(gl.TRIANGLES, 0, vertices.length);

  window.requestAnimFrame(draw);
}
