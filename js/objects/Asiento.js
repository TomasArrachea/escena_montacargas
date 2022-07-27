import { SupBarrido } from '../supBarrido.js';
import { generarTrapecio } from '../curvas.js';
import { Objeto3D, generarSuperficie } from './objeto3d.js';
import { RGB_DARK_GREY } from '../common/colors.js';


export class Asiento extends Objeto3D {
    constructor(padre) {
        super(padre);
        this.baseGrande = 1;
        this.baseChica = 0.5;
        this.largo = 2;
        var sup = generarTrapecio(this.baseChica, this.baseGrande, this.largo);
        this.setGeometria(generarSuperficie(new SupBarrido(sup, 2)));
        this.setRotacion(-Math.PI / 2, 0, -Math.PI / 2);
        this.setColor(RGB_DARK_GREY);
        this.setShininess(100);
    }
}
