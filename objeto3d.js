class Objeto3D {
    vertexBuffer=null;
    indexBuffer=null;
    normalBuffer=null;
    matrizModelado=mat4.create();
    posicion=vec3.create();
    rotacion=vec3.create();
    escala=vec3.create();
    hijos=[];

    actualizarMatrizModelado() {
        //usar rotacion, escala y posicion para actualizar la matriz
        mat4.identity(this.matrizModelado)
        mat4.translate(this.matrizModelado,this.matrizModelado,this.posicion)
        mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotacion[0], [1,0,0]);
        mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotacion[1], [0,1,0]);
        mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotacion[2], [1,0,2]);
        mat4.scale(this.matrizModelado,this.matrizModelado,this.escala)
    }

    dibujar(matrizPadre) {
        var m = mat4.create();
        actualizarMatrizModelado();
        mat4.multiply(m, matrizPadre ,this.matrizModelado)

        if (this.vertexBuffer && this.indexBuffer) {
            drawScene(this.vertexBuffer, this.indexBuffer, this.normalBuffer) // TODO la funcion usa buffers como variables globales, agregar parametros
            // agregar como parametro tambien las filas y columnas
        }

        for (var i = 0; i < this.hijos.length; i++) {
            hijos[i].dibujar(m);
        }
    }

    setGeometria(buffers) {
        this.vertexBuffer = buffers.webgl_position_buffer
        this.indexBuffer = buffers.webgl_index_buffer
        this.normalBuffer = buffers.webgl_normal_buffer
    }
    
    agregarHijo(h) {
        this.hijos.push(h)
    }

    quitarHijo(h) {
        // devuelve un array con los elementos borrados. Si no se borra nada, no devuelve nada
        const index = this.hijos.indexOf(h);
        if (index > -1) {
            return this.hijos.splice(index);
        }
    }

    setPosicion(x,y,z) {
        this.posicion[0]=x
        this.posicion[1]=y
        this.posicion[2]=z
    }

    setRotacion(x,y,z) {
        this.rotacion[0]=x
        this.rotacion[1]=y
        this.rotacion[2]=z
    }

    setEscala(x,y,z) {
        this.escala[0]=x
        this.escala[1]=y
        this.escala[2]=z
    }
}

class Galpon extends Objeto3D {
    constructor() {
        // generar y cargar buffers del galpon.
        this.setGeometria(generarSuperficie(new SupGalpon(ancho, largo, alto), filas, columnas))
    }
}

class Carrito extends Objeto3D {
    constructor() {
        // cargar buffers del carrito y agregar hijos
        this.setGeometria(generarSuperficie(new Chasis(ancho, largo, alto)))

        // las posiciones y demas parametros se ajustan al dibujarlo, ahora solo se generan los buffers
        this.agregarHijo(new Rueda())
        this.agregarHijo(new Rueda())
        this.agregarHijo(new Rueda())
        this.agregarHijo(new Rueda())
        this.agregarHijo(new Asiento())
        this.agregarHijo(new Cabina())
        this.agregarHijo(new Elevador())
    }
}

class Rueda extends Objeto3D {
    constructor() {
        this.setGeometria(generarSuperficie(new SupRueda(radio)))
    }
}

class Asiento extends Objeto3D {
    constructor() {
        this.setGeometria(generarSuperficie(new Trapecio(ancho1, ancho2, largo, alto)))
    }
}

class Cabina extends Objeto3D {
    constructor() {
        this.setGeometria(generarSuperficie(new Trapecio(ancho1, ancho2, largo, alto)))
    }
}

class Elevador extends Objeto3D {
    constructor() {
        this.setGeometria(Cubo.generarSuperficie(ancho, largo, alto))
        this.agregarHijo(new Cubo(ancho_columna, largo_columna, alto_columna)) // columna 1
        this.agregarHijo(new Cubo(ancho_columna, largo_columna, alto_columna)) // columna 1
        this.agregarHijo(new Cubo(ancho_transversal, largo_transversal, alto_transversal)) // transversal 3
        this.agregarHijo(new Cubo(ancho_transversal, largo_transversal, alto_transversal)) // transversal 3
        this.agregarHijo(new Cubo(ancho_pala, largo_pala, alto_pala)) // pala
    }
}

