import { SupBarrido } from '../supBarrido.js';
import { generarCurvaGalpon } from '../curvas.js';
import { Objeto3D, generarSuperficie } from './objeto3d.js';

export class Galpon extends Objeto3D {
    constructor(padre) {
        super(padre);
        var filas = 15;
        var columnas = 15;
        var alto = 15;
        var ancho = 50;
        this.setGeometria(generarSuperficie(new SupBarrido(generarCurvaGalpon(alto, ancho), 50, 0, true), filas, columnas));
        this.setRotacion(Math.PI / 2, Math.PI, 0);
    }
}
