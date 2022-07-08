import { mat4, vec3 } from 'https://cdn.skypack.dev/gl-matrix';

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
    constructor(carro, posImpresora, posEstanteria) {
        this.camaraActual = GENERAL;
        this.posEstanteria = posEstanteria;
        this.posImpresora = posImpresora;
        this.carro = carro;

        this.alejamiento = 7;
        this.rotacionGuiniada = 0;
        this.rotacionCabeceo = 0;
    }

    setCamera(idCamara) {
        this.camaraActual = idCamara;
        this.rotacionCabeceo = 0;
        this.rotacionGuiniada = 0;
        this.alejamiento = 7;
    }

    zoom(delta) {
        if ((this.alejamiento + delta) > 0)
            this.alejamiento += delta;

    }

    sumGiroGuiniada(delta) {
        this.rotacionGuiniada += delta;
        if (this.rotacionGuiniada >= 2 * Math.PI && delta > 0) {
            this.rotacionGuiniada = 0;
        } else if (this.rotacionGuiniada <= 0 && delta < 0) {
            this.rotacionGuiniada = 2 * Math.PI;
        }
    }

    sumGiroCabeceo(delta) {
        if (this.rotacionCabeceo + delta < 1.2 && this.rotacionCabeceo + delta > -0.4)
            this.rotacionCabeceo += delta;
    }

    getCameraMatrix() {
        // todo: refactorizar haciendo un objeto por cada tipo de foco.
        var alturaCamara = 2

        if (this.camaraActual == GENERAL) {
            let vista = mat4.create();
            let posicionCamara = vec3.fromValues(0, alturaCamara, this.alejamiento);

            mat4.lookAt(vista, posicionCamara, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));
            mat4.rotate(vista, vista, this.rotacionCabeceo, vec3.fromValues(1, 0, 0));
            mat4.rotate(vista, vista, this.rotacionGuiniada, vec3.fromValues(0, 1, 0));
            return vista;

        } else if (this.camaraActual == IMPRESORA) {
            let vista = mat4.create();
            let posicionCamara = vec3.fromValues(0, alturaCamara, this.alejamiento);
            mat4.lookAt(vista, posicionCamara, vec3.fromValues(this.posImpresora[0], 0, this.posImpresora[2]), vec3.fromValues(0, 1, 0));

            var xAxis = vec3.fromValues(1, 0, 0);
            var vectorCamaraEstanteria = vec3.create();
            vec3.sub(vectorCamaraEstanteria, this.posImpresora, posicionCamara);
            vec3.cross(xAxis, vectorCamaraEstanteria, vec3.fromValues(0, 1, 0));

            mat4.translate(vista, vista, this.posImpresora);
            mat4.rotate(vista, vista, this.rotacionCabeceo, xAxis);
            mat4.rotate(vista, vista, this.rotacionGuiniada, vec3.fromValues(0, 1, 0));
            mat4.translate(vista, vista, [-this.posImpresora[0], -this.posImpresora[1], -this.posImpresora[2]]);

            return vista;
        }

        else if (this.camaraActual == ESTANTERIA) {
            let vista = mat4.create();
            mat4.identity(vista);
            let posicionCamara = vec3.fromValues(0, alturaCamara, this.alejamiento);
            mat4.lookAt(vista, posicionCamara, vec3.fromValues(this.posEstanteria[0], 0, this.posEstanteria[2]), vec3.fromValues(0, 1, 0));

            mat4.translate(vista, vista, this.posEstanteria);
            // no quiero rotar el eje x, quiero que rote sobre el eje x que se forma al rotar la vista para ver el objeto
            // es el prod vectorial de y y la posicion de la estantería - pos de camara
            var xAxis = vec3.fromValues(1, 0, 0);
            var vectorCamaraEstanteria = vec3.create();
            vec3.sub(vectorCamaraEstanteria, this.posEstanteria, posicionCamara);
            vec3.cross(xAxis, vectorCamaraEstanteria, vec3.fromValues(0, 1, 0));

            mat4.rotate(vista, vista, this.rotacionCabeceo, xAxis);
            mat4.rotate(vista, vista, this.rotacionGuiniada, vec3.fromValues(0, 1, 0));
            mat4.translate(vista, vista, [-this.posEstanteria[0], -this.posEstanteria[1], -this.posEstanteria[2]]);

            return vista;
        }

        else if (this.camaraActual == CONDUCTOR) {
            let matrizCamara = mat4.create();
            mat4.copy(matrizCamara, this.carro.matrizModelado);
            let vista = mat4.create();

            mat4.translate(vista, vista, vec3.fromValues(0, -3.8, 0)); // traslacion para que la camara este a la altura del conductor
            mat4.rotate(vista, vista, Math.PI, [0, 1, 0]); // roto para que vea hacia adelante

            // Tomo la transformación inversa del carro para utilizarlo como matriz de cámara
            mat4.invert(matrizCamara, matrizCamara);
            mat4.multiply(vista, vista, matrizCamara);
            return vista;

        } else if (this.camaraActual == CARRO_TRASERA) {
            this.carro.actualizarMatrizModelado();
            let matrizCamara = mat4.create();
            mat4.copy(matrizCamara, this.carro.matrizModelado);
            let vista = mat4.create();

            mat4.translate(vista, vista, vec3.fromValues(0, -7, -12)); // mover la camara atras del carro
            mat4.rotate(vista, vista, Math.PI, [0, 1, 0]); // roto para que vea hacia adelante

            mat4.invert(matrizCamara, matrizCamara);
            mat4.multiply(vista, vista, matrizCamara);
            return vista;

        } else if (this.camaraActual == CARRO_LATERAL) {
            this.carro.actualizarMatrizModelado();
            let matrizCamara = this.carro.matrizModelado;
            let vista = mat4.create();

            mat4.translate(vista, vista, vec3.fromValues(0, -7, -12));
            mat4.rotate(vista, vista, -Math.PI / 2, [0, 1, 0]);

            mat4.invert(matrizCamara, matrizCamara);
            mat4.multiply(vista, vista, matrizCamara);
            return vista;
        }
    }
}


export { Camara }