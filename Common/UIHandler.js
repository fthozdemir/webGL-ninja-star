/*author: Fatih Özdemir
  Final Project Gazi University-2021*/

var rotateButton = document.getElementById("buttonRotate");

function UIHandler() {
  const rotateSpeedText = document.getElementById("rotateSpeedText");

  //rotate animation Buttons
  document.getElementById("buttonRotate").onclick = function () {
    isRotating = !isRotating;
    this.innerHTML = isRotating
      ? '<b style="color:red">STOP </b> Rotate'
      : '<b style="color:green">START </b> Rotate';
  };

  document.getElementById("speedUpRotate").onclick = function () {
    if (rotateSpeed <= 0.09) {
      rotateSpeed += 0.01;
      rotateSpeedText.value = Math.round(rotateSpeed * 100);
    }
  };
  document.getElementById("speedDownRotate").onclick = function () {
    if (rotateSpeed >= -0.09) {
      rotateSpeed -= 0.01;
      rotateSpeedText.value = Math.round(rotateSpeed * 100);
    }
  };

  //Shrink and Grow Animation Buttons
  document.getElementById("buttonSNG").onclick = function () {
    isSNGactive = !isSNGactive;
    this.innerHTML = isSNGactive
      ? '<b style="color:red">STOP </b> S&G'
      : '<b style="color:green">START </b> S&G';
  };

  //Spiral Animation Buttons
  document.getElementById("buttonSpiral").onclick = function () {
    isSpiralActive = !isSpiralActive;
    this.innerHTML = isSpiralActive
      ? '<b style="color:red">STOP </b> Spiral'
      : '<b style="color:green">START </b> Spiral';
  };

  document.getElementById("speedUpSpiral").onclick = function () {
    if (spiralSpeed < 10) {
      spiralSpeed += 1;
      spiralSpeedText.value = Math.round(spiralSpeed);
    }
  };
  document.getElementById("speedDownSpiral").onclick = function () {
    if (spiralSpeed > -10) {
      spiralSpeed -= 1;
      spiralSpeedText.value = Math.round(spiralSpeed);
    }
  };
}
