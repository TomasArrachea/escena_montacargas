import { mat4 } from 'https://cdn.skypack.dev/gl-matrix';
import { Objeto3D } from './objeto3d';
import { Cubo } from "./Cubo";


export class Elevador extends Objeto3D {
    constructor() {
        super();
        // objeto vacio
        var anchoCol = 0.3;
        var largoCol = 4.7;
        var altoCol = 0.1;

        var anchoTransversal = 2.5;
        var largoTransversal = 0.2;
        var altoTransversal = 0.08;

        this.anchoPala = 2;
        var largoPala = 0.05;
        var altoPala = 2;

        var columna = new Cubo(anchoCol, largoCol, altoCol);
        columna.setPosicion(-(anchoTransversal - 0.4) / 2, largoCol / 2 - 0.5, 0);
        this.agregarHijo(columna); // col 1

        var columna = new Cubo(anchoCol, largoCol, altoCol);
        columna.setPosicion((anchoTransversal - 0.5) / 2, largoCol / 2 - 0.5, 0);
        this.agregarHijo(columna); // col 2

        var tirante = new Cubo(anchoTransversal, largoTransversal, altoTransversal);
        tirante.setPosicion(0, 0, 0);
        this.agregarHijo(tirante); // transversal 1

        var tirante = new Cubo(anchoTransversal, largoTransversal, altoTransversal);
        tirante.setPosicion(0, 2, 0);
        this.agregarHijo(tirante); // transversal 2

        var tirante = new Cubo(anchoTransversal, largoTransversal, altoTransversal);
        tirante.setPosicion(0, 4, 0);
        this.agregarHijo(tirante); // transversal 3

        this.basePala = 0;
        this.topePala = 4;
        this.velPala = 0;
        this.alturaPala = this.basePala;
        this.pala = new Cubo(this.anchoPala, largoPala, altoPala);
        this.pala.setPosicion(0, this.alturaPala, this.anchoPala / 2);
        this.agregarHijo(this.pala);
    }

    setVelY(v) {
        this.velPala = v;
    }

    actualizarMatrizModelado() {
        if (this.alturaPala + this.velPala < this.topePala && this.alturaPala + this.velPala >= this.basePala)
            this.alturaPala += this.velPala;
        this.pala.setPosicion(0, this.alturaPala, this.anchoPala / 2);

        mat4.identity(this.matrizModelado);
        mat4.translate(this.matrizModelado, this.matrizModelado, this.posicion);
        mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotacion[1], [0, 1, 0]);
        if (this.escala[0] != 0 && this.escala[1] != 0 && this.escala[2] != 0)
            mat4.scale(this.matrizModelado, this.matrizModelado, this.escala);
    }
}