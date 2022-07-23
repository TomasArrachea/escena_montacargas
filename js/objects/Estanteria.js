import { vec3 } from 'https://cdn.skypack.dev/gl-matrix';
import { Objeto3D } from './objeto3d.js';
import { Cubo } from "./Cubo.js";
import { RGB_BROWN, RGB_GREY } from '../common/colors.js';

class Hueco {
    constructor(posicion) {
        this.posicion = posicion;
        this.objeto = null;
    }

    getPosicion() {
        return this.posicion;
    }

    estaLibre() {
        return this.objeto == null;
    }

    ocupar(objeto) {
        this.objeto = objeto;
    }

    vaciar() {
        var obj = this.objeto;
        this.objeto = null;
        return obj;
    }
}

export class Estanteria extends Objeto3D {
    constructor(padre) {
        super(padre);
        this.DISTANCIA_DEPOSITAR = 0.5;

        // objeto vacio
        this.xEstanteria = 2;
        this.yEstanteria = 0.2;
        this.zEstanteria = 16;
        var xCol = 0.2;
        this.yCol = 7.2;
        var zCol = 0.2;

        var estanteria = new Cubo(this, this.xEstanteria, this.yEstanteria, this.zEstanteria);
        estanteria.setPosicion(0, 2, 0);
        estanteria.setColor(RGB_GREY);
        this.agregarHijo(estanteria);

        var estanteria = new Cubo(this, this.xEstanteria, this.yEstanteria, this.zEstanteria);
        estanteria.setPosicion(0, 4.5, 0);
        estanteria.setColor(RGB_GREY);
        this.agregarHijo(estanteria);

        var estanteria = new Cubo(this, this.xEstanteria, this.yEstanteria, this.zEstanteria);
        estanteria.setPosicion(0, 7, 0);
        estanteria.setColor(RGB_GREY);
        this.agregarHijo(estanteria);

        var columna;
        this.zEstanteria = this.zEstanteria - 1;
        this.xEstanteria = this.xEstanteria - 0.5;
        for (var i = 0; i < 2; i++)
            for (var j = 0; j < 9; j++) {
                columna = new Cubo(this, xCol, this.yCol, zCol);
                columna.setPosicion(i * this.xEstanteria - this.xEstanteria / 2, this.yCol / 2, -this.zEstanteria / 2 + j * this.zEstanteria / 8);
                columna.setColor(RGB_BROWN);
                this.agregarHijo(columna);
            }

        var pos;
        this.huecos = [];
        for (var i = -4; i < 4; i++) {
            pos = [0, 2 + this.yEstanteria / 2, this.zEstanteria / 16 + i * this.zEstanteria / 8]; // posicion del cada casillero de la estanteria
            this.huecos.push(new Hueco(pos));
            this.huecos.push(new Hueco([pos[0], pos[1] + 2.5, pos[2]]));
        }
    }

    intentarAgregarObjeto(objeto, posObjeto) {
        // estanteria tiene 8x2 lugares. Elegir el que este mas cerca (cumpliendo con la minima distancia p depositar)
        var distMin = Number.MAX_SAFE_INTEGER;
        var huecoMasCercano, dist, posMundo;

        this.huecos.forEach(hueco => {
            if (hueco.estaLibre()) {
                posMundo = this.getPosicionMundo(hueco.getPosicion());
                dist = vec3.distance(posObjeto, posMundo);
                if (dist <= this.DISTANCIA_DEPOSITAR && dist < distMin) {
                    distMin = dist;
                    huecoMasCercano = hueco;
                }
            }
        });

        if (distMin == Number.MAX_SAFE_INTEGER)
            return false;

        this.agregarObjeto(objeto, huecoMasCercano);
        return true;
    }

    agregarObjeto(objeto, hueco) {
        this.agregarHijo(objeto);
        objeto.setEscala(0.4, 0.4, 0.4); // deshago la escala del carro
        objeto.setEscala(2, 2, 2); // deshago la escala de la estanteria
        var posicion = hueco.getPosicion();    
        objeto.setPosicion(posicion[0], posicion[1], posicion[2]);
        hueco.ocupar(objeto);
    }
}
