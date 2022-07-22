import { SupRevolucion } from '../supRevolucion.js';
import { generarA1, generarA2, generarA3, generarA4 } from '../curvas.js';
import { Objeto3D, generarSuperficie } from './objeto3d.js';


export class ImpresionRevolucion extends Objeto3D {
    constructor(padre, tipoCurva, textura, altura) {
        super(padre);
        this.initTextures('maps/' + textura);
        var escalaUv = 5;
        if (textura == 'patron1.png')
            escalaUv = 1;

        var curva;
        if (tipoCurva == 'A1') {
            curva = generarA1(altura);
            this.setEscala(0.5, 0.3, 0.5);
        }
        else if (tipoCurva == 'A2') {
            curva = generarA2(altura);
            this.setRotacion(0, 0, Math.PI);
            this.setEscala(1, 0.4, 1);
        }
        else if (tipoCurva == 'A3')
            curva = generarA3(altura);
        else if (tipoCurva == 'A4')
            curva = generarA4(altura);
        this.setGeometria(generarSuperficie(new SupRevolucion(curva), escalaUv));
        this.setShininess(0.1);
    }
}
