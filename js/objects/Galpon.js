import { SupBarrido } from '../supBarrido.js';
import { generarCurvaGalpon } from '../curvas.js';
import { Objeto3D, generarSuperficie } from './objeto3d.js';

export class Galpon extends Objeto3D {
    constructor(padre) {
        super(padre);
        var filas = 5;
        var columnas = 20;
        var alto = 15;
        var ancho = 50;
        this.initTextures('/maps/CorrugatedMetalPanel02_1K_BaseColor.png');
        let superficie = new SupBarrido(generarCurvaGalpon(alto, ancho), 50, 0, false, filas, columnas)
        this.setGeometria(generarSuperficie(superficie, 20));
        this.setRotacion(Math.PI / 2, Math.PI, 0);
    }
}
