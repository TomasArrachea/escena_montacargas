import { FLOOR } from '../common/textures.js';
import { SupPiso } from '../superficies.js';
import { Objeto3D, generarSuperficie } from './objeto3d.js';

export class Piso extends Objeto3D {
    constructor(padre) {
        super(padre);
        this.initTextures(FLOOR);
        this.setGeometria(generarSuperficie(new SupPiso(70, 70), 20));
    }
}
