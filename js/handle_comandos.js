// HANDLE DE PRESION DE TECLAS
 
// ASDW para desplazar el carro en el plano XZ
// QE para desplazar la pala del carro en el eje Y
// OP para acercar o alejar la camara
// 1,2,3,4,5,6 para cambiar el objetivo de la camara

const VEL_TRASLACION = 0.1;  // velocidad de traslacion 
const VEL_PALA = 0.1;
const VEL_GIRO = 0.02;        // velocidad de giro
const DELTA_ZOOM = 0.55;
const FACTOR_ZOOM_MOUSE = 0.02;
const VEL_ROTACION_CAMARA = 0.01;


let keyDownListener = (event, escena, camara) => {
    var carro = escena.getCarro();
    if (event.code == 'Digit1') {
        console.log('CAMARA GENERAL');
        camara.setCamera(1);
    }
    if (event.code == 'Digit2') {
        console.log('CAMARA IMPRESORA');
        camara.setCamera(2);
    }
    if (event.code == 'Digit3') {
        console.log('CAMARA ESTANTERIA');
        camara.setCamera(3);
    }
    if (event.code == 'Digit4') {
        console.log('CAMARA DEL CONDUCTOR');
        camara.setCamera(4);
    }
    if (event.code == 'Digit5') {
        console.log('CAMARA TRASERA DEL CARRO');
        camara.setCamera(5);
    }
    if (event.code == 'Digit6') {
        console.log('CAMARA LATERAL DEL CARRO');
        camara.setCamera(6);
    }
    if (event.code=='KeyO') {
        camara.zoom(DELTA_ZOOM);
    }
    if (event.code=='KeyP') {
        camara.zoom(-DELTA_ZOOM);
    }
    if (event.code == 'KeyA') {
        carro.setVelGiro(VEL_GIRO);
    }
    if (event.code == 'KeyS') {
        carro.setVelX(-VEL_TRASLACION);
    }
    if (event.code == 'KeyD') {
        carro.setVelGiro(-VEL_GIRO);
    }
    if (event.code == 'KeyW') {
        carro.setVelX(VEL_TRASLACION);
    }
    if (event.code == 'KeyQ') {
        carro.setVelY(VEL_PALA);
    }
    if (event.code == 'KeyE') {
        carro.setVelY(-VEL_PALA);
    }
    if (event.code == 'KeyG') {
        carro.toggleRecojer();
    }
};


let keyUpListener = (event, escena) => {
    var carro = escena.getCarro();
    if (event.code == 'KeyA') {
        carro.setVelGiro(0);
    }
    if (event.code == 'KeyS') {
        carro.setVelX(0);
    }
    if (event.code == 'KeyD') {
        carro.setVelGiro(0);
    }
    if (event.code == 'KeyW') {
        carro.setVelX(0);
    }
    if (event.code == 'KeyQ') {
        carro.setVelY(0);
    }
    if (event.code == 'KeyE') {
        carro.setVelY(0);
    }
};


// HANDLE DE MOUSE
let mouseClick = false;
let oldX = 0;
let oldY = 0;

let mouseDownListener = () => {
    mouseClick = true;
  }

function isInsideCanvas(x, y, canvasW, canvasH) {
    return window.screen.width/2 - canvasW/2 < x && x < window.screen.width/2 + canvasW/2 
        && window.screen.height/2 - canvasH/2 < y && y < window.screen.height/2 + canvasH/2;
}

let mouseMoveListener = (e, camara, canvasW, canvasH) => {

    if (mouseClick && isInsideCanvas(e.pageX, e.pageY, canvasW, canvasH)) {
      if (e.pageX > oldX){
        camara.sumGiroGuiniada((e.pageX-oldX)*VEL_ROTACION_CAMARA);
      }
      else if(e.pageX < oldX){
        camara.sumGiroGuiniada((e.pageX-oldX)*VEL_ROTACION_CAMARA);
      }
      if(e.pageY > oldY){
        camara.sumGiroCabeceo((e.pageY - oldY)*VEL_ROTACION_CAMARA);
      }
      else if(e.pageY < oldY){
        camara.sumGiroCabeceo((e.pageY - oldY)*VEL_ROTACION_CAMARA);
      }
    }
    oldX = e.pageX;
    oldY = e.pageY;
  }

let mouseUpListener = () => {
    mouseClick = false;
  }

let mouseWheelListener = (event, camara) => {
    camara.zoom(event.deltaY * FACTOR_ZOOM_MOUSE);
}

export {mouseWheelListener, mouseMoveListener, mouseUpListener, mouseDownListener, keyUpListener, keyDownListener}