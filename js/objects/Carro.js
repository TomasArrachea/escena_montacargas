import { mat4, vec3 } from 'https://cdn.skypack.dev/gl-matrix';
import { Chasis } from './Chasis';
import { Objeto3D } from './objeto3d';
import { Elevador } from "./Elevador";
import { Asiento } from "./Asiento";
import { Rueda } from "./Rueda";

export class Carro extends Objeto3D {
    constructor(estanteria, impresora) {
        super();
        this.DISTANCIA_RECOJER = 1.5;
        var ancho = 3.5;
        var alto = 2;
        var largo = 4;

        // objeto vacio
        var chasis = new Chasis(ancho, alto, largo);
        chasis.setRotacion(0, 0, Math.PI / 2);
        chasis.setPosicion(0, 0.5 + alto / 2, 0);
        this.agregarHijo(chasis);

        var rueda = new Rueda();
        rueda.setPosicion(ancho / 2, 1, ancho / 2);
        rueda.setRotacion(0, Math.PI, 0);
        this.agregarHijo(rueda);

        var rueda = new Rueda();
        rueda.setPosicion(-ancho / 2, 1, ancho / 2);
        this.agregarHijo(rueda);

        var rueda = new Rueda();
        rueda.setPosicion(ancho / 2, 1, -ancho / 2);
        rueda.setRotacion(0, Math.PI, 0);
        this.agregarHijo(rueda);

        var rueda = new Rueda();
        rueda.setPosicion(-ancho / 2, 1, -ancho / 2);
        this.agregarHijo(rueda);

        var asiento = new Asiento();
        asiento.setPosicion(0, alto / 2 + 1.5, -largo / 2 + 0.5);
        this.agregarHijo(asiento);

        var cabina = new Asiento();
        cabina.setPosicion(0, alto / 2 + 1.5, largo / 2 - 0.5);
        cabina.setRotacion(0, 0, Math.PI); // por alguna razon para rotar en el eje y hay que aplicar la rotacion en el eje z. Lo mismo en el asiento
        cabina.setEscala(1, 0.25, 1);
        this.agregarHijo(cabina);

        this.elevador = new Elevador();
        this.elevador.setPosicion(0, alto / 2 + 0.5, largo / 2 + alto * 0.3 + 0.05);
        this.elevador.setEscala(1, 1.6, 1);
        this.agregarHijo(this.elevador);

        this.velGiro = 0;
        this.velX = 0;
        this.carga = null;
        this.impresora = impresora;
        this.estanteria = estanteria;
        this.matrizRotacion = mat4.create();
    }

    setVelGiro(v) {
        this.velGiro = v;
    }

    setVelX(v) {
        this.velX = v;
    }

    setVelY(v) {
        this.elevador.setVelY(v);
    }

    toggleRecojer() {
        if (this.carga == null) {
            var posPalaEnCarro = this.getPosicionPala();
            // aplico la matriz de modelado a la posicion de la pala. Podria hacer getPosicionMundo sobre la posicion del elevador
            var posPala = vec3.create();
            vec3.transformMat4(posPala, [posPalaEnCarro[0], posPalaEnCarro[1], posPalaEnCarro[2], 1], this.matrizModelado);

            console.log('posPala=' + posPala);

            var posImpresion = this.impresora.getPosicion(); // cambiar por la posicion de la impresion
            if (vec3.distance(posPala, posImpresion) <= this.DISTANCIA_RECOJER) {
                console.log('Carga recogida.');
                this.carga = this.impresora.recojerImpresion();
                this.carga.setPosicion(posPala[0], posPala[1], posPala[2]);
                this.carga.setEscala(1 / 0.4, 1 / 0.4, 1 / 0.4); // al auto se le aplica una escala en la escena. La deshago para la impresion
                this.agregarHijo(this.carga);
            }
        } else {
            if (this.estanteria.intentarAgregarObjeto(this.carga, this.carga.getPosicionMundo(this.matrizModelado))) {
                this.carga = null;
                this.quitarHijo();
            }
        }
    }


    getPosicionPala() {
        // devuelve la posicion de la pala con respecto al centro del carro.
        // es la pos de la pala relativa al elevador, mas la pos del elevador relativa al carro, aplicando la escala del elevador.
        var posPala = vec3.create();
        vec3.add(posPala, this.elevador.getPosicion(), this.elevador.pala.getPosicion());
        // var posPala = this.elevador.pala.getPosicionMundo(this.elevador.matrizModelado);
        vec3.mul(posPala, posPala, this.elevador.escala);
        return posPala;
    }

    actualizarMatrizModelado() {
        // Actualizar posicion de la carga segun la posicion de la pala
        if (this.carga) {
            var posPala = this.getPosicionPala();
            this.carga.setPosicion(posPala[0], posPala[1], posPala[2]);
        }
        // Actualiza la posicion segun el giro del carro
        this.rotacion[1] += this.velGiro;
        var avance = vec3.fromValues(0, 0, this.velX);

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
