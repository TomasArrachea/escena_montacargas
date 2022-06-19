import { SupPiso } from '../superficies.js';
import { Objeto3D, generarSuperficie } from './objeto3d.js';

export class Piso extends Objeto3D {
    constructor() {
        super();
        this.setGeometria(generarSuperficie(new SupPiso(50, 50), 15, 15));
    }
}
