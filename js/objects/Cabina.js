import { SupBarrido } from '../supBarrido.js';
import { generarTrapecio } from '../curvas.js';
import { Objeto3D, generarSuperficie } from './objeto3d.js';
import { RGB_GREY } from '../common/colors.js';

export class Cabina extends Objeto3D {
    constructor(padre) {
        super(padre);
        this.setGeometria(generarSuperficie(new SupBarrido(generarTrapecio(), 20)));
        this.setColor(RGB_GREY)
        this.setShininess(100);
    }
}
