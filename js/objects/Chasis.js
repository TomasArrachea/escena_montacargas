import { SupBarrido } from '../supBarrido.js';
import { generarCurvaChasis } from '../curvas.js';
import { Objeto3D, generarSuperficie } from './objeto3d.js';

export class Chasis extends Objeto3D {
    constructor(padre, ancho, alto, largo) {
        super(padre);
        this.initTextures('/maps/texturaGrua.jpg');
        this.ancho = 3.5;
        this.alto = 3;
        this.setGeometria(generarSuperficie(new SupBarrido(generarCurvaChasis(alto, largo), ancho, 0, true)));
    }
}
