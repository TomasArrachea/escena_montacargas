import {Cilindro, SupCubo, SupPiso} from './superficies.js';
import {SupBarrido} from './supBarrido.js';
import {SupRevolucion} from './supRevolucion.js';
import {generarA1, generarA2, generarB1, generarB2, generarB3, generarB4, generarCurvaChasis, generarCurvaGalpon, generarCurvaRueda, generarTrapecio} from './curvas.js'
import {mat4, vec3, vec4} from 'https://cdn.skypack.dev/gl-matrix';


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
        mat4.translate(this.matrizModelado, this.matrizModelado, this.posicion);
        if (this.escala[0] != 0 && this.escala[1] != 0 && this.escala[2] != 0){
            mat4.scale(this.matrizModelado, this.matrizModelado, this.escala);
        }
        if (this.rotacion[0] != 0)
            mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotacion[0], [1,0,0]);
        if (this.rotacion[1] != 0)
            mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotacion[1], [0,1,0]);
        if (this.rotacion[2] != 0)
            mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotacion[2], [0,0,1]);
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

    setPosicion(x,y,z) {
        this.posicion[0] = x;
        this.posicion[1] = y;
        this.posicion[2] = z;
    }

    setRotacion(x,y,z) {
        this.rotacion[0] += x;
        this.rotacion[1] += y;
        this.rotacion[2] += z;
    }

    setEscala(x,y,z) {
        this.escala[0] = x;
        this.escala[1] = y;
        this.escala[2] = z;
    }

    getPosicion() {
        return this.posicion;
    }

    getPosicionMundo(matrizMundo){
        var modelado = mat4.create();
        this.actualizarMatrizModelado();
        mat4.multiply(modelado, matrizMundo, this.matrizModelado);

        let pos = vec4.create();
        vec4.transformMat4(pos, vec4.fromValues(0,0,0,1), modelado);
        return [pos[0], pos[1], pos[2]];
    }

}

class Galpon extends Objeto3D {
    constructor() {
        super();
        // TODO: revisar las filas y columnas
        var alto = 10;
        var ancho = 30;
        this.setGeometria(generarSuperficie(new SupBarrido(generarCurvaGalpon(alto, ancho), 30, 0), 15, 15));
        this.setRotacion(Math.PI/2, Math.PI, 0);
    }
}

class Piso extends Objeto3D {
    constructor() {
        super();
        // TODO: revisar las filas y columnas
        this.setGeometria(generarSuperficie(new SupPiso(50, 50), 15, 15));
    }
}

class Chasis extends Objeto3D {
    constructor(ancho, alto, largo) {
        super();
        this.ancho = 3.5;
        this.alto = 3;
        this.setGeometria(generarSuperficie(new SupBarrido(generarCurvaChasis(alto, largo), ancho, 0)));
    }
}

class Carro extends Objeto3D {
    constructor(estanteria, impresora) {
        super();
        this.DISTANCIA_RECOJER = 1.5;
        this.DISTANCIA_DEPOSITAR = 1;
        var ancho = 3.5;
        var alto = 2;
        var largo = 4;

        // objeto vacio
        var chasis = new Chasis(ancho, alto, largo);
        chasis.setRotacion(0, 0, Math.PI/2);
        chasis.setPosicion(0, 0.5+alto/2, 0);
        this.agregarHijo(chasis);

        var rueda = new Rueda();
        rueda.setPosicion(ancho/2,1,ancho/2);
        rueda.setRotacion(0, Math.PI, 0);
        this.agregarHijo(rueda);
        
        var rueda = new Rueda();
        rueda.setPosicion(-ancho/2,1,ancho/2);
        this.agregarHijo(rueda);
        
        var rueda = new Rueda();
        rueda.setPosicion(ancho/2,1,-ancho/2);
        rueda.setRotacion(0, Math.PI, 0);
        this.agregarHijo(rueda);
        
        var rueda = new Rueda();
        rueda.setPosicion(-ancho/2,1,-ancho/2);
        this.agregarHijo(rueda);
        
        var asiento = new Asiento();
        asiento.setPosicion(0, alto/2+1.5, -largo/2+0.5);
        this.agregarHijo(asiento);

        var cabina = new Asiento();
        cabina.setPosicion(0, alto/2+1.5, largo/2-0.5);
        cabina.setRotacion(0,0,Math.PI); // por alguna razon para rotar en el eje y hay que aplicar la rotacion en el eje z. Lo mismo en el asiento
        cabina.setEscala(1,0.25,1);
        this.agregarHijo(cabina);

        this.elevador = new Elevador();
        this.elevador.setPosicion(0, alto/2+0.5, largo/2+alto*0.3+0.05);
        this.elevador.setEscala(1,1.6,1)
        this.agregarHijo(this.elevador);

        this.velGiro = 0;
        this.velX = 0;
        this.carga = null;
        this.impresora = impresora;
        this.estanteria = estanteria;
        this.matrizRotacion = mat4.create();
    }

