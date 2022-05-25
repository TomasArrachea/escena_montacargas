import {Cilindro, SupCubo, SupPiso} from './superficies.js';
import {SupBarrido, SupRevolucion} from './supBarrido.js';
import {generarA1, generarA2, generarB1, generarB2, generarB3, generarB4, generarCurvaChasis, generarCurvaGalpon, generarCurvaRueda, generarTrapecio} from './curvas.js'
import {mat4, vec3} from 'https://cdn.skypack.dev/gl-matrix';

var filas = 100;
var columnas = 100;

class Objeto3D {
    vertexBuffer=null;
    indexBuffer=null;
    normalBuffer=null;
    matrizModelado=mat4.create();
    posicion=vec3.create();
    rotacion=vec3.create();
    escala=vec3.create();
    hijos=[];
    strip=true;

    actualizarMatrizModelado() {
        //usar rotacion, escala y posicion para actualizar la matriz
        mat4.identity(this.matrizModelado);
        mat4.translate(this.matrizModelado,this.matrizModelado,this.posicion);
        mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotacion[0], [1,0,0]);
        mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotacion[1], [0,1,0]);
        mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotacion[2], [1,0,2]);
        mat4.scale(this.matrizModelado,this.matrizModelado,this.escala);
    }

    dibujar(matrizPadre) {
        var m = mat4.create();
        this.actualizarMatrizModelado();
        mat4.multiply(m, matrizPadre, this.matrizModelado);

        if (this.vertexBuffer && this.indexBuffer) {
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
            
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.uniform1i(shaderProgram.useLightingUniform,(lighting=="true")); // revisar esta linea, iluminacion?

            if (strip){
                gl.drawElements(gl.TRIANGLE_STRIP, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            } else {
                gl.drawElements(gl.LINE_STRIP, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
        }

        for (var i = 0; i < this.hijos.length; i++) {
            this.hijos[i].dibujar(m);
        }
    }

    setGeometria(buffers, strip=true) {
        this.strip = strip;
        this.vertexBuffer = buffers.webgl_position_buffer;
        this.indexBuffer = buffers.webgl_index_buffer;
        this.normalBuffer = buffers.webgl_normal_buffer;
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

class Carrito extends Objeto3D {
    constructor() {
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

        this.agregarHijo(new Piso());
        this.agregarHijo(new Galpon());
        this.agregarHijo(new Carrito());
        this.agregarHijo(new Estanteria());
        this.agregarHijo(new Impresora());
        }
}

function generarImpresion(tipoSuperficie, curva, torsion){
    // generar la nueva impresion de barrido a partir de parametros seteados en GUI:
        // - Tipo de superficie: “barrido” o “revolución”
        // - Forma 2D revolución: “A1”,”A2”,”A3” o “A4”
        // - Forma 2D barrido: “B1”,”B2”,”B3”o ”B4”
        // - Angulo de torsión barrido: ángulo
}

function generarSuperficie(superficie,filas,columnas){
    // funcion que reemplaza a setupBuffers. Devuelve los buffers, no hace falta bindearlos a webgl.
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