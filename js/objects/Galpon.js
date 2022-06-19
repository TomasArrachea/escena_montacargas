import { SupBarrido } from '../supBarrido.js';
import { generarCurvaGalpon } from '../curvas.js';
import { Objeto3D, generarSuperficie } from './objeto3d.js';

export class Galpon extends Objeto3D {
    constructor() {
        super();
        // TODO: revisar las filas y columnas
        var alto = 10;
        var ancho = 30;
        this.setGeometria(generarSuperficie(new SupBarrido(generarCurvaGalpon(alto, ancho), 30, 0), 15, 15));
        this.setRotacion(Math.PI / 2, Math.PI, 0);
    }
}