    setVelGiro(v){
        this.velGiro = v;
    }

    setVelX(v) {
        this.velX = v;
    }

    setVelY(v) {
        this.elevador.setVelY(v);
    }

    toggleRecojer() {
        if (this.carga == null) {
            if (vec3.distance(this.elevador.getPosicionMundo(this.matrizModelado), this.impresora.posicion) <= this.DISTANCIA_RECOJER) {
                console.log('Carga recogida.');
                this.carga = this.impresora.recojerImpresion();
                this.carga.setPosicion(0,3,4); // es la posicion relativa de la pala en el carro. En realidad la puedo calcular con la posicion de la pala en el elevador y la posicion de la pala en el elevador
                this.carga.setEscala(1/0.4, 1/0.4, 1/0.4); // al auto se le aplica una escala en la escena. La deshago para la impresion
                this.agregarHijo(this.carga);
            }
        } else {
            if (vec3.distance(this.elevador.getPosicionMundo(this.matrizModelado), this.estanteria.posicion) <= this.DISTANCIA_DEPOSITAR) {
                console.log('Depositando carga...');
                this.estanteria.agregarObjeto(this.carga, this.posicion); // la estanteria elige en que estante se deposita
                this.carga = null;
                this.quitarHijo();
            }
        }
    }

    actualizarMatrizModelado() {
        // Actualiza la posicion segun el giro del carro
        this.rotacion[1] += this.velGiro;
        var avance = vec3.fromValues(0, 0, this.velX)

        mat4.rotate(this.matrizRotacion, this.matrizRotacion, this.velGiro, vec3.fromValues(0,1,0));                
        vec3.transformMat4(avance, avance, this.matrizRotacion);

        vec3.add(this.posicion, this.posicion, avance);

        mat4.identity(this.matrizModelado);
        mat4.translate(this.matrizModelado, this.matrizModelado, this.posicion);
        mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotacion[1], [0,1,0]);
        if (this.escala[0] != 0 && this.escala[1] != 0 && this.escala[2] != 0)
            mat4.scale(this.matrizModelado, this.matrizModelado, this.escala);
    }
}

class Rueda extends Objeto3D {
    constructor(radio=1, ancho=0.4) {
        super();
        this.setGeometria(generarSuperficie(new SupRevolucion(generarCurvaRueda(radio, ancho))));
        this.setRotacion(0, 0, Math.PI/2);
    }
}

class Asiento extends Objeto3D {
    constructor() {
        super();
        this.baseGrande = 1;
        this.baseChica = 0.5;
        this.largo = 2;
        var sup = generarTrapecio(this.baseChica, this.baseGrande, this.largo);
        this.setGeometria(generarSuperficie(new SupBarrido(sup, 2, 0)));
        this.setRotacion(-Math.PI/2, 0, -Math.PI/2);
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
        var anchoCol = 0.3;
        var largoCol = 4.7;
        var altoCol = 0.1;

        var anchoTransversal = 2.5;
        var largoTransversal = 0.2;
        var altoTransversal = 0.08;
        
        this.anchoPala = 2;
        var largoPala = 0.05;
        var altoPala = 2;

        var columna = new Cubo(anchoCol, largoCol, altoCol)
        columna.setPosicion(-(anchoTransversal-0.4)/2, largoCol/2-0.5, 0);
        this.agregarHijo(columna); // col 1

        var columna = new Cubo(anchoCol, largoCol, altoCol)
        columna.setPosicion((anchoTransversal-0.5)/2, largoCol/2-0.5, 0);
        this.agregarHijo(columna); // col 2

        var tirante = new Cubo(anchoTransversal, largoTransversal, altoTransversal);
        tirante.setPosicion(0, 0, 0);
        this.agregarHijo(tirante); // transversal 1

        var tirante = new Cubo(anchoTransversal, largoTransversal, altoTransversal);
        tirante.setPosicion(0, 2, 0);
        this.agregarHijo(tirante); // transversal 2

        var tirante = new Cubo(anchoTransversal, largoTransversal, altoTransversal);
        tirante.setPosicion(0, 4, 0);
        this.agregarHijo(tirante); // transversal 3

        this.basePala = 0;
        this.topePala = 4;
        this.velPala = 0;
        this.alturaPala = this.basePala;
        this.pala = new Cubo(this.anchoPala, largoPala, altoPala);
        this.pala.setPosicion(0, this.alturaPala, this.anchoPala/2);
        this.agregarHijo(this.pala);
    }

    setVelY(v) {
        this.velPala = v;
    }
    
