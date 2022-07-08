import { vec3 } from 'https://cdn.skypack.dev/gl-matrix';
import { Galpon } from './Galpon.js';
import { Piso } from './Piso.js';
import { Carro } from './Carro.js';
import { Estanteria } from './Estanteria.js';
import { Impresora } from './Impresora.js';
import { Objeto3D } from './objeto3d.js';

export class Escena extends Objeto3D {
    constructor() {
        super(null);
        // objeto vacio
        var estanteria = new Estanteria(this);
        estanteria.setPosicion(-7, 0, 0);
        estanteria.setEscala(0.5, 0.5, 0.5);
        this.agregarHijo(estanteria);

        var impresora = new Impresora(this);
        impresora.setPosicion(7, 0, 0);
        this.agregarHijo(impresora);

        var carro = new Carro(this, estanteria, impresora);
        carro.setPosicion(0, 0, 0);
        carro.setEscala(0.4, 0.4, 0.4);
        this.agregarHijo(carro);

        var piso = new Piso(this);
        piso.setPosicion(0, 0, 0);
        piso.setEscala(4, 0, 4);
        this.agregarHijo(piso);

        var galpon = new Galpon(this);
        this.agregarHijo(galpon);
    }

    getCarro() {
        var carro = this.hijos[2];
        if (carro instanceof Carro)
            return carro;
        return null;
    }

    getPosImpresora() {
        var impresora = this.hijos[1];
        if (impresora instanceof Impresora)
            return impresora.getPosicion();
        return vec3.create();
    }

    getPosEstanteria() {
        var estanteria = this.hijos[0];
        if (estanteria instanceof Estanteria)
            return estanteria.getPosicion();
        return vec3.create();
    }

    generarImpresion(tipoSuperficie, curva, textura, torsion) {
        var impresora = this.hijos[1];
        if (impresora instanceof Impresora)
            impresora.generarImpresion(tipoSuperficie, curva, textura, torsion);
    }
}
