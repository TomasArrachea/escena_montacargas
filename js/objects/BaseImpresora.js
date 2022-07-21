import { SupRevolucion } from '../supRevolucion.js';
import { generarCurvaRueda } from '../curvas.js';
import { Objeto3D, generarSuperficie } from './objeto3d.js';
import { SupCubo } from '../superficies.js';
// import { PRINTER_FACES } from '../common/textures.js';

export class BaseImpresora extends Objeto3D {
    constructor(padre, radio, ancho) {
        super(padre);
        this.setGeometria(generarSuperficie(new SupRevolucion(generarCurvaRueda(radio, ancho))));
        // this.setGeometria(SupCubo.generarSuperficie(radio, radio, ancho));
        this.setRotacion(0, 0, Math.PI / 2);
        this.setShininess(1);
        this.initTextures();
    }

    initTextures() {
        const PRINTER_FACES = [
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
                path: 'maps/greyRoom1_front.jpg',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                path: 'maps/greyRoom1_back.jpg',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
                path: 'maps/greyRoom1_top.jpg',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                path: 'maps/greyRoom1_bottom.jpg',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
                path: 'maps/greyRoom1_left.jpg',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
                path: 'maps/greyRoom1_right.jpg',
            },
        ];

        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

        PRINTER_FACES.forEach((faceInfo) => {
            const { target, path } = faceInfo;

            // Upload the canvas to the cubemap face.
            const level = 0;
            const internalFormat = gl.RGBA;
            const width = 512;
            const height = 512;
            const format = gl.RGBA;
            const type = gl.UNSIGNED_BYTE;

            // setup each face so it's immediately renderable
            gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

            // Asynchronously load an image
            const image = new Image();
            image.onload = function () {
                // Now that the image has loaded upload it to the texture.
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                gl.texImage2D(target, level, internalFormat, format, type, image);
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            };
            image.src = path;
        });
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        this.texture = texture;
    }

    generarColor() {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
        gl.uniform1f(gl.getUniformLocation(glProgram, 'uShininess'), this.shininess);
        gl.uniform1f(gl.getUniformLocation(glProgram, 'hasTexture'), true);
        gl.uniform1f(gl.getUniformLocation(glProgram, 'isCubeMap'), true);
        gl.uniform1i(gl.getUniformLocation(glProgram, 'uCubeSampler'), 1);
    }

    dibujar(matrizPadre) {
        var modelado = this.setMatricesShader(matrizPadre);

        this.setLights();
        if (this.vertexBuffer && this.indexBuffer) {
            this.generarColor(); // bind texture
            this.initShaders();
            if (this.strip) {
                gl.drawElements(gl.TRIANGLE_STRIP, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            } else {
                gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
        }

        for (var i = 0; i < this.hijos.length; i++) {
            this.hijos[i].dibujar(modelado);
        }
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null); // unbind texture
    }
}