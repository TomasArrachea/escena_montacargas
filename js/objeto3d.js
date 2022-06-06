import {Cilindro, SupCubo, SupPiso} from './superficies.js';
import {SupBarrido} from './supBarrido.js';
import {SupRevolucion} from './supRevolucion.js';
import {generarA1, generarA2, generarB1, generarB2, generarB3, generarB4, generarCurvaChasis, generarCurvaGalpon, generarCurvaRueda, generarTrapecio} from './curvas.js'
import {mat4, vec3} from 'https://cdn.skypack.dev/gl-matrix';


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
        //Reset matriz de modelado.
        mat4.identity(this.matrizModelado);
        //Escalar, rotar, trasladar en ese orden.
        if (this.escala[0] != 0 || this.escala[1] != 0 || this.escala[2] != 0){
            mat4.scale(this.matrizModelado, this.matrizModelado, this.escala);
        }
        if ((this.rotacion[0] != 0 || this.rotacion[1] != 0 || this.rotacion[2] != 0) && this.anguloRotacion != 0){
            mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotacion[0], [1,0,0]);
            mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotacion[1], [0,1,0]);
            mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotacion[2], [0,0,1]);
        }
        mat4.translate(this.matrizModelado, this.matrizModelado, this.posicion);
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

            if (this.strip){
                gl.drawElements(gl.TRIANGLE_STRIP, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            } else {
                gl.drawElements(gl.LINE_STRIP, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
        }

        for (var i = 0; i < this.hijos.length; i++) {
            this.hijos[i].dibujar(modelado);
        }
    }

    setGeometria(buffers, strip=true) {
        this.strip = strip;

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
        // TODO: revisar las filas y columnas
        this.setGeometria(generarSuperficie(new SupBarrido(generarCurvaGalpon(), 30, 0), 15, 15));
        // rotar y escalar
    }
}

class Piso extends Objeto3D {
    constructor() {
        super();
        // TODO: revisar las filas y columnas
        this.setGeometria(generarSuperficie(new SupPiso(50, 50), 15, 15));
    }
}


class Carro extends Objeto3D {
    constructor(estanteria) {
        const DISTANCIA_RECOJER = 1;
        const DISTANCIA_DEPOSITAR = 1;

        super();
        this.setGeometria(generarSuperficie(new SupBarrido(generarCurvaChasis(), 3, 0)));
        this.setEscala(1, 1, 1);
        this.setRotacion(0, 0, Math.PI/2);

        var rueda = new Rueda();
        rueda.setPosicion(3,1,2);
        this.agregarHijo(rueda);
        
        var rueda = new Rueda();
        rueda.setPosicion(-3,1,2);
        this.agregarHijo(rueda);
        
        var rueda = new Rueda();
        rueda.setPosicion(3,1,-2);
        this.agregarHijo(rueda);
        
        var rueda = new Rueda();
        rueda.setPosicion(-3,1,-2);
        this.agregarHijo(rueda);
        
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
        this.rotacion[1] += this.velGiro;
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
        this.setGeometria(generarSuperficie(new SupRevolucion(generarCurvaRueda(1, 1))));
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
        var xEstanteria = 6;
        var yEstanteria = 1;
        var zEstanteria = 4;
        var xCol = 1;
        var yCol = 8;
        var zCol = 1;
        
        var estanteria = new Cubo(xEstanteria, yEstanteria, zEstanteria);
        estanteria.setPosicion(0,2,0);
        this.agregarHijo(estanteria);

        var estanteria = new Cubo(xEstanteria, yEstanteria, zEstanteria);
        estanteria.setPosicion(0,4,0);
        this.agregarHijo(estanteria);

        var estanteria = new Cubo(xEstanteria, yEstanteria, zEstanteria);
        estanteria.setPosicion(0,6,0);
        this.agregarHijo(estanteria);

        var columna;
        for (var i = 0; i < 2; i++)
            for (var j = 0; j < 9; j++)
                columna = new Cubo(xCol, yCol, zCol);
                columna.setPosicion(i, 0, -4.5+j);
                this.agregarHijo(columna);
    }

    agregarObjeto(objeto, posicion) {
        this.agregarHijo(objeto);
        objeto.setPosicion(0, 2, 0); // TODO: elegir la ubicacion mas cercana a posicion
    }
}

class Impresora extends Objeto3D {
    constructor() {
        super();
        this.setGeometria(generarSuperficie(new SupRevolucion(generarCurvaRueda(2, 2))), false);
        this.setEscala(1,1,1);

        var cabezal = new Cabezal();
        cabezal.setPosicion(0,4,5);
        this.agregarHijo(cabezal);

        var barra = new Barra();
        barra.setPosicion(0,0,5);
        this.agregarHijo(barra);

        this.velCabezal = 0;
    }

    recojerImpresion() {
        return this.quitarHijo()
    }

    imprimir() {
        //mover el cabezal en y
        this.velCabezal = 5;

    }

}

class Cubo extends Objeto3D {
    constructor(x, y, z) {
        super();
        this.setGeometria(SupCubo.generarSuperficie(x, y, z), false);
    }
}

class Barra extends Objeto3D {
    constructor() {
        super();
        this.setGeometria(generarSuperficie(new Cilindro(0.1, 7)));
    }
}

class Cabezal extends Objeto3D {
    constructor() {
        super();
        // objeto vacio
        var agarreBarra = new Cubo(3,1,1)
        agarreBarra.setPosicion(0,0,0);
        this.agregarHijo(agarreBarra);

        var tirante1 = new Cubo(1,1,2);
        tirante1.setPosicion(1,0,-2);
        this.agregarHijo(tirante1);

        var tirante2 = new Cubo(1,1,2);
        tirante2.setPosicion(-1,0,-2);
        this.agregarHijo(tirante2);

        var agarrePanel = new Cubo(3,1,1);
        agarrePanel.setPosicion(0,0,-2.5);
        this.agregarHijo(agarrePanel);

        var panel = new Cubo(4,2,1);
        panel.setPosicion(0,-0.5,-2.5);
        this.agregarHijo(panel);
    }
}

class Escena extends Objeto3D {
    constructor() {
        super();
        // objeto vacio
        var estanteria = new Estanteria();
        estanteria.setPosicion(-20,-5,0);
        estanteria.setEscala(0.5, 0.5, 0.5);
        this.agregarHijo(estanteria);
    
        var impresora = new Impresora();
        impresora.setPosicion(10,10,0);
        impresora.setEscala(0.5, 0.5, 0.5);
        this.agregarHijo(impresora);
    
        var carro = new Carro(estanteria, impresora);
        impresora.setPosicion(5,0,0);
        impresora.setEscala(0.5, 0.5, 0.5);
        this.agregarHijo(carro);

        var piso = new Piso();
        piso.setPosicion(0,0,0);
        piso.setEscala(4, 0, 4);
        this.agregarHijo(piso);

        var galpon = new Galpon();
        galpon.setPosicion(0,0,0);
        galpon.setEscala(5, 5, 5);
        this.agregarHijo(galpon);
    }

    getCarro() {
        return this.hijos[2];
    }

    getImpresora() {
        return this.hijos[1];
    }

    getEstanteria() {
        return this.hijos[0];
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

    var filas = 10;
    var columnas = 10;
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