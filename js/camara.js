import {mat4, vec3} from 'https://cdn.skypack.dev/gl-matrix';

const GENERAL = 1;
const IMPRESORA = 2;
const ESTANTERIA = 3;
const CONDUCTOR = 4;
const CARRO_TRASERA = 5;
const CARRO_LATERAL = 6;


class Camara {
    // 1. Cámara orbital general: apunta al centro de la escena.
    // 2. Cámara orbital impresora: su objetivo esta centrado en la impresora
    // 3. Cámara orbital estantería: su objetivo está centrado en la estantería
    // 4. Cámara de conductor: muestra la vista hacia adelante que tendría el conductor del carro
    // 5. Cámara de seguimiento auto elevador trasera: sigue al vehículo desde atrás
    // 6. Cámara de seguimiento auto elevador lateral: sigue al vehículo de costado

    // necesita una referencia al carro para poder seguir su movimiento, las otras son posiciones estaticas
    constructor(carro, posImpresora, posEstanteria){
        this.camaraActual = GENERAL;
        this.posEstanteria = posEstanteria;
        this.posImpresora = posImpresora;
        this.carro = carro;
        this.alejamiento = 10;
        this.rotacionActual = 0;
        this.velocidadRotacion = 0.002;

        this.rotacionGuiniada = 0;
        this.rotacionCabeceo = 0;
    }

    setCamera(idCamara){
        this.camaraActual = idCamara;
        this.rotacionGuiniada = 0;
        this.rotacionCabeceo = 0;
        this.alejamiento = 10;
    }

    zoom(delta){
        if ((this.alejamiento + delta) > 0)
            this.alejamiento += delta;
        
    }

    sumGiroGuiniada(delta){
        this.rotacionGuiniada += delta;
        if (this.rotacionGuiniada >= 2*Math.PI && delta > 0) {
            this.rotacionGuiniada = 0;
        } else if (this.rotacionGuiniada <= 0 && delta < 0) {
            this.rotacionGuiniada = 2*Math.PI;
        }
    }

    sumGiroCabeceo(delta){
        if (this.rotacionCabeceo < 1.2 && delta > 0 || this.rotacionCabeceo > -0.4 && delta < 0)
            this.rotacionCabeceo += delta;
    }

    getCameraMatrix(){
        // todo: refactorizar haciendo un objeto por cada tipo de foco.
        var alturaCamara = 5

        if (this.camaraActual == GENERAL){
            let m = mat4.create();
            let posicionCamara = vec3.fromValues(-this.alejamiento,alturaCamara,0);
            
            mat4.lookAt(m, posicionCamara, vec3.fromValues(0,0,0), vec3.fromValues(0,1,0));

            // mat4.rotate(m, m, Math.PI/6, [0,0,1]); // rotacion para que se vea desde arriba y no paralelo al suelo
            mat4.rotate(m, m, this.rotacionCabeceo, vec3.fromValues(0,0,1));
            mat4.rotate(m, m, this.rotacionGuiniada, vec3.fromValues(0,1,0));
            return m;

        } else if (this.camaraActual == IMPRESORA) {
            let m = mat4.create();
            let posicionCamara = vec3.fromValues(
                -this.posImpresora[0] + this.alejamiento,
                -this.posImpresora[1] + alturaCamara,
                -this.posImpresora[2]
            );
            
            mat4.lookAt(m, posicionCamara, vec3.fromValues(-this.posImpresora[0],-this.posImpresora[1], -this.posImpresora[2]), vec3.fromValues(0,1,0));
            mat4.rotate(m, m, this.rotacionCabeceo, vec3.fromValues(0,0,1));
            mat4.rotate(m, m, this.rotacionGuiniada, vec3.fromValues(0,1,0));
            
            return m;
        }

        else if (this.camaraActual == ESTANTERIA) {
            let m = mat4.create();
            mat4.identity(m);
            let posicionCamara = vec3.fromValues(
                -this.posEstanteria[0] + this.alejamiento,
                -this.posEstanteria[1] + alturaCamara,
                -this.posEstanteria[2]
            );
            
            mat4.lookAt(m, posicionCamara, vec3.fromValues(-this.posEstanteria[0],-this.posEstanteria[1], -this.posEstanteria[2]), vec3.fromValues(0,1,0));
            mat4.rotate(m, m, this.rotacionCabeceo, vec3.fromValues(0,0,1));
            mat4.rotate(m, m, this.rotacionGuiniada, vec3.fromValues(0,1,0));
            return m;
        }
        
        else if (this.camaraActual == CONDUCTOR) {
            this.carro.actualizarMatrizModelado();
            let matrizCamara = this.carro.matrizModelado;
            let m = mat4.create();

            mat4.translate(m, m, [0,0,0]);

            // Roto para que quede atras y con un angulo de inclinación
            mat4.rotate(m, m, Math.PI/2, [0,1,0]);
            mat4.rotate(m, m, Math.PI/6, [0,0,1]);
            
            // Tomo la transormación inversa del carro para utilizarlo como matriz de cámara
            mat4.invert(matrizCamara, matrizCamara);
            mat4.multiply(m, m, matrizCamara);
            return m;

        } else if (this.camaraActual == CARRO_TRASERA) {
            this.carro.actualizarMatrizModelado();
            let matrizCamara = this.carro.matrizModelado;
            let m = mat4.create();

            mat4.translate(m, m, [-this.alejamiento,0,0]);
            // Roto para que quede atras
            mat4.rotate(m, m, Math.PI/2, [0,1,0]);
            
            // Tomo la transormación inversa del carro para utilizarlo como matriz de cámara
            mat4.invert(matrizCamara, matrizCamara);
            mat4.multiply(m, m, matrizCamara);
            return m;

        } else if (this.camaraActual == CARRO_LATERAL) {
            this.carro.actualizarMatrizModelado();
            let matrizCamara = this.carro.matrizModelado;
            let m = mat4.create();

            mat4.translate(m, m, [-this.alejamiento,0,0]);
            // Roto para que quede en el lateral
            mat4.rotate(m, m, Math.PI/4, [0,1,0]);
            
            // Tomo la transormación inversa del carro para utilizarlo como matriz de cámara
            mat4.invert(matrizCamara, matrizCamara);
            mat4.multiply(m, m, matrizCamara);
            return m;
        }
    }
}


export {Camara}