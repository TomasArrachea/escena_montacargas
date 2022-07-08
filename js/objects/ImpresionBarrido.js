import { SupBarrido } from '../supBarrido.js';
import { generarB1, generarB2, generarB3, generarB4 } from '../curvas.js';
import { Objeto3D, generarSuperficie } from './objeto3d.js';


export class ImpresionBarrido extends Objeto3D {
    constructor(padre, tipoCurva, textura, altura, torsion) {
        super(padre);
        this.initTextures('../../maps/' + textura);
        var curva;
        if (tipoCurva == 'B1')
            curva = generarB1();
        else if (tipoCurva == 'B2')
            curva = generarB2();
        else if (tipoCurva == 'B3')
            curva = generarB3();
        else if (tipoCurva == 'B4')
            curva = generarB4();
        this.setGeometria(generarSuperficie(new SupBarrido(curva, altura, torsion, true)));
    }
}
