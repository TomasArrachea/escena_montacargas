import { SupBarrido } from '../supBarrido.js';
import { generarB1, generarB2, generarB3, generarB4 } from '../curvas.js';
import { Objeto3D, generarSuperficie } from './objeto3d.js';


export class ImpresionBarrido extends Objeto3D {
    constructor(padre, tipoCurva, textura, altura, torsion) {
        super(padre);
        this.initTextures('maps/' + textura);
        var escalaUv = 5;
        var curva;
        var columnas = 25;

        if (textura == 'patron1.png')
            escalaUv = 1;
        if (tipoCurva == 'B1') {
            curva = generarB1();
            columnas = 20;
        } else if (tipoCurva == 'B2') {
            curva = generarB2();
            columnas = 60;
        } else if (tipoCurva == 'B3') {
            curva = generarB3();
            columnas = 100;
        } else if (tipoCurva == 'B4')
            curva = generarB4();
        this.setGeometria(generarSuperficie(new SupBarrido(curva, altura, torsion, true, 25, columnas), escalaUv));
        this.setShininess(100);
    }
}
