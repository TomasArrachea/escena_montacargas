import { SupPiso } from '../superficies.js';
import { Objeto3D, generarSuperficie } from './objeto3d.js';

export class Piso extends Objeto3D {
    constructor(padre) {
        super(padre);
        this.initTextures('/maps/StoneTilesFloor01_1K_BaseColor.png');
        this.setGeometria(generarSuperficie(new SupPiso(70, 70), 20));
    }
}
