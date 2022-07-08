import { FLOOR } from '../common/textures.js';
import { SupPiso } from '../superficies.js';
import { Objeto3D, generarSuperficie } from './objeto3d.js';

export class Piso extends Objeto3D {
    constructor(padre, texturePath = FLOOR, textureScale = 20, alto = 70, ancho = 70) {
        super(padre);
        this.initTextures(texturePath);
        this.setGeometria(generarSuperficie(new SupPiso(alto, ancho), textureScale));
    }
}
