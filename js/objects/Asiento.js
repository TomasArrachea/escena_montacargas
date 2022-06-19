import { SupBarrido } from '../supBarrido.js';
import { generarTrapecio } from '../curvas.js';
import { Objeto3D, generarSuperficie } from './objeto3d';


export class Asiento extends Objeto3D {
    constructor() {
        super();
        this.baseGrande = 1;
        this.baseChica = 0.5;
        this.largo = 2;
        var sup = generarTrapecio(this.baseChica, this.baseGrande, this.largo);
        this.setGeometria(generarSuperficie(new SupBarrido(sup, 2, 0)));
        this.setRotacion(-Math.PI / 2, 0, -Math.PI / 2);
    }
}