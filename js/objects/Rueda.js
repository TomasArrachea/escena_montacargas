import { mat4, vec3, vec4 } from 'https://cdn.skypack.dev/gl-matrix';
import { SupRevolucion } from '../supRevolucion.js';
import { generarCurvaRueda } from '../curvas.js';
import { Objeto3D, generarSuperficie } from './objeto3d.js';
import { WHEEL } from '../common/textures.js';

let FACTOR_INERCIA = 0.1;

export class Rueda extends Objeto3D {
    constructor(padre, radio = 1, ancho = 0.4) {
        super(padre);
        this.setGeometria(generarSuperficie(new SupRevolucion(generarCurvaRueda(radio, ancho))));
        this.setRotacion(0, 0, Math.PI / 2);
        this.initTextures(WHEEL);
        this.matrizRotacion = mat4.create();
        this.velGiro = 0;
        this.velAvance = 0;
        this.velAvanceInercial = 0;
    }

    setVelGiro(velGiro) {
        this.velGiro = velGiro;
    }

    setVelAvance(velAvance) {
        this.velAvance = velAvance;
    }

    actualizarMatrizModelado() {
        // rotar segun la velocidad de giro
        this.velAvanceInercial = this.velAvanceInercial + (this.velAvance - this.velAvanceInercial) * FACTOR_INERCIA;

        if (this.velAvance == 0) {
            this.rotacion[0] += this.velAvanceInercial + this.velGiro;
        } else {
            if (this.velGiro == 0)
                this.rotacion[0] += this.velAvanceInercial;
            else if (this.velGiro > 0)
                this.rotacion[0] += this.velAvanceInercial;
            else
                this.rotacion[0] += this.velGiro + this.velAvanceInercial;
        }

        //Reset matriz de modelado.
        mat4.identity(this.matrizModelado);
        //Escalar, rotar, trasladar en ese orden.
        mat4.translate(this.matrizModelado, this.matrizModelado, this.posicion);
        if (this.escala[0] != 0 && this.escala[1] != 0 && this.escala[2] != 0) {
            mat4.scale(this.matrizModelado, this.matrizModelado, this.escala);
        }
        if (this.rotacion[0] != 0)
            mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotacion[0], [1, 0, 0]);
        if (this.rotacion[1] != 0)
            mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotacion[1], [0, 1, 0]);
        if (this.rotacion[2] != 0)
            mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotacion[2], [0, 0, 1]);
    }

}