    actualizarMatrizModelado() {
        if (this.alturaPala + this.velPala < this.topePala && this.alturaPala + this.velPala >= this.basePala)
            this.alturaPala += this.velPala;
        this.pala.setPosicion(0, this.alturaPala, this.anchoPala/2);

        mat4.identity(this.matrizModelado);
        mat4.translate(this.matrizModelado, this.matrizModelado, this.posicion);
        mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotacion[1], [0,1,0]);
        if (this.escala[0] != 0 && this.escala[1] != 0 && this.escala[2] != 0)
            mat4.scale(this.matrizModelado, this.matrizModelado, this.escala);
    }
}

class Estanteria extends Objeto3D {
    constructor() {
        super();
        // objeto vacio
        var xEstanteria = 2;
        var yEstanteria = 0.2;
        var zEstanteria = 16;
        var xCol = 0.2;
        var yCol = 7.2;
        var zCol = 0.2;

        var estanteria = new Cubo(xEstanteria, yEstanteria, zEstanteria);
        estanteria.setPosicion(0,2,0);
        this.agregarHijo(estanteria);

        var estanteria = new Cubo(xEstanteria, yEstanteria, zEstanteria);
        estanteria.setPosicion(0,4.5,0);
        this.agregarHijo(estanteria);

        var estanteria = new Cubo(xEstanteria, yEstanteria, zEstanteria);
        estanteria.setPosicion(0,7,0);
        this.agregarHijo(estanteria);

        var columna;
        zEstanteria = zEstanteria - 1;
        xEstanteria = xEstanteria - 0.5;
        for (var i = 0; i < 2; i++)
            for (var j = 0; j < 9; j++) {
                columna = new Cubo(xCol, yCol, zCol);
                columna.setPosicion(i*xEstanteria-xEstanteria/2, yCol/2, -zEstanteria/2+j*zEstanteria/8);
                this.agregarHijo(columna);
            }
    }

    agregarObjeto(objeto, posicion) {
        this.agregarHijo(objeto);
        objeto.setEscala(0.4, 0.4, 0.4); // deshago la escala del carro
        objeto.setEscala(2, 2, 2); // deshago la escala de la estanteria
        objeto.setPosicion(0, 3, 0); // TODO: elegir la ubicacion mas cercana a posicion
    }
}

class Impresora extends Objeto3D {
    constructor() {
        super();
        this.VEL_SETUP = -0.05;
        this.VEL_IMPRESION = 0.01;

        var radio = 1;
        this.alturaBase = 1.2;
        var rueda = new Rueda(radio, this.alturaBase);
        rueda.setRotacion(-Math.PI/2, Math.PI/2, 0);
        this.agregarHijo(rueda)
        

        this.zBarra = radio*4/5;
        var barra = new Barra();
        barra.setPosicion(0,this.alturaBase, this.zBarra);
        this.agregarHijo(barra);


        this.baseCabezal = this.alturaBase + barra.largo*1/10; // a ojo para que llegue casi a tocar la base de la impresora
        this.topeCabezal = this.alturaBase + barra.largo*4/5;
        this.velCabezal = 0;
        this.alturaCabezal = this.topeCabezal;
        this.cabezal = new Cabezal();
        this.cabezal.setPosicion(0, this.alturaCabezal, this.zBarra);
        this.agregarHijo(this.cabezal);

        this.setRotacion(0, Math.PI/2, 0);
        this.impresion = null;
    }

    recojerImpresion() {
        this.impresion = null;
        return this.quitarHijo();
    }

    generarImpresion(tipoSuperficie, curva, torsion) {
        console.log('Imprimiendo...');
        if (this.velCabezal == this.VEL_IMPRESION) {
            console.log('Ya hay una impresión en curso.');
            return
        }
        if (this.impresion != null) {
            console.log('Ya hay una impresion terminada.');
            return
        }
        
        this.velCabezal = this.VEL_SETUP;
        if (tipoSuperficie == 'barrido') {
            this.impresion = new ImpresionBarrido(curva, 1.1, torsion);
            this.impresion.setPosicion(0, this.alturaBase+0.55, 0); // le sumo la mitad del alto de la figura

        } else if (tipoSuperficie == 'revolucion') {
            this.impresion = new ImpresionRevolucion(curva);
            this.impresion.setPosicion(0, this.alturaBase, 0);
        }
    }

