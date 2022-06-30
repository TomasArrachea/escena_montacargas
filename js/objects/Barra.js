import { Cilindro } from '../superficies.js';
import { Objeto3D, generarSuperficie } from './objeto3d.js';


export class Barra extends Objeto3D {
    constructor(padre) {
        super(padre);
        this.largo = 3;
        this.setGeometria(generarSuperficie(new Cilindro(0.1, this.largo)));
    }
}
