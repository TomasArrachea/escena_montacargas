import { RGB_GREEN } from '../common/colors.js';
import { Cubo } from './Cubo.js';
import { Objeto3D } from './objeto3d.js';


export class Cabezal extends Objeto3D {
    constructor(padre) {
        super(padre);
        // objeto vacio
        this.setColor(RGB_GREEN);

        var agarreBarra = new Cubo(this, 0.4, 0.2, 0.3);
        agarreBarra.setPosicion(0, 0, 0);
        this.agregarHijo(agarreBarra);

        var tirante = new Cubo(this, 0.1, 0.15, 1);
        tirante.setPosicion(0.1, 0, -0.5);
        this.agregarHijo(tirante);

        var tirante = new Cubo(this, 0.1, 0.15, 1);
        tirante.setPosicion(-0.1, 0, -0.7);
        this.agregarHijo(tirante);

        var agarrePanel = new Cubo(this, 0.6, 0.2, 0.3);
        agarrePanel.setPosicion(0, 0, -1.2);
        this.agregarHijo(agarrePanel);

        var panel = new Cubo(this, 1, 0.05, 1);
        panel.setPosicion(0, -0.05, -1.2);
        this.agregarHijo(panel);
    }
}
