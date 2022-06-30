import { SupCubo } from '../superficies.js';
import { Objeto3D } from './objeto3d.js';


export class Cubo extends Objeto3D {
    constructor(padre, x, y, z) {
        super(padre);
        this.strip = false;
        this.setGeometria(SupCubo.generarSuperficie(x, y, z));
    }
}
