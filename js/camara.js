import {mat4, vec3} from 'https://cdn.skypack.dev/gl-matrix';

const GENERAL = 1;
const IMPRESORA = 2;
const ESTANTERIA = 3;
const CONDUCTOR = 4;
const CARRO_TRASERA = 5;
const CARRO_LATERAL = 6;


class Camara {
    // Cámara orbital general: apunta al centro de la escena.
    // Cámara orbital impresora: su objetivo esta centrado en la impresora
    // Cámara orbital estantería: su objetivo está centrado en la estantería
    // Cámara de conductor: muestra la vista hacia adelante que tendría el conductor del auto
    // elevador
    // 5. Cámara de seguimiento auto elevador trasera: sigue al vehículo desde atrás
    // 6. Cámara de seguimiento auto elevador lateral: sigue al vehículo de costado

    // necesita una referencia al carro para poder seguir su movimiento, las otras son posiciones estaticas
    constructor(carro, posImpresora, posEstanteria){
        this.camaraActual = CONDUCTOR;
        this.posEstanteria = posEstanteria;
        this.posImpresora = posImpresora;
        this.carro = carro;
        this.alejamiento = 10;
        this.rotacionActual = 0;
        this.velocidadRotacion = 0.002;

        this.rotacionX = 0;
    }

    setCamera(idCamara){
        this.camaraActual = idCamara;
        this.rotacionX = 0;
        this.rotacionY = 0;
    }

    zoom(delta){
        if ((this.alejamiento + delta) > 0)
            this.alejamiento += delta;
        
    }

    sumGiroX(delta){
        this.rotacionX += delta;
        if(this.rotacionX >= Math.PI*2 && delta > 0){
            this.rotacionX = 0;
        }else if (this.rotacionX <= 0 && delta < 0){
            this.rotacionX = 2*Math.PI;
        }
    }

    sumGiroY(delta){
        if(this.rotacionY < 1.483 && delta > 0 || this.rotacionY > -1.483 && delta < 0)
            this.rotacionY += delta;
    }

    getCameraMatrix(){
        //TODO: CORREGIR METODO Y AGREGAR LOS OTROS CASOS. Se podria mejorar haciendo un objeto por cada foco.

      

    }
}


export {Camara}