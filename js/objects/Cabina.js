import { SupBarrido } from '../supBarrido.js';
import { generarTrapecio } from '../curvas.js';
import { Objeto3D, generarSuperficie } from './objeto3d.js';

export class Cabina extends Objeto3D {
    constructor() {
        super();
        this.setGeometria(generarSuperficie(new SupBarrido(generarTrapecio(), 20, 0)));
    }
}
