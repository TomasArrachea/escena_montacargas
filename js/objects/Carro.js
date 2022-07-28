import { mat4, vec3, vec4 } from 'https://cdn.skypack.dev/gl-matrix';
import { Chasis } from './Chasis.js';
import { Objeto3D } from './objeto3d.js';
import { Elevador } from "./Elevador.js";
import { Asiento } from "./Asiento.js";
import { Rueda } from "./Rueda.js";
import { RGB_DARK_GREY, RGB_GREY } from '../common/colors.js';

let FACTOR_INERCIA=0.3;

export class Carro extends Objeto3D {
    constructor(padre, estanteria, impresora) {
        super(padre);
        this.DISTANCIA_RECOJER = 0.5;
        var ancho = 3.5;
        var alto = 2;
        var largo = 4;

        // objeto vacio
        var chasis = new Chasis(this, ancho, alto, largo);
        chasis.setRotacion(0, 0, Math.PI / 2);
        chasis.setPosicion(0, 0.5 + alto / 2, 0);
        this.agregarHijo(chasis);

        this.ruedas = [];
        var rueda = new Rueda(this);
        rueda.setPosicion(ancho / 2, 1, ancho / 2);
        rueda.setRotacion(0, Math.PI, 0);
        this.ruedas.push(rueda);
        this.agregarHijo(rueda);

        var rueda = new Rueda(this);
        rueda.setPosicion(-ancho / 2, 1, ancho / 2);
        this.ruedas.push(rueda);
        this.agregarHijo(rueda);

        var rueda = new Rueda(this);
        rueda.setPosicion(ancho / 2, 1, -ancho / 2);
        rueda.setRotacion(0, Math.PI, 0);
        this.ruedas.push(rueda);
        this.agregarHijo(rueda);

        var rueda = new Rueda(this);
        rueda.setPosicion(-ancho / 2, 1, -ancho / 2);
        this.ruedas.push(rueda);
        this.agregarHijo(rueda);

        var asiento = new Asiento(this);
        asiento.setPosicion(0, alto / 2 + 1.5, -largo / 2 + 0.5);
        asiento.setColor(RGB_DARK_GREY);
        this.agregarHijo(asiento);

        var cabina = new Asiento(this);
        cabina.setPosicion(0, alto / 2 + 1.5, largo / 2 - 0.5);
        cabina.setRotacion(0, 0, Math.PI); // por alguna razon para rotar en el eje y hay que aplicar la rotacion en el eje z. Lo mismo en el asiento
        cabina.setEscala(1, 0.25, 1);
        cabina.setColor(RGB_DARK_GREY);
        this.agregarHijo(cabina);

        this.elevador = new Elevador(this);
        this.elevador.setPosicion(0, alto / 2 + 0.5, largo / 2 + alto * 0.3 + 0.05);
        this.elevador.setEscala(1, 1.6, 1);
        this.agregarHijo(this.elevador);

        this.velGiro = 0;
        this.velX = 0;
        this.velXInercial = 0;
        this.carga = null;
        this.impresora = impresora;
        this.estanteria = estanteria;
        this.matrizRotacion = mat4.create();
    }

    setVelGiro(v) {
        this.velGiro = v;
        // ruedas de izquierda giran hacia un lado
        v *= 2.7;
        this.ruedas[0].setVelGiro(-v);
        this.ruedas[2].setVelGiro(-v);

        // ruedas de derecha giran hacia el otro
        this.ruedas[1].setVelGiro(v);
        this.ruedas[3].setVelGiro(v);
    }

    setVelX(v) {
        this.velX = v;
        this.ruedas.forEach(r => r.setVelAvance(v));
    }

    setVelY(v) {
        this.elevador.setVelY(v);
    }

    toggleRecojer() {
        let posPala = this.elevador.pala.getPosicionMundo();

        if (this.carga == null) {
            let posImpresion = this.impresora.getPosicionMundo([0, this.impresora.alturaBase, 0]);
            if (vec3.distance(posPala, posImpresion) <= this.DISTANCIA_RECOJER) {
                this.carga = this.impresora.recojerImpresion();
                const p = this.getPosicionPala();
                this.carga.setPosicion(p[0], p[1], p[2]);
                this.carga.setEscala(1 / this.escala[0], 1 / this.escala[1], 1 / this.escala[2]); // deshago la escala para que no se achique la impresion en el carro
                this.carga.actualizarMatrizModelado()
                this.agregarHijo(this.carga);
            }
        } else {
            if (this.estanteria.intentarAgregarObjeto(this.carga, posPala)) {
                this.carga = null;
                this.quitarHijo();
            }
        }
    }

    getPosicionPala() {
        // devuelve la posicion de la pala con respecto al carro
        var modeladoPala = mat4.create();
        mat4.mul(modeladoPala, this.elevador.matrizModelado, this.elevador.pala.matrizModelado);
        var posPala = vec3.create();
        vec4.transformMat4(posPala, [0, 0, 0, 1], modeladoPala);
        posPala[1] += this.elevador.altoPala/2;
        return posPala;
    }

    actualizarMatrizModelado() {
        // Actualizar posicion de la carga segun la posicion de la pala
        if (this.carga) {
            const p = this.getPosicionPala();
            this.carga.setPosicion(p[0], p[1], p[2]);
        }
        // Actualiza la posicion segun el giro del carro
        this.velXInercial = this.velXInercial + (this.velX - this.velXInercial) * FACTOR_INERCIA;

        this.rotacion[1] += this.velGiro;
        var avance = vec3.fromValues(0, 0, this.velXInercial);

        mat4.rotate(this.matrizRotacion, this.matrizRotacion, this.velGiro, vec3.fromValues(0, 1, 0));
        vec3.transformMat4(avance, avance, this.matrizRotacion);

        vec3.add(this.posicion, this.posicion, avance);

        mat4.identity(this.matrizModelado);
        mat4.translate(this.matrizModelado, this.matrizModelado, this.posicion);
        mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotacion[1], [0, 1, 0]);
        if (this.escala[0] != 0 && this.escala[1] != 0 && this.escala[2] != 0)
            mat4.scale(this.matrizModelado, this.matrizModelado, this.escala);
    }
}
