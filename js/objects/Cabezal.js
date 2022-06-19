import { Cubo } from './Cubo';
import { Objeto3D } from './objeto3d';


export class Cabezal extends Objeto3D {
    constructor() {
        super();
        // objeto vacio
        var agarreBarra = new Cubo(0.4, 0.2, 0.3);
        agarreBarra.setPosicion(0, 0, 0);
        this.agregarHijo(agarreBarra);

        var tirante = new Cubo(0.1, 0.15, 1);
        tirante.setPosicion(0.1, 0, -0.5);
        this.agregarHijo(tirante);

        var tirante = new Cubo(0.1, 0.15, 1);
        tirante.setPosicion(-0.1, 0, -0.7);
        this.agregarHijo(tirante);

        var agarrePanel = new Cubo(0.6, 0.2, 0.3);
        agarrePanel.setPosicion(0, 0, -1.2);
        this.agregarHijo(agarrePanel);

        var panel = new Cubo(1, 0.05, 1);
        panel.setPosicion(0, -0.05, -1.2);
        this.agregarHijo(panel);
    }
}
