import { mat4, vec3, vec4, vec2 } from 'https://cdn.skypack.dev/gl-matrix';

function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}

export class Objeto3D {
    constructor(padre) {
        this.padre = padre;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.normalBuffer = null;
        this.matrizModelado = mat4.create();
        this.posicion = vec3.create();
        this.rotacion = vec3.create();
        this.escala = vec3.fromValues(1, 1, 1);
        this.hijos = [];
        this.strip = true;

        this.uvBuffer = null;
        this.color = null;
        this.image = null;
        this.texture = null;
        this.shininess = 0;
    }

    setShininess(shininess) {
        this.shininess = shininess;
        this.hijos.forEach(function (hijo) {
            hijo.setShininess(shininess);
        });
    }

    generarColor() {
        gl.uniform1f(gl.getUniformLocation(glProgram, 'isCubeMap'), false);
        if (this.texture != null) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(gl.getUniformLocation(glProgram, 'uSampler'), 0);
            gl.uniform1f(gl.getUniformLocation(glProgram, 'uShininess'), this.shininess);
            gl.uniform1i(gl.getUniformLocation(glProgram, 'hasTexture'), true);

        } else if(this.color != null) {
            let colorVecUniform = gl.getUniformLocation(glProgram, "uColor");
            gl.uniform3fv(colorVecUniform, this.color);
            gl.uniform1i(gl.getUniformLocation(glProgram, 'hasTexture'), false);
        }
    }

    setColor(color) {
        this.color = color;
        this.hijos.forEach(function (hijo) {
            hijo.setColor(color);
        })
    }

    initTextures(path) {
        const texture = gl.createTexture();
        const image = new Image();
        image.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
            gl.bindTexture(gl.TEXTURE_2D, null);

        }
        image.src = path;
        this.image = image;
        this.texture = texture;
    }

    actualizarMatrizModelado() {
        //Reset matriz de modelado.
        mat4.identity(this.matrizModelado);
        //Escalar, rotar, trasladar en ese orden.
        mat4.translate(this.matrizModelado, this.matrizModelado, this.posicion);
        if (this.escala[0] != 0 && this.escala[1] != 0 && this.escala[2] != 0) {
            mat4.scale(this.matrizModelado, this.matrizModelado, this.escala);
        }
        if (this.rotacion[0] != 0)
            mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotacion[0], [1, 0, 0]);
        if (this.rotacion[1] != 0)
            mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotacion[1], [0, 1, 0]);
        if (this.rotacion[2] != 0)
            mat4.rotate(this.matrizModelado, this.matrizModelado, this.rotacion[2], [0, 0, 1]);
    }

    setMatricesShader(matrizPadre) {
        // Actualiza la matriz de normales del vertex shader usando la matriz de modelado y la matriz de la camara

        // matriz modelado
        var modelado = mat4.create();
        this.actualizarMatrizModelado();
        mat4.multiply(modelado, matrizPadre, this.matrizModelado);
        var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix")
        gl.uniformMatrix4fv(modelMatrixUniform, false, modelado);

        // matriz normal
        var normal = mat4.create();
        mat4.invert(normal, modelado);
        mat4.transpose(normal, normal);
        var normalMatrixUniform = gl.getUniformLocation(glProgram, "normalMatrix");
        gl.uniformMatrix4fv(normalMatrixUniform, false, normal);

        return modelado;
    }

    initShaders() {
        let vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        let vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
        gl.enableVertexAttribArray(vertexNormalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

        let vertexUVAttribute = gl.getAttribLocation(glProgram, "aTextureCoord");
        gl.enableVertexAttribArray(vertexUVAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.vertexAttribPointer(vertexUVAttribute, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    }

    setLights() {
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
        gl.bindTexture(gl.TEXTURE_2D, null); // unbind texture
    }

    setGeometria(buffers) {
        // generar buffers de webgl
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buffers.positionBuffer), gl.STATIC_DRAW);
        this.vertexBuffer.itemSize = 3;
        this.vertexBuffer.numItems = buffers.positionBuffer.length / 3;

        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buffers.normalBuffer), gl.STATIC_DRAW);
        this.normalBuffer.itemSize = 3;
        this.normalBuffer.numItems = buffers.normalBuffer.length / 3;

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(buffers.indexBuffer), gl.STATIC_DRAW);
        this.indexBuffer.itemSize = 1;
        this.indexBuffer.numItems = buffers.indexBuffer.length;

        this.uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buffers.uvBuffer), gl.STATIC_DRAW);
        this.uvBuffer.itemSize = 2;
        this.uvBuffer.numItems = buffers.uvBuffer.length / 2;
    }

    agregarHijo(h) {
        this.hijos.push(h);
    }

    quitarHijo() {
        return this.hijos.pop();
    }

    setPosicion(x, y, z) {
        this.posicion[0] = x;
        this.posicion[1] = y;
        this.posicion[2] = z;
    }

    setRotacion(x, y, z) {
        this.rotacion[0] += x;
        this.rotacion[1] += y;
        this.rotacion[2] += z;
    }

    setEscala(x, y, z) {
        this.escala[0] *= x;
        this.escala[1] *= y;
        this.escala[2] *= z;
    }

    getPosicion() {
        return this.posicion;
    }

    getPosicionMundo(pos = [0, 0, 0]) {
        let posEnPadre = vec4.create();
        vec4.transformMat4(posEnPadre, [pos[0], pos[1], pos[2], 1], this.matrizModelado);
        if (this.padre == null) {
            return [posEnPadre[0], posEnPadre[1], posEnPadre[2]];
        }
        return this.padre.getPosicionMundo(posEnPadre);
    }

}



export function generarSuperficie(superficie, escalaUv = 1) {
    let columnas = superficie.columnas;
    let filas = superficie.filas;
    var positionBuffer = [];
    var indexBuffer = [];
    var normalBuffer = [];
    var uvBuffer = [];

    for (var i = 0; i <= filas; i++) {
        for (var j = 0; j <= columnas; j++) {

            var u = j / columnas;
            var v = i / filas;

            var pos = superficie.getPos(u, v);

            positionBuffer.push(pos[0]);
            positionBuffer.push(pos[1]);
            positionBuffer.push(pos[2]);

            var nrm = superficie.getNormal(u, v);

            normalBuffer.push(nrm[0]);
            normalBuffer.push(nrm[1]);
            normalBuffer.push(nrm[2]);

            var uvs = superficie.getCoordenadasTextura(u, v);

            uvBuffer.push(uvs[0] * escalaUv);
            uvBuffer.push(uvs[1] * escalaUv);
        }
    }

    columnas += 1;
    filas += 1;
    for (i = 0; i < filas - 1; i++) {
        for (j = 0; j < columnas; j++) {
            indexBuffer.push(j + columnas * i);
            indexBuffer.push(j + columnas * (i + 1));
        }
        if (i < filas - 2) {
            indexBuffer.push(columnas - 1 + columnas * (i + 1));
            indexBuffer.push(columnas + columnas * i);
        }
    }

    return {
        positionBuffer,
        normalBuffer,
        indexBuffer,
        uvBuffer
    };
}
