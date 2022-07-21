import { Cilindro } from '../superficies.js';
import { Objeto3D, generarSuperficie } from './objeto3d.js';


export class Barra extends Objeto3D {
    constructor(padre, largo = 3, radio = 0.1) {
        super(padre);
        this.largo = largo;
        this.setGeometria(generarSuperficie(new Cilindro(radio, this.largo)));
        this.setShininess(1);
    }
}
