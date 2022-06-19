import { vec3 } from 'https://cdn.skypack.dev/gl-matrix';
import { Objeto3D } from './objeto3d.js';
import { Cubo } from "./Cubo.js";

export class Estanteria extends Objeto3D {
    constructor() {
        super();
        this.DISTANCIA_DEPOSITAR = 1.5;

        // objeto vacio
        this.xEstanteria = 2;
        this.yEstanteria = 0.2;
        this.zEstanteria = 16;
        var xCol = 0.2;
        this.yCol = 7.2;
        var zCol = 0.2;

        var estanteria = new Cubo(this.xEstanteria, this.yEstanteria, this.zEstanteria);
        estanteria.setPosicion(0, 2, 0);
        this.agregarHijo(estanteria);

        var estanteria = new Cubo(this.xEstanteria, this.yEstanteria, this.zEstanteria);
        estanteria.setPosicion(0, 4.5, 0);
        this.agregarHijo(estanteria);

        var estanteria = new Cubo(this.xEstanteria, this.yEstanteria, this.zEstanteria);
        estanteria.setPosicion(0, 7, 0);
        this.agregarHijo(estanteria);

        var columna;
        this.zEstanteria = this.zEstanteria - 1;
        this.xEstanteria = this.xEstanteria - 0.5;
        for (var i = 0; i < 2; i++)
            for (var j = 0; j < 9; j++) {
                columna = new Cubo(xCol, this.yCol, zCol);
                columna.setPosicion(i * this.xEstanteria - this.xEstanteria / 2, this.yCol / 2, -this.zEstanteria / 2 + j * this.zEstanteria / 8);
                this.agregarHijo(columna);
            }
    }

    intentarAgregarObjeto(objeto, posObjeto) {
        // estanteria tiene 8x2 lugares. Elegir el que este mas cerca (cumpliendo con la minima distancia p depositar)
        var distMin = Number.MAX_SAFE_INTEGER;
        var posMin = [0, 0, 0];
        var dist;
        var pos;
        var posEstante = vec3.create();
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 8; j++) {
                pos = [0, 2 + i * 2.5 + 0.1, -this.zEstanteria / 2 + this.zEstanteria * 1 / 16 + j * this.zEstanteria / 7];
                vec3.add(posEstante, this.posicion, pos);
                dist = vec3.distance(posEstante, posObjeto);
                console.log('dist: ' + dist);

                if (dist <= this.DISTANCIA_DEPOSITAR && dist < distMin) {
                    distMin = dist;
                    posMin = pos;
                }
            }
        }

        if (distMin == Number.MAX_SAFE_INTEGER)
            return false;

        console.log('distMin: ' + distMin);

        this.agregarObjeto(objeto, posMin);
        return true;
    }

    agregarObjeto(objeto, posicion) {
        console.log('agregando objeto a ' + posicion);
        this.agregarHijo(objeto);
        objeto.setEscala(0.4, 0.4, 0.4); // deshago la escala del carro
        objeto.setEscala(2, 2, 2); // deshago la escala de la estanteria
        objeto.setPosicion(posicion[0], posicion[1], posicion[2]);
    }
}