class Estanteria extends Objeto3D {
    constructor() {
        ancho_estanteria, largo_estanteria, alto_estanteria; //definir parametros
        ancho_columna, largo_columna, alto_columna;
        // armar un objeto 3d para cada estante y estanteria
        this.setGeometria(Cubo.generarSuperficie(ancho_estanteria, largo_estanteria, alto_estanteria)) // estanteria 1
        this.agregarHijo(new Cubo(ancho_estanteria, largo_estanteria, alto_estanteria)) // estanteria 2
        this.agregarHijo(new Cubo(ancho_estanteria, largo_estanteria, alto_estanteria)) // estanteria 3
        this.agregarHijo(new Cubo(ancho_columna, largo_columna, alto_columna)) // columna 11
        this.agregarHijo(new Cubo(ancho_columna, largo_columna, alto_columna)) // columna 12
        this.agregarHijo(new Cubo(ancho_columna, largo_columna, alto_columna)) // columna 21
        this.agregarHijo(new Cubo(ancho_columna, largo_columna, alto_columna)) // columna 22
        this.agregarHijo(new Cubo(ancho_columna, largo_columna, alto_columna)) // columna 31
        this.agregarHijo(new Cubo(ancho_columna, largo_columna, alto_columna)) // columna 32
        this.agregarHijo(new Cubo(ancho_columna, largo_columna, alto_columna)) // columna 41
        this.agregarHijo(new Cubo(ancho_columna, largo_columna, alto_columna)) // columna 42
        this.agregarHijo(new Cubo(ancho_columna, largo_columna, alto_columna)) // columna 51
        this.agregarHijo(new Cubo(ancho_columna, largo_columna, alto_columna)) // columna 52
        this.agregarHijo(new Cubo(ancho_columna, largo_columna, alto_columna)) // columna 61
        this.agregarHijo(new Cubo(ancho_columna, largo_columna, alto_columna)) // columna 62
        this.agregarHijo(new Cubo(ancho_columna, largo_columna, alto_columna)) // columna 71
        this.agregarHijo(new Cubo(ancho_columna, largo_columna, alto_columna)) // columna 72
        this.agregarHijo(new Cubo(ancho_columna, largo_columna, alto_columna)) // columna 81
        this.agregarHijo(new Cubo(ancho_columna, largo_columna, alto_columna)) // columna 82
        this.agregarHijo(new Cubo(ancho_columna, largo_columna, alto_columna)) // columna 91
        this.agregarHijo(new Cubo(ancho_columna, largo_columna, alto_columna)) // columna 92
    }
}


function generarEscena(){
    // piso es el nodo ppal del arbol de la escena. 
    // Cada estructura incluye todos sus hijos
    escena = new Piso()

    escena.agregarHijo(new Galpon())
    escena.agregarHijo(new Carrito())
    escena.agregarHijo(new Estanteria())
    escena.agregarHijo(new Impresora())

    return escena
}

function dibujarEscena(escena){
    // reemplaza drawScene. Revisar que la invoco en el objeto3D.dibujar()
    escena.dibujar()
}

function generarImpresion(){
    // generar la nueva impresion de barrido a partir de parametros seteados en GUI:
        // - Tipo de superficie: “barrido” o “revolución”
        // - Forma 2D revolución: “A1”,”A2”,”A3” o “A4”
        // - Forma 2D barrido: “B1”,”B2”,”B3”o ”B4”
        // - Angulo de torsión barrido: ángulo >0
    tipoSuperficie
    forma
    angulo
}

function generarSuperficie(superficie,filas,columnas){
    // funcion que reemplaza a setupBuffers. Devuelve los buffers, no hace falta bindearlos a webgl.
    // revisar el algoritmo del index buffer, copiar la implementacion de setupBuffers?
    positionBuffer = [];
    normalBuffer = [];

    for (var i=0; i <= filas; i++) {
        for (var j=0; j <= columnas; j++) {

            var u=j/columnas;
            var v=i/filas;

            var pos=superficie.getPosicion(u,v);

            positionBuffer.push(pos[0]);
            positionBuffer.push(pos[1]);
            positionBuffer.push(pos[2]);

            var nrm=superficie.getNormal(u,v);

            normalBuffer.push(nrm[0]);
            normalBuffer.push(nrm[1]);
            normalBuffer.push(nrm[2]);
        }
    }

    indexBuffer=[];  
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