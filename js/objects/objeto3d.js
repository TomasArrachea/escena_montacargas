import { mat4, vec3, vec4 } from 'https://cdn.skypack.dev/gl-matrix';


export class Objeto3D {
    constructor() {
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.normalBuffer = null;
        this.matrizModelado = mat4.create();
        this.posicion = vec3.create();
        this.rotacion = vec3.create();
        this.escala = vec3.fromValues(1, 1, 1);
        this.hijos = [];
        this.strip = true;
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

        // matriz normal
        var normal = mat4.create();
        mat4.invert(normal, modelado);
        mat4.transpose(normal, normal);

        var normalMatrixUniform = gl.getUniformLocation(glProgram, "normalMatrix");
        var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix")

        gl.uniformMatrix4fv(normalMatrixUniform, false, normal);
        gl.uniformMatrix4fv(modelMatrixUniform, false, modelado);
        return modelado;
    }

    dibujar(matrizPadre) {
        var modelado = this.setMatricesShader(matrizPadre);

        if (this.vertexBuffer && this.indexBuffer) {
            let vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
            gl.enableVertexAttribArray(vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

            let vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
            gl.enableVertexAttribArray(vertexNormalAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            if (this.strip) {
                gl.drawElements(gl.TRIANGLE_STRIP, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            } else {
                gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
        }

        for (var i = 0; i < this.hijos.length; i++) {
            this.hijos[i].dibujar(modelado);
        }
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

    getPosicionMundo(matrizPadre) {
        // multiplica la posicion por su matriz de modelado padre -> le aplica las rotaciones, escalas y traslaciones que determinan la posicion
        let posMundo = vec4.create();
        vec4.transformMat4(posMundo, [this.posicion[0], this.posicion[1], this.posicion[2], 1], matrizPadre);
        return [posMundo[0], posMundo[1], posMundo[2]];
    }

}



export function generarSuperficie(superficie, filas, columnas) {

    var filas = 10;
    var columnas = 10;
    // revisar el algoritmo del index buffer, copiar la implementacion de setupBuffers?
    var positionBuffer = [];
    var indexBuffer = [];
    var normalBuffer = [];

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
        indexBuffer
    };
}
