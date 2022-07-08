import { WALL } from '../common/textures.js';
import { SupPiso } from '../superficies.js';
import { Objeto3D, generarSuperficie } from './objeto3d.js';

export class Pared extends Objeto3D {
    constructor(padre, alto = 15, ancho = 50) {
        super(padre);
        // objeto vacio para poder moverlo
        let hijo = new Objeto3D(this);
        hijo.initTextures(WALL);
        hijo.setGeometria(generarSuperficie(new SupPiso(ancho, alto), 5));
        hijo.setRotacion(Math.PI/2, 0, Math.PI/2);
        hijo.setPosicion(0, alto/2, 0);
        this.agregarHijo(hijo);
    }
}
