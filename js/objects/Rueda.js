import { SupRevolucion } from '../supRevolucion.js';
import { generarCurvaRueda } from '../curvas.js';
import { Objeto3D, generarSuperficie } from './objeto3d.js';


export class Rueda extends Objeto3D {
    constructor(padre, radio = 1, ancho = 0.4) {
        super(padre);
        this.setGeometria(generarSuperficie(new SupRevolucion(generarCurvaRueda(radio, ancho))));
        this.setRotacion(0, 0, Math.PI / 2);
    }
}
