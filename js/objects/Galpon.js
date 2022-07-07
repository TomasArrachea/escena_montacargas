import { SupBarrido } from '../supBarrido.js';
import { generarCurvaGalpon } from '../curvas.js';
import { Objeto3D, generarSuperficie } from './objeto3d.js';
import { WALL } from '../common/textures.js';
import { vec3, vec4 } from 'https://cdn.skypack.dev/gl-matrix';

export class Galpon extends Objeto3D {
    constructor(padre) {
        super(padre);
        var filas = 5;
        var columnas = 20;
        this.alto = 15;
        var ancho = 50;
        this.initTextures(WALL);
        let superficie = new SupBarrido(generarCurvaGalpon(this.alto, ancho), 50, 0, false, filas, columnas)
        this.setGeometria(generarSuperficie(superficie, 20));
        this.setRotacion(Math.PI / 2, Math.PI, 0);
    }

    dibujar(matrizPadre) {
        var modelado = this.setMatricesShader(matrizPadre);

        if (this.vertexBuffer && this.indexBuffer) {
            this.setLights();
            this.generarColor();
            this.initShaders();
            if (this.strip) {
                gl.drawElements(gl.TRIANGLE_STRIP, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            } else {
                gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
        }

        for (var i = 0; i < this.hijos.length; i++) {
            this.hijos[i].dibujar(modelado);
        }
        gl.bindTexture(gl.TEXTURE_2D, null); // tengo que agregar esta linea para que no aplique la textura de un objeto a todos
    }

    setLights() {
        let direccionSpot = vec3.fromValues(0, -1, 0);
        var posicionSpot = vec3.fromValues(-5, this.alto, 0);
        this.setSpotLight(11, posicionSpot, direccionSpot);

        var posicionSpot = vec3.fromValues(5, this.alto, 0);
        this.setSpotLight(12, posicionSpot, direccionSpot);

        var posicionSpot = vec3.fromValues(-5, this.alto, 10);  
        this.setSpotLight(13, posicionSpot, direccionSpot);

        var posicionSpot = vec3.fromValues(5, this.alto, 10);
        this.setSpotLight(21, posicionSpot, direccionSpot);

        var posicionSpot = vec3.fromValues(-5, this.alto, -10);
        this.setSpotLight(22, posicionSpot, direccionSpot);

        var posicionSpot = vec3.fromValues(5, this.alto, -10);
        this.setSpotLight(23, posicionSpot, direccionSpot);

    }

    setSpotLight(id, posicionSpot, direccionSpot) {
        gl.uniform4fv(gl.getUniformLocation(glProgram, "Spot" + id + ".position"), vec4.fromValues(posicionSpot[0], posicionSpot[1], posicionSpot[2], 1));
        gl.uniform1f(gl.getUniformLocation(glProgram, "Spot" + id + ".intensityA"), 0.07);
        gl.uniform1f(gl.getUniformLocation(glProgram, "Spot" + id + ".intensityD"), 1.0);
        gl.uniform1f(gl.getUniformLocation(glProgram, "Spot" + id + ".intensityS"), 0.25);
        gl.uniform3fv(gl.getUniformLocation(glProgram, "Spot" + id + ".direction"), vec3.fromValues(direccionSpot[0], direccionSpot[1], direccionSpot[2]));
        gl.uniform1f(gl.getUniformLocation(glProgram, "Spot" + id + ".exponent"), 15.0);
        gl.uniform1f(gl.getUniformLocation(glProgram, "Spot" + id + ".cutoff"), 40);
    }
}
