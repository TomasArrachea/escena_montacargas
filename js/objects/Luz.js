import { Objeto3D, generarSuperficie } from './objeto3d.js';
import { SupEsfera } from '../superficies.js';


export class Luz extends Objeto3D {
    constructor(padre, radio = 0.05) {
        super(padre);
        this.setGeometria(generarSuperficie(new SupEsfera(radio)));
    }
}
