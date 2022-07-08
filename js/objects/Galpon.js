import { Objeto3D } from './objeto3d.js';
import { WALL } from '../common/textures.js';
import { vec3, vec4 } from 'https://cdn.skypack.dev/gl-matrix';
import { Pared } from './Pared.js';
import { Barra } from './Barra.js';
import { RGB_WHITE } from '../common/colors.js';
import { SupBarrido } from '../supBarrido.js';
import { generarCurvaGalpon } from '../curvas.js';
import { generarSuperficie } from './objeto3d.js';

export class Galpon extends Objeto3D {
    constructor(padre) {
        super(padre);
        var filas = 5;
        var columnas = 40;
        this.alto = 15;
        var ancho = 50;
        this.initTextures(WALL);

        let galpon = new Objeto3D(this);
        let superficie = new SupBarrido(generarCurvaGalpon(this.alto, ancho), 50, 0, false, filas, columnas)
        galpon.setGeometria(generarSuperficie(superficie, 10));
        galpon.setRotacion(Math.PI / 2, Math.PI, 0);
        galpon.initTextures(WALL);
        this.agregarHijo(galpon);

        let paredIzq = new Pared(this);
        paredIzq.setPosicion(-ancho/2, 0, 0);
        this.agregarHijo(paredIzq);

        let paredDer = new Pared(this);
        paredDer.setPosicion(ancho/2, 0, 0);
        this.agregarHijo(paredDer);

        this.posLamparas = [
            vec3.fromValues(-5, this.alto + 3, 0),
            vec3.fromValues(5, this.alto + 3, 0),
            vec3.fromValues(-5, this.alto + 3, 10),
            vec3.fromValues(5, this.alto + 3, 10),
            vec3.fromValues(-5, this.alto + 3, -10),
            vec3.fromValues(5, this.alto + 3, -10)
        ]
        for (let i = 0; i < this.posLamparas.length; i++) {
            let lampara = new Barra(this, 0.2, 0.2);
            lampara.setPosicion(this.posLamparas[i][0], this.posLamparas[i][1]-1, this.posLamparas[i][2]);
            lampara.setColor(RGB_WHITE);
            this.agregarHijo(lampara);
        }
    }

    setLights() {
        let direccionSpot = vec3.fromValues(0, -1, 0);
        for (let i = 0; i < this.posLamparas.length; i++) {
            var posicionSpot = this.posLamparas[i];
            this.setSpotLight(i+1, this.getPosicionMundo(posicionSpot), direccionSpot);
        }
    }

    setSpotLight(id, posicionSpot, direccionSpot) {
        gl.uniform4fv(gl.getUniformLocation(glProgram, "Spot" + id + ".position"), vec4.fromValues(posicionSpot[0], posicionSpot[1], posicionSpot[2], 1));
        gl.uniform1f(gl.getUniformLocation(glProgram, "Spot" + id + ".intensityA"), 0.07);
        gl.uniform1f(gl.getUniformLocation(glProgram, "Spot" + id + ".intensityD"), 1.0);
        gl.uniform1f(gl.getUniformLocation(glProgram, "Spot" + id + ".intensityS"), 0.1);
        gl.uniform3fv(gl.getUniformLocation(glProgram, "Spot" + id + ".direction"), vec3.fromValues(direccionSpot[0], direccionSpot[1], direccionSpot[2]));
        gl.uniform1f(gl.getUniformLocation(glProgram, "Spot" + id + ".exponent"), 10.0);
        gl.uniform1f(gl.getUniformLocation(glProgram, "Spot" + id + ".cutoff"), 40);
    }
}
