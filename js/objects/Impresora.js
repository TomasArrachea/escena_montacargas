import { mat4 } from 'https://cdn.skypack.dev/gl-matrix';
import { Rueda } from './Rueda';
import { Objeto3D } from './objeto3d';
import { Cabezal } from "./Cabezal";
import { Barra } from "./Barra";
import { ImpresionBarrido } from "./ImpresionBarrido";
import { ImpresionRevolucion } from "./ImpresionRevolucion";

export class Impresora extends Objeto3D {
    constructor() {
        super();
        this.VEL_SETUP = -0.05;
        this.VEL_IMPRESION = 0.01;

        var radio = 1;
        this.alturaBase = 1.2;
        var rueda = new Rueda(radio, this.alturaBase);
        rueda.setRotacion(-Math.PI / 2, Math.PI / 2, 0);
        this.agregarHijo(rueda);


        this.zBarra = radio * 4 / 5;
        var barra = new Barra();
        barra.setPosicion(0, this.alturaBase, this.zBarra);
        this.agregarHijo(barra);


        this.baseCabezal = this.alturaBase + barra.largo * 1 / 10; // a ojo para que llegue casi a tocar la base de la impresora
        this.topeCabezal = this.alturaBase + barra.largo * 4 / 5;
        this.velCabezal = 0;
        this.alturaCabezal = this.topeCabezal;
        this.cabezal = new Cabezal();
        this.cabezal.setPosicion(0, this.alturaCabezal, this.zBarra);
        this.agregarHijo(this.cabezal);

        this.setRotacion(0, Math.PI / 2, 0);
        this.impresion = null;
    }

    recojerImpresion() {
        this.impresion = null;
        return this.quitarHijo();
    }

    generarImpresion(tipoSuperficie, curva, torsion) {
        console.log('Imprimiendo...');
        if (this.velCabezal == this.VEL_IMPRESION) {
            console.log('Ya hay una impresión en curso.');
            return;
        }
        if (this.impresion != null) {
            console.log('Ya hay una impresion terminada.');
            return;
        }

        this.velCabezal = this.VEL_SETUP;
        if (tipoSuperficie == 'barrido') {
            this.impresion = new ImpresionBarrido(curva, 1.1, torsion);
            this.impresion.setPosicion(0, this.alturaBase + 0.55, 0); // le sumo la mitad del alto de la figura

        } else if (tipoSuperficie == 'revolucion') {
            this.impresion = new ImpresionRevolucion(curva);
            this.impresion.setPosicion(0, this.alturaBase, 0);
        }
    }

    actualizarMatrizModelado() {
        if (this.alturaCabezal + this.velCabezal <= this.topeCabezal)
            this.alturaCabezal += this.velCabezal;
        if (this.alturaCabezal < this.baseCabezal)
            this.alturaCabezal = this.baseCabezal;
        if (this.alturaCabezal == this.baseCabezal) { // solo se ejecuta una vez
            this.velCabezal = this.VEL_IMPRESION;
            this.agregarHijo(this.impresion);
        } else if (this.alturaCabezal >= this.topeCabezal - this.velCabezal)
            this.velCabezal = 0;

        this.cabezal.setPosicion(0, this.alturaCabezal, this.zBarra);

        mat4.identity(this.matrizModelado);
        mat4.translate(this.matrizModelado, this.matrizModelado, this.posicion);
        mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotacion[0], [1, 0, 0]);
        mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotacion[1], [0, 1, 0]);
        mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotacion[2], [0, 0, 1]);
        if (this.escala[0] != 0 && this.escala[1] != 0 && this.escala[2] != 0)
            mat4.scale(this.matrizModelado, this.matrizModelado, this.escala);
    }
}