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
        var m = mat4.create();
        mat4.translate(m,m,this.posicion)
        mat4.rotate(m,m,this.rotacion[0], [1,0,0]);
        mat4.rotate(m,m,this.rotacion[1], [0,1,0]);
        mat4.rotate(m,m,this.rotacion[2], [1,0,2]);
        mat4.scale(m, this.escala)

        this.matrizModelado = m
    }

    dibujar(matrizPadre) {
        var m = mat4.create();
        actualizarMatrizModelado();
        mat4.multiply(m, matrizPadre ,this.matrizModelado)

        if (this.vertexBuffer && this.indexBuffer) {
            // si el objeto tiene geometria asociada
            // dibujar la malla de triangulos con webgl
            drawScene() // TODO ver que la funcion usa buffers como variables globales
        }

        for (var i = 0; i < this.hijos.length; i++) {
            hijos[i].dibujar(m);
        }
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
        buffers = generarSuperficie(new SupGalpon())
        this.vertexBuffer = buffers.vertexBuffer
        this.indexBuffer = buffers.indexBuffer
        this.normalBuffer = buffers.normalBuffer
    }
}

function generarEscena(){
    // piso es el nodo ppal del arbol de la escena. 
    // Cada estructura incluye todos sus hijos
    escena = new Piso()

    escena.agregarHijo(new Galpon())
    escena.agregarHijo(new Carrito())
    escena.agregarHijo(new Estanteria())
    escena.agregarHijo(new Piso())

    return escena
}

function dibujarEscena(escena){
    escena.dibujar()
}

function generarImpresion(){
    // generar la nueva impresion a partir de parametros seteados en GUI:
        // - Tipo de superficie: “barrido” o “revolución”
        // - Forma 2D revolución: “A1”,”A2”,”A3” o “A4”
        // - Forma 2D barrido: “B1”,”B2”,”B3”o ”B4”
        // - Angulo de torsión barrido: ángulo >0
    tipoSuperficie
    forma
    angulo
}