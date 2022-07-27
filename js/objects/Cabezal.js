import { RGB_GREEN, RGB_RED } from '../common/colors.js';
import { Cubo } from './Cubo.js';
import { Luz } from './Luz.js';
import { Objeto3D } from './objeto3d.js';
import { vec4 } from 'https://cdn.skypack.dev/gl-matrix';


export class Cabezal extends Objeto3D {
    constructor(padre) {
        super(padre);
        // objeto vacio
        this.setShininess(0);
        
        var agarreBarra = new Cubo(this, 0.4, 0.2, 0.3);
        agarreBarra.setPosicion(0, 0, 0);
        agarreBarra.setColor(RGB_GREEN);
        this.agregarHijo(agarreBarra);

        var tirante = new Cubo(this, 0.1, 0.15, 0.7);
        tirante.setPosicion(0.1, 0, -0.4);
        tirante.setColor(RGB_GREEN);
        this.agregarHijo(tirante);

        var tirante = new Cubo(this, 0.1, 0.15, 0.7);
        tirante.setPosicion(-0.1, 0, -0.4);
        tirante.setColor(RGB_GREEN);
        this.agregarHijo(tirante);

        var agarrePanel = new Cubo(this, 0.6, 0.2, 0.3);
        agarrePanel.setPosicion(0, 0, -0.9);
        agarrePanel.setColor(RGB_GREEN);
        this.agregarHijo(agarrePanel);

        this.panel = new Cubo(this, 1.1, 0.05, 1.1);
        this.panel.setPosicion(0, -0.05, -0.9);
        this.panel.setColor(RGB_GREEN);
        this.agregarHijo(this.panel);

        var luz = new Luz(this);
        luz.setPosicion(-0.55, -0.05, -1.45);
        luz.setColor(RGB_RED);
        this.agregarHijo(luz);

        var luz = new Luz(this);
        luz.setPosicion(0.55, -0.05, -1.45);
        luz.setColor(RGB_RED);
        this.agregarHijo(luz);

        var luz = new Luz(this);
        luz.setPosicion(-0.55, -0.05, -0.35);
        luz.setColor(RGB_RED);
        this.agregarHijo(luz);

        var luz = new Luz(this);
        luz.setPosicion(0.55, -0.05, -0.35);
        luz.setColor(RGB_RED);
        this.agregarHijo(luz);
    }

    setLights() {
        var posLight = this.getPosicionMundo([-0.55, -0.05, -1.45]);
        this.setPointLight(1, posLight);

        var posLight = this.getPosicionMundo([0.55, -0.05, -1.45]);
        this.setPointLight(2, posLight);

        var posLight = this.getPosicionMundo([-0.55, -0.05, -0.35]);  
        this.setPointLight(3, posLight);

        var posLight = this.getPosicionMundo([0.55, -0.05, -0.35]);
        this.setPointLight(4, posLight);
    }

    setPointLight(id, posicionSpot) {
        gl.uniform3fv(gl.getUniformLocation(glProgram, "uPosPoint" + id), posicionSpot);
    }
}
