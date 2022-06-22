import { SupPiso } from '../superficies.js';
import { Objeto3D, generarSuperficie } from './objeto3d.js';

export class Piso extends Objeto3D {
    constructor() {
        super();
        this.setGeometria(generarSuperficie(new SupPiso(70, 70), 15, 15));
    }
}
