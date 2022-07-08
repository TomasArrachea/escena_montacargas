import { RGB_GREEN, RGB_RED } from '../common/colors.js';
import { Cubo } from './Cubo.js';
import { Luz } from './Luz.js';
import { Objeto3D } from './objeto3d.js';
import { vec4 } from 'https://cdn.skypack.dev/gl-matrix';


export class Cabezal extends Objeto3D {
    constructor(padre) {
        super(padre);
        // objeto vacio
        var agarreBarra = new Cubo(this, 0.4, 0.2, 0.3);
        agarreBarra.setPosicion(0, 0, 0);
        agarreBarra.setColor(RGB_GREEN);
        this.agregarHijo(agarreBarra);

        var tirante = new Cubo(this, 0.1, 0.15, 1);
        tirante.setPosicion(0.1, 0, -0.6);
        tirante.setColor(RGB_GREEN);
        this.agregarHijo(tirante);

        var tirante = new Cubo(this, 0.1, 0.15, 1);
        tirante.setPosicion(-0.1, 0, -0.6);
        tirante.setColor(RGB_GREEN);
        this.agregarHijo(tirante);

        var agarrePanel = new Cubo(this, 0.6, 0.2, 0.3);
        agarrePanel.setPosicion(0, 0, -1.2);
        agarrePanel.setColor(RGB_GREEN);
        this.agregarHijo(agarrePanel);

        this.panel = new Cubo(this, 1, 0.05, 1);
        this.panel.setPosicion(0, -0.05, -1.2);
        this.panel.setColor(RGB_GREEN);
        this.agregarHijo(this.panel);

        var luz = new Luz(this);
        luz.setPosicion(-0.5, -0.05, -1.7);
        luz.setColor(RGB_RED);
        this.agregarHijo(luz);

        var luz = new Luz(this);
        luz.setPosicion(0.5, -0.05, -1.7);
        luz.setColor(RGB_RED);
        this.agregarHijo(luz);

        var luz = new Luz(this);
        luz.setPosicion(-0.5, -0.05, -0.7);
        luz.setColor(RGB_RED);
        this.agregarHijo(luz);

        var luz = new Luz(this);
        luz.setPosicion(0.5, -0.05, -0.7);
        luz.setColor(RGB_RED);
        this.agregarHijo(luz);
    }

    setLights() {
        var posLight = this.getPosicionMundo([-0.5, -0.05, -1.7]);
        this.setPointLight(1, posLight);

        var posLight = this.getPosicionMundo([0.5, -0.05, -1.7]);
        this.setPointLight(2, posLight);

        var posLight = this.getPosicionMundo([-0.5, -0.05, -0.7]);  
        this.setPointLight(3, posLight);

        var posLight = this.getPosicionMundo([0.5, -0.05, -0.7]);
        this.setPointLight(4, posLight);
    }

    setPointLight(id, posicionSpot) {
        gl.uniform4fv(gl.getUniformLocation(glProgram, "uPosPoint" + id), vec4.fromValues(posicionSpot[0], posicionSpot[1], posicionSpot[2], 1));
    }
}