    actualizarMatrizModelado() {
        if (this.alturaCabezal+this.velCabezal <= this.topeCabezal)
            this.alturaCabezal += this.velCabezal;
            if (this.alturaCabezal < this.baseCabezal)
                this.alturaCabezal = this.baseCabezal;
        if (this.alturaCabezal == this.baseCabezal) { // solo se ejecuta una vez
            this.velCabezal = this.VEL_IMPRESION;
            this.agregarHijo(this.impresion);
        } else if (this.alturaCabezal >= this.topeCabezal-this.velCabezal)
            this.velCabezal = 0

        this.cabezal.setPosicion(0, this.alturaCabezal, this.zBarra);

        mat4.identity(this.matrizModelado);
        mat4.translate(this.matrizModelado, this.matrizModelado, this.posicion);
        mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotacion[0], [1,0,0]);
        mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotacion[1], [0,1,0]);
        mat4.rotate(this.matrizModelado,this.matrizModelado,this.rotacion[2], [0,0,1]);
        if (this.escala[0] != 0 && this.escala[1] != 0 && this.escala[2] != 0)
            mat4.scale(this.matrizModelado, this.matrizModelado, this.escala);
    }
}

class ImpresionRevolucion extends Objeto3D {
    constructor(tipoCurva) {
        super();
        var curva;
        if (tipoCurva == 'A1') {
            curva = generarA1();
            this.setRotacion(0, 0, Math.PI);
            this.setEscala(0.5, 0.4, 0.5);
        }
        else if (tipoCurva == 'A2') {
            curva = generarA2();
            this.setRotacion(0, 0, Math.PI);
            this.setEscala(1, 0.5, 1);
        }
        else if (tipoCurva == 'A3')
            curva = generarA3();
        else if (tipoCurva == 'A4')
            curva = generarA4();
        this.setGeometria(generarSuperficie(new SupRevolucion(curva)));
    }
}

class ImpresionBarrido extends Objeto3D {
    constructor(tipoCurva, altura, torsion) {
        super();
        var curva;
        if (tipoCurva == 'B1')
            curva = generarB1();
        else if (tipoCurva == 'B2')
            curva = generarB2();
        else if (tipoCurva == 'B3')
            curva = generarB3();
        else if (tipoCurva == 'B4')
            curva = generarB4();
        this.setGeometria(generarSuperficie(new SupBarrido(curva, altura, torsion)));
    }
}

class Cubo extends Objeto3D {
    constructor(x, y, z) {
        super();
        this.strip = false;
        this.setGeometria(SupCubo.generarSuperficie(x, y, z));
    }
}

class Barra extends Objeto3D {
    constructor() {
        super();
        this.largo = 3;
        this.setGeometria(generarSuperficie(new Cilindro(0.1, this.largo)));
    }
}

class Cabezal extends Objeto3D {
    constructor() {
        super();
        // objeto vacio
        var agarreBarra = new Cubo(0.4,0.2,0.3)
        agarreBarra.setPosicion(0,0,0);
        this.agregarHijo(agarreBarra);

        var tirante = new Cubo(0.1,0.15,1);
        tirante.setPosicion(0.1,0,-0.5);
        this.agregarHijo(tirante);

        var tirante = new Cubo(0.1,0.15,1);
        tirante.setPosicion(-0.1,0,-0.7);
        this.agregarHijo(tirante);

        var agarrePanel = new Cubo(0.6,0.2,0.3);
        agarrePanel.setPosicion(0,0,-1.2);
        this.agregarHijo(agarrePanel);

        var panel = new Cubo(1,0.05,1);
        panel.setPosicion(0,-0.05,-1.2);
        this.agregarHijo(panel);
    }
}

class Escena extends Objeto3D {
    constructor() {
        super();
        // objeto vacio
        var estanteria = new Estanteria();
        estanteria.setPosicion(-7,0,0);
        estanteria.setEscala(0.5, 0.5, 0.5);
        this.agregarHijo(estanteria);
    
        var impresora = new Impresora();
        impresora.setPosicion(7,0,0);
        this.agregarHijo(impresora);
    
        var carro = new Carro(estanteria, impresora);
        carro.setPosicion(0,0,0);
        carro.setEscala(0.4, 0.4, 0.4);
        this.agregarHijo(carro);

        var piso = new Piso();
        piso.setPosicion(0,0,0);
        piso.setEscala(4, 0, 4);
        this.agregarHijo(piso);

        var galpon = new Galpon();
        this.agregarHijo(galpon);
    }

    getCarro() {
        var carro = this.hijos[2];
        if (carro instanceof Carro)
            return carro;
        return null;
    }

    getPosImpresora() {
        var impresora = this.hijos[1];
        if (impresora instanceof Impresora)
            return impresora.getPosicion();
        return vec3.create();
    }

    getPosEstanteria() {
        var estanteria = this.hijos[0];
        if (estanteria instanceof Estanteria)
            return estanteria.getPosicion();
        return vec3.create();
    }

    generarImpresion(tipoSuperficie, curva, torsion) {
        var impresora = this.hijos[1];
        if (impresora instanceof Impresora)
            impresora.generarImpresion(tipoSuperficie, curva, torsion);
    }
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