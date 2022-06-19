import { SupRevolucion } from '../supRevolucion.js';
import { generarA1, generarA2 } from '../curvas.js';
import { Objeto3D, generarSuperficie } from './objeto3d.js';


export class ImpresionRevolucion extends Objeto3D {
    constructor(tipoCurva) {
        super();
        var curva;
        if (tipoCurva == 'A1') {
            curva = generarA1();
            this.setRotacion(0, 0, Math.PI);
            this.setEscala(0.5, 0.3, 0.5);
        }
        else if (tipoCurva == 'A2') {
            curva = generarA2();
            this.setRotacion(0, 0, Math.PI);
            this.setEscala(1, 0.4, 1);
        }
        else if (tipoCurva == 'A3')
            curva = generarA3();
        else if (tipoCurva == 'A4')
            curva = generarA4();
        this.setGeometria(generarSuperficie(new SupRevolucion(curva)));
    }
}
