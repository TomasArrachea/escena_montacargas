import {Cilindro, SupCubo, SupPiso} from './superficies.js';
import {SupBarrido, SupRevolucion} from './supBarrido.js';
import {generarA1, generarA2, generarB1, generarB2, generarB3, generarB4, generarCurvaChasis, generarCurvaGalpon, generarCurvaRueda, generarTrapecio} from './curvas.js'
import {mat4, vec3} from 'https://cdn.skypack.dev/gl-matrix';

var filas = 10;
var columnas = 10;

class Objeto3D {
    constructor() {
        this.vertexBuffer=null;
        this.indexBuffer=null;
        this.normalBuffer=null;
        this.matrizModelado=mat4.create();
        this.posicion=vec3.create();
        this.rotacion=vec3.create();
        this.escala=vec3.create();
        this.hijos=[];
        this.strip=true;
    }

    actualizarMatrizModelado() {
        //usar rotacion, escala y posicion para actualizar la matriz
        mat4.identity(this.matrizModelado);
        mat4.translate(this.matrizModelado,this.matrizModelado,this.posicion);
        mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotacion[0], [1,0,0]);
        mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotacion[1], [0,1,0]);
        mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotacion[2], [0,0,1]);
        mat4.scale(this.matrizModelado,this.matrizModelado,this.escala);
    }

    actualizarMatrizNormales(viewMatrix) {
        // Actualiza la matriz de normales del vertex shader usando la matriz de modelado y la matriz de la camara
        var normalMatrix = mat4.create();
        mat4.multiply(normalMatrix, viewMatrix, this.matrizModelado);
        mat4.invert(normalMatrix, normalMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        window.gl.uniformMatrix4fv(window.gl.getUniformLocation(window.glProgram, "normalMatrix"), false, normalMatrix);
    }

    dibujar(matrizPadre, viewMatrix) {
        var m = mat4.create();
        this.actualizarMatrizModelado();
        mat4.multiply(m, matrizPadre, this.matrizModelado);
        // this.actualizarMatrizNormales(viewMatrix); FIX FALLA EL MULTIPLY

        if (this.vertexBuffer && this.indexBuffer) {
            let vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
            gl.enableVertexAttribArray(vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    
            let vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
            gl.enableVertexAttribArray(vertexNormalAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
                
            window.gl.bindBuffer(window.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            // window.gl.uniform1i(shaderProgram.useLightingUniform,(lighting=="true")); // revisar esta linea, iluminacion?

            if (this.strip){
                window.gl.drawElements(window.gl.TRIANGLE_STRIP, this.indexBuffer.numItems, window.gl.UNSIGNED_SHORT, 0);
            } else {
                window.gl.drawElements(window.gl.LINE_STRIP, this.indexBuffer.numItems, window.gl.UNSIGNED_SHORT, 0);
            }
            console.log('SE DIBUJO: ' +  this.constructor.name)
        }

        for (var i = 0; i < this.hijos.length; i++) {
            this.hijos[i].dibujar(m);
        }
    }

    setGeometria(buffers, strip=true) {
        this.strip = strip;

        // generar buffers de webgl
        this.vertexBuffer = window.gl.createBuffer();
        window.gl.bindBuffer(window.gl.ARRAY_BUFFER, this.vertexBuffer);
        window.gl.bufferData(window.gl.ARRAY_BUFFER, new Float32Array(buffers.positionBuffer), window.gl.STATIC_DRAW);
        this.vertexBuffer.itemSize = 3;
        this.vertexBuffer.numItems = buffers.positionBuffer.length / 3;
    
        this.normalBuffer = window.gl.createBuffer();
        window.gl.bindBuffer(window.gl.ARRAY_BUFFER, this.normalBuffer);
        window.gl.bufferData(window.gl.ARRAY_BUFFER, new Float32Array(buffers.normalBuffer), window.gl.STATIC_DRAW);
        this.normalBuffer.itemSize = 3;
        this.normalBuffer.numItems = buffers.normalBuffer.length / 3;
    
        this.indexBuffer = window.gl.createBuffer();
        window.gl.bindBuffer(window.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        window.gl.bufferData(window.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(buffers.indexBuffer), window.gl.STATIC_DRAW);
        this.indexBuffer.itemSize = 1;
        this.indexBuffer.numItems = buffers.indexBuffer.length;

        console.log('setGeometria ' + this.constructor.name + ' buffer ' + buffers.positionBuffer[0])

    }

    agregarHijo(h) {
        this.hijos.push(h);
    }

    quitarHijo(h) {
        // devuelve un array con los elementos borrados. Si no se borra nada, no devuelve nada
        const index = this.hijos.indexOf(h);
        if (index > -1) {
            return this.hijos.splice(index);
        }
    }

    setPosicion(x,y,z) {
        this.posicion[0]=x;
        this.posicion[1]=y;
        this.posicion[2]=z;
    }

    setRotacion(x,y,z) {
        this.rotacion[0]=x;
        this.rotacion[1]=y;
        this.rotacion[2]=z;
    }

    setEscala(x,y,z) {
        this.escala[0]=x;
        this.escala[1]=y;
        this.escala[2]=z;
    }
}

class Galpon extends Objeto3D {
    constructor() {
        super();
        this.setGeometria(generarSuperficie(new SupBarrido(generarCurvaGalpon(), 100, 0), filas, columnas));
        // rotar y escalar
    }
}

class Piso extends Objeto3D {
    constructor() {
        super();
        this.setGeometria(generarSuperficie(new SupPiso(500, 500), filas, columnas));
    }
}

const DISTANCIA_RECOJER = 1;
const DISTANCIA_DEPOSITAR = 1;

class Carro extends Objeto3D {
    constructor(estanteria) {
        super();
        this.setGeometria(generarSuperficie(new SupBarrido(generarCurvaChasis(), 20, 0)));

        // TODO: acomodar posiciones y orientaciones
        this.agregarHijo(new Rueda());
        this.agregarHijo(new Rueda());
        this.agregarHijo(new Rueda());
        this.agregarHijo(new Rueda());
        this.agregarHijo(new Asiento());
        this.agregarHijo(new Cabina());
        this.agregarHijo(new Elevador());

        this.velGiro = 0;
        this.velX = 0;
        this.velY = 0;
        this.carga = null;
        this.impresora = this.impresora;
        this.estanteria = estanteria;
    }

    setVelGiro(v){
        this.velGiro = v;
    }

    setVelX(v) {
        this.velX = v;
    }

    setVelY(v) {
        this.velY = v;
    }

    toggleRecojer() {
        if (carga == null) {
            if (vec3.distance(this.posicion, this.impresora.posicion) <= DISTANCIA_RECOJER) {
                carga = this.impresora.recojerImpresion();
                this.agregarHijo(carga);
            }
        } else {
            if (vec3.distance(this.posicion, this.estanteria.posicion) <= DISTANCIA_DEPOSITAR) {
                this.estanteria.agregarObjeto(carga, this.posicion); // la estanteria elige en que estante se deposita
                carga = null;
                this.quitarHijo();
            }
        }
    }

    actualizarMatrizModelado() {
        // Actualiza la posicion antes de generar la matriz de modelado
        this.rotacion[1] = this.velGiro;
        vec3.add(this.posicion, this.posicion, [this.velX, 0, 0]);

        mat4.identity(this.matrizModelado);
        mat4.translate(this.matrizModelado,this.matrizModelado,this.posicion);
        mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotacion[0], [1,0,0]);
        mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotacion[1], [0,1,0]);
        mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotacion[2], [0,0,1]);
        mat4.scale(this.matrizModelado,this.matrizModelado,this.escala);
    }
}

class Rueda extends Objeto3D {
    constructor() {
        super();
        this.setGeometria(generarSuperficie(new SupRevolucion(generarCurvaRueda())));
    }
}

class Asiento extends Objeto3D {
    constructor() {
        super();
        this.setGeometria(generarSuperficie(new SupBarrido(generarTrapecio(), 20, 0)));
    }
}

class Cabina extends Objeto3D {
    constructor() {
        super();
        this.setGeometria(generarSuperficie(new SupBarrido(generarTrapecio(), 20, 0)));
    }
}

class Elevador extends Objeto3D {
    constructor() {
        super();
        // objeto vacio

        var ancho_col = 2;
        var largo_col = 2;
        var alto_col = 7;
        var ancho_transversal = 2;
        var largo_transversal = 2;
        var alto_transversal = 3;
        var ancho_pala = 6;
        var largo_pala = 6;
        var alto_pala = 1;

        this.agregarHijo(new Cubo(ancho_col, largo_col, alto_col)); // col 1
        this.agregarHijo(new Cubo(ancho_col, largo_col, alto_col)); // col 2
        this.agregarHijo(new Cubo(ancho_transversal, largo_transversal, alto_transversal)); // transversal 1
        this.agregarHijo(new Cubo(ancho_transversal, largo_transversal, alto_transversal)); // transversal 2
        this.agregarHijo(new Cubo(ancho_transversal, largo_transversal, alto_transversal)); // transversal 3
        this.agregarHijo(new Cubo(ancho_pala, largo_pala, alto_pala)); // pala
    }
}

class Estanteria extends Objeto3D {
    constructor() {
        super();
        // objeto vacio
        var ancho_estanteria = 6;
        var largo_estanteria = 15;
        var alto_estanteria = 1;
        var ancho_col = 1;
        var largo_col = 1;
        var alto_col = 10;

        this.agregarHijo(new Cubo(ancho_estanteria, largo_estanteria, alto_estanteria)); // estanteria 1
        this.agregarHijo(new Cubo(ancho_estanteria, largo_estanteria, alto_estanteria)); // estanteria 2
        this.agregarHijo(new Cubo(ancho_estanteria, largo_estanteria, alto_estanteria)); // estanteria 3
        for (var i = 0; i < 2; i++)
            for (var j = 0; j < 9; j++)
                this.agregarHijo(new Cubo(ancho_col, largo_col, alto_col)); // columnas
    }
}

class Impresora extends Objeto3D {
    constructor() {
        super();
        this.setGeometria(generarSuperficie(new SupRevolucion(generarCurvaRueda())), false);

        this.agregarHijo(new Barra());
        this.agregarHijo(new Cabezal());
    }

    agregarObjeto(objeto, posicion) {
        // seleccionar el estante mas cercano a la posicion
        // setear posicion del objeto a la posicion del estante.
        this.agregarHijo(objeto);

    }
}

class Cubo extends Objeto3D {
    constructor(ancho, largo, alto) {
        super();
        this.setGeometria(SupCubo.generarSuperficie(ancho, largo, alto), false);
    }
}

class Barra extends Objeto3D {
    constructor() {
        super();
        this.setGeometria(generarSuperficie(new Cilindro(1, 4)));
    }
}

class Cabezal extends Objeto3D {
    constructor() {
        super();
        // objeto vacio
        this.agregarHijo(new Cubo(3,1,1)); // agarre con la barra
        this.agregarHijo(new Cubo(1,1,2)); // tirante 1
        this.agregarHijo(new Cubo(1,1,2)); // tirante 2
        this.agregarHijo(new Cubo(3,2,1)); // agarre con panel
        this.agregarHijo(new Cubo(5,4,1)); // panel
    }
}

class Escena extends Objeto3D {
    constructor() {
        super();
        // objeto vacio
        var estanteria = new Estanteria();
        var impresora = new Impresora();
        this.agregarHijo(new Carro(estanteria, impresora));
        this.agregarHijo(impresora);
        this.agregarHijo(estanteria);
        this.agregarHijo(new Piso());
        this.agregarHijo(new Galpon());
    }

    getCarro() {
        return this.hijos[0];
    }

    getImpresora() {
        return this.hijos[1];
    }

    getEstanteria() {
        return this.hijos[2];
    }
}

function generarImpresion(tipoSuperficie, curva, torsion){
    // generar la nueva impresion de barrido a partir de parametros seteados en GUI:
        // - Tipo de superficie: “barrido” o “revolución”
        // - Forma 2D revolución: “A1”,”A2”,”A3” o “A4”
        // - Forma 2D barrido: “B1”,”B2”,”B3”o ”B4”
        // - Angulo de torsión barrido: ángulo

    // funcion del objeto Impresora?
}

function generarSuperficie(superficie,filas,columnas){
    // revisar el algoritmo del index buffer, copiar la implementacion de setupBuffers?
    var positionBuffer = [];
    var indexBuffer = [];  
    var normalBuffer = [];

    for (var i=0; i <= filas; i++) {
        for (var j=0; j <= columnas; j++) {

            var u=j/columnas;
            var v=i/filas;

            var pos=superficie.getPos(u,v);

            positionBuffer.push(pos[0]);
            positionBuffer.push(pos[1]);
            positionBuffer.push(pos[2]);

            var nrm=superficie.getNormal(u,v);

            normalBuffer.push(nrm[0]);
            normalBuffer.push(nrm[1]);
            normalBuffer.push(nrm[2]);
        }
    }

    columnas += 1
    filas += 1
    for (i=0; i < filas - 1; i++) {
        for (j=0; j < columnas; j++) {
            indexBuffer.push(j + columnas*i);
            indexBuffer.push(j + columnas*(i+1));
        }
        if (i < filas - 2) {
            indexBuffer.push(columnas-1 + columnas*(i+1));
            indexBuffer.push(columnas + columnas*i);
        }   
    }
    
    return {
        positionBuffer,
        normalBuffer,
        indexBuffer
    }
}

export {Escena};