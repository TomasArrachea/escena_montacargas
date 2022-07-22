class Curva {
    constructor() {
        this.puntos = [];
        this.normales = [];
    }

    B0cuadr = function (u) { return (1 - u) * (1 - u); }
    B1cuadr = function (u) { return 2 * u * (1 - u); }
    B2cuadr = function (u) { return u * u; }
    B0cuadrDer = function (u) { return -2 + 2 * u; }
    B1cuadrDer = function (u) { return 2 - 4 * u; }
    B2cuadrDer = function (u) { return 2 * u; }
    B0cub = function (u) { return (1 - u) * (1 - u) * (1 - u); }
    B1cub = function (u) { return 3 * (1 - u) * (1 - u) * u; }
    B2cub = function (u) { return 3 * (1 - u) * u * u; }
    B3cub = function (u) { return u * u * u; }
    B0cubDer = function (u) { return -3 * u * u + 6 * u - 3; }
    B1cubDer = function (u) { return 9 * u * u - 12 * u + 3; }
    B2cubDer = function (u) { return -9 * u * u + 6 * u; }
    B3cubDer = function (u) { return 3 * u * u; }

    #curvaLineal(u, p0, p1) {
        var punto = new Object();
        punto.x = (1 - u) * p0[0] + u * p1[0];
        punto.y = (1 - u) * p0[1] + u * p1[1];
        return punto;
    }

    #curvaCuadratica(u, p0, p1, p2) {
        var punto = new Object();
        punto.x = this.B0cuadr(u) * p0[0] + this.B1cuadr(u) * p1[0] + this.B2cuadr(u) * p2[0];
        punto.y = this.B0cuadr(u) * p0[1] + this.B1cuadr(u) * p1[1] + this.B2cuadr(u) * p2[1];
        return punto;
    }

    #curvaCubica(u, p0, p1, p2, p3) {
        var punto = new Object();
        punto.x = this.B0cub(u) * p0[0] + this.B1cub(u) * p1[0] + this.B2cub(u) * p2[0] + this.B3cub(u) * p3[0];
        punto.y = this.B0cub(u) * p0[1] + this.B1cub(u) * p1[1] + this.B2cub(u) * p2[1] + this.B3cub(u) * p3[1];
        return punto;
    }

    #curvaLinealDer(u, p0, p1) {
        var punto = new Object();
        punto.x = -p0[0] + p1[0];
        punto.y = -p0[1] + p1[1];
        return punto;
    }

    #curvaCuadraticaDer(u, p0, p1, p2) {
        var punto = new Object();
        punto.x = this.B0cuadrDer(u) * p0[0] + this.B1cuadrDer(u) * p1[0] + this.B2cuadrDer(u) * p2[0];
        punto.y = this.B0cuadrDer(u) * p0[1] + this.B1cuadrDer(u) * p1[1] + this.B2cuadrDer(u) * p2[1];
        return punto;
    }

    #curvaCubicaDer(u, p0, p1, p2, p3) {
        var punto = new Object();
        punto.x = this.B0cubDer(u) * p0[0] + this.B1cubDer(u) * p1[0] + this.B2cubDer(u) * p2[0] + this.B3cubDer(u) * p3[0];
        punto.y = this.B0cubDer(u) * p0[1] + this.B1cubDer(u) * p1[1] + this.B2cubDer(u) * p2[1] + this.B3cubDer(u) * p3[1];
        return punto;
    }

    agregarSegmento(p0, p1, deltaU = 0.1) {
        for (var u = 0; u <= 1.001; u = u + deltaU) {
            var punto = this.#curvaLineal(u, p0, p1);
            this.puntos.push(punto.x);
            this.puntos.push(punto.y);
            var normal = this.#curvaLinealDer(u, p0, p1);
            var mod = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
            this.normales.push(normal.y / mod);
            this.normales.push(-normal.x / mod);
        }
    }

    agregarCurvaCuadratica(p0, p1, p2) {
        var deltaU = 0.1;
        for (var u = 0; u <= 1.001; u = u + deltaU) {
            var punto = this.#curvaCuadratica(u, p0, p1, p2);
            this.puntos.push(punto.x);
            this.puntos.push(punto.y);
            var normal = this.#curvaCuadraticaDer(u, p0, p1, p2);
            var mod = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
            this.normales.push(normal.y / mod);
            this.normales.push(-normal.x / mod);
        }
    }

    agregarCurvaCubica(p0, p1, p2, p3, deltaU = 0.1) {
        // todo: el deltaU deberia ser proporcional al largo del tramo, al igual que la cantidad de filas/columnas, para que se vea suave y las texturas no se estiren.
        // idem para el resto de las curvas.
        for (var u = 0; u <= 1.001; u = u + deltaU) {
            var punto = this.#curvaCubica(u, p0, p1, p2, p3);
            this.puntos.push(punto.x);
            this.puntos.push(punto.y);
            var normal = this.#curvaCubicaDer(u, p0, p1, p2, p3);
            var mod = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
            this.normales.push(normal.y / mod);
            this.normales.push(-normal.x / mod);
        }
    }
}


function generarB1() {
    var puntos = [[-0.23, -0.4], [-0.23, 0.4], [0.45, 0], [-0.23, -0.4]]; // triangulo con centro en 0,0

    var curva = new Curva();
    for (var i = puntos.length - 1; i > 0; i--) {
        curva.agregarSegmento(puntos[i], puntos[i - 1], 0.2);
    }
    return curva;
}


function generarB2() {
    var curva = new Curva();
    var radio = 0.5;

    for (var a = 0; a < 2 * Math.PI; a = a + 2 * Math.PI / 7) {
        var ax = radio * Math.cos(a);
        var ay = radio * Math.sin(a);

        var ax2 = radio * Math.cos(a + 2 * Math.PI / 7);
        var ay2 = radio * Math.sin(a + 2 * Math.PI / 7);

        curva.agregarCurvaCuadratica(
            [ax, ay],
            [(ax + ax2) / 6, (ay + ay2) / 6],
            [ax2, ay2],
        );
    }
    return curva;
}


function generarB3() {
    var curva = new Curva();
    var centro = [0, 0];
    var lado = 0.6;
    var cte_circunferencia = 0.70;
    var lado_cajon = 0.135;

    var radio_equina = lado / 2 - lado_cajon / 2;
    // cajon derecho
    curva.agregarSegmento(
        [centro[0] + lado / 2, centro[1] - lado_cajon / 2],
        [centro[0] + lado / 2 - lado_cajon, centro[1] - lado_cajon / 2]
    );
    curva.agregarSegmento(
        [centro[0] + lado / 2 - lado_cajon, centro[1] - lado_cajon / 2],
        [centro[0] + lado / 2 - lado_cajon, centro[1] + lado_cajon / 2]
    );
    curva.agregarSegmento(
        [centro[0] + lado / 2 - lado_cajon, centro[1] + lado_cajon / 2],
        [centro[0] + lado / 2, centro[1] + lado_cajon / 2]
    );

    // cuarto arriba-der
    curva.agregarCurvaCubica(
        [centro[0] + lado / 2, centro[1] + lado_cajon / 2],
        [centro[0] + lado / 2, centro[1] + lado_cajon / 2 + radio_equina * cte_circunferencia],
        [centro[0] + lado_cajon / 2 + radio_equina * cte_circunferencia, centro[1] + lado / 2],
        [centro[0] + lado_cajon / 2, centro[1] + lado / 2]
    );

    // cajon arriba
    curva.agregarSegmento(
        [centro[0] + lado_cajon / 2, centro[1] + lado / 2],
        [centro[0] + lado_cajon / 2, centro[1] + lado / 2 - lado_cajon]
    );
    curva.agregarSegmento(
        [centro[0] + lado_cajon / 2, centro[1] + lado / 2 - lado_cajon],
        [centro[0] - lado_cajon / 2, centro[1] + lado / 2 - lado_cajon]
    );
    curva.agregarSegmento(
        [centro[0] - lado_cajon / 2, centro[1] + lado / 2 - lado_cajon],
        [centro[0] - lado_cajon / 2, centro[1] + lado / 2]
    );

    // cuarto arriba-izq
    curva.agregarCurvaCubica(
        [centro[0] - lado_cajon / 2, centro[1] + lado / 2],
        [centro[0] - lado_cajon / 2 - radio_equina * cte_circunferencia, centro[1] + lado / 2],
        [centro[0] - lado / 2, centro[1] + lado_cajon / 2 + radio_equina * cte_circunferencia],
        [centro[0] - lado / 2, centro[1] + lado_cajon / 2]
    );

    //cajon derecha
    curva.agregarSegmento(
        [centro[0] - lado / 2, centro[1] + lado_cajon / 2],
        [centro[0] - lado / 2 + lado_cajon, centro[1] + lado_cajon / 2]
    );
    curva.agregarSegmento(
        [centro[0] - lado / 2 + lado_cajon, centro[1] + lado_cajon / 2],
        [centro[0] - lado / 2 + lado_cajon, centro[1] - lado_cajon / 2]
    );
    curva.agregarSegmento(
        [centro[0] - lado / 2 + lado_cajon, centro[1] - lado_cajon / 2],
        [centro[0] - lado / 2, centro[1] - lado_cajon / 2]
    );

    // cuarto abajo-izq
    curva.agregarCurvaCubica(
        [centro[0] - lado / 2, centro[1] - lado_cajon / 2],
        [centro[0] - lado / 2, centro[1] - lado_cajon / 2 - radio_equina * cte_circunferencia],
        [centro[0] - lado_cajon / 2 - radio_equina * cte_circunferencia, centro[1] - lado / 2],
        [centro[0] - lado_cajon / 2, centro[1] - lado / 2]
    );

    // cajon abajo
    curva.agregarSegmento(
        [centro[0] - lado_cajon / 2, centro[1] - lado / 2],
        [centro[0] - lado_cajon / 2, centro[1] - lado / 2 + lado_cajon]
    );
    curva.agregarSegmento(
        [centro[0] - lado_cajon / 2, centro[1] - lado / 2 + lado_cajon],
        [centro[0] + lado_cajon / 2, centro[1] - lado / 2 + lado_cajon]
    );
    curva.agregarSegmento(
        [centro[0] + lado_cajon / 2, centro[1] - lado / 2 + lado_cajon],
        [centro[0] + lado_cajon / 2, centro[1] - lado / 2]
    );

    // cuarto abajo-der
    curva.agregarCurvaCubica(
        [centro[0] + lado_cajon / 2, centro[1] - lado / 2],
        [centro[0] + lado_cajon / 2 + radio_equina * cte_circunferencia, centro[1] - lado / 2],
        [centro[0] + lado / 2, centro[1] - lado_cajon / 2 - radio_equina * cte_circunferencia],
        [centro[0] + lado / 2, centro[1] - lado_cajon / 2]
    );
    return curva;
}


function generarB4() {
    var centro = [0, 0];
    var altura = 0.6;
    var ancho = 0.5;
    var cte_circunferencia = 0.5519;
    var curva = new Curva();

    // dibujar lado derecho
    curva.agregarSegmento(
        [centro[0] + ancho / 2, centro[1] - altura / 2],
        [centro[0] + ancho / 2, centro[1] + altura / 2]
    );

    // semicirculo de arriba
    curva.agregarCurvaCubica(
        [centro[0] + ancho / 2, centro[1] + altura / 2],
        [centro[0] + ancho / 2, centro[1] + altura / 2 + (ancho / 2) * cte_circunferencia],
        [centro[0] + (ancho / 2) * cte_circunferencia, centro[1] + altura / 2 + ancho / 2],
        [centro[0], centro[1] + altura / 2 + ancho / 2]
    );
    curva.agregarCurvaCubica(
        [centro[0], centro[1] + altura / 2 + ancho / 2],
        [centro[0] - (ancho / 2) * cte_circunferencia, centro[1] + altura / 2 + ancho / 2],
        [centro[0] - ancho / 2, centro[1] + altura / 2 + (ancho / 2) * cte_circunferencia],
        [centro[0] - ancho / 2, centro[1] + altura / 2]
    );

    // lado izquierdo
    curva.agregarSegmento(
        [centro[0] - ancho / 2, centro[1] + altura / 2],
        [centro[0] - ancho / 2, centro[1] - altura / 2],
    );

    // semicirculo de abajo
    curva.agregarCurvaCubica(
        [centro[0] - ancho / 2, centro[1] - altura / 2],
        [centro[0] - ancho / 2, centro[1] - altura / 2 - (ancho / 2) * cte_circunferencia],
        [centro[0] - (ancho / 2) * cte_circunferencia, centro[1] - altura / 2 - ancho / 2],
        [centro[0], centro[1] - altura / 2 - ancho / 2]
    );
    curva.agregarCurvaCubica(
        [centro[0], centro[1] - altura / 2 - ancho / 2],
        [centro[0] + (ancho / 2) * cte_circunferencia, centro[1] - altura / 2 - ancho / 2],
        [centro[0] + ancho / 2, centro[1] - altura / 2 - (ancho / 2) * cte_circunferencia],
        [centro[0] + ancho / 2, centro[1] - altura / 2]
    );
    return curva;
}


function generarA1(altura) {
    var curva = new Curva();
    const ancho = 0.8;

    // segmento horizontal
    curva.agregarSegmento(
        [0, 0],
        [ancho * 1, 0],
    );
    // segmento vertical 
    curva.agregarSegmento(
        [ancho * 1, 0],
        [ancho * 1, altura * 0.5],
        0.5
    );
    // curva interna
    curva.agregarCurvaCubica(
        [ancho * 1, altura * 0.5],
        [ancho * 1, altura * 0.7],
        [ancho * 0.2, altura * 0.7],
        [ancho * 0.4, altura * 1]
    );
    // curva 
    curva.agregarCurvaCubica(
        [ancho * 0.4, altura * 1],
        [ancho * 1, altura * 1.5],
        [ancho * 1, altura * 2.1],
        [ancho * 0.4, altura * 2.6]
    );
    // segunda curva interna
    curva.agregarCurvaCubica(
        [ancho * 0.4, altura * 2.6],
        [ancho * 0.2, altura * 2.9],
        [ancho * 1, altura * 2.9],
        [ancho * 1, altura * 3.1],
    );
    // segmento vertical
    curva.agregarSegmento(
        [ancho * 1, altura * 3.1],
        [ancho * 1, altura * 3.6],
        0.5
    );
    // segmento horizontal
    curva.agregarSegmento(
        [ancho * 1, altura * 3.6],
        [ancho * 0, altura * 3.6]
    );
    return curva;
}


function generarA2(altura) {
    var curva = new Curva();
    var ancho = 0.6;
    curva.agregarCurvaCubica(
        [0, 0],
        [-ancho * 1, 0],
        [-ancho * 0.2, -altura * 0.7],
        [-ancho * 0.25, -altura * 0.9]
    );
    // curva 
    curva.agregarCurvaCubica(
        [-ancho * 0.25, -altura * 0.9],
        [-ancho * 0.4, -altura * 1.5],
        [-ancho * 0.8, -altura * 2.1],
        [-ancho * 0.4, -altura * 2.2]
    );
    // segunda curva interna
    curva.agregarCurvaCubica(
        [-ancho * 0.4, -altura * 2.2],
        [-ancho * 0.4, -altura * 2.3],
        [-ancho * 0.4, -altura * 2.35],
        [-ancho * 0.45, -altura * 2.4],
        0.5
    );
    return curva;
}

function generarA3(altura) {
    var curva = new Curva();
    const ancho = 0.003;
    altura *= 0.005;
    // segmento horizontal
    curva.agregarSegmento(
        [0, 0],
        [ancho * 120, 0]
    );
    // segmento diagonal 
    curva.agregarSegmento(
        [ancho * 120, 0],
        [ancho * 40, altura * 40]
    );
    // segmento vertical
    curva.agregarSegmento(
        [ancho * 40, altura * 40],
        [ancho * 40, altura * 60],
        0.2
    );
    // curva
    curva.agregarCurvaCubica(
        [ancho * 40, altura * 60],
        [ancho * 90, altura * 80],
        [ancho * 100, altura * 90],
        [ancho * 100, altura * 110],
    );
    // segmento vertical
    curva.agregarSegmento(
        [ancho * 100, altura * 110],
        [ancho * 100, altura * 130],
        0.5
    );
    // curva 
    curva.agregarCurvaCubica(
        [ancho * 100, altura * 130],
        [ancho * 100, altura * 160],
        [ancho * 80, altura * 170],
        [ancho * 60, altura * 170],
    );
    // segunda curva interna
    curva.agregarCurvaCubica(
        [ancho * 60, altura * 170],
        [ancho * 40, altura * 170],
        [ancho * 40, altura * 180],
        [ancho * 35, altura * 190],
    );
    return curva;
}

function generarA4(altura) {
    var curva = new Curva();
    const ancho = 0.008;
    altura *= 0.008;

    curva.agregarSegmento(
        [0, 0],
        [ancho * 25, 0]
    );
    // curva
    curva.agregarCurvaCubica(
        [ancho * 25, 0],
        [ancho * 40, 0],
        [ancho * 50, 40 * altura],
        [ancho * 20, 50 * altura],
        0.05
    );
    // curva 
    curva.agregarCurvaCubica(
        [ancho * 20, 50 * altura],
        [ancho * 12, 55 * altura],
        [ancho * 10, 60 * altura],
        [ancho * 10, 80 * altura],
    );
    // segunda curva interna
    curva.agregarCurvaCubica(
        [ancho * 10, 80 * altura],
        [ancho * 10, 90 * altura],
        [ancho * 30, 98 * altura],
        [ancho * 45, 100 * altura],
    );
    // segunda curva interna
    curva.agregarCurvaCubica(
        [ancho * 45, 100 * altura],
        [ancho * 30, 102 * altura],
        [ancho * 20, 110 * altura],
        [ancho * 20, 120 * altura],
    );

    curva.agregarCurvaCubica(
        [ancho * 20, 120 * altura],
        [ancho * 20, 140 * altura],
        [ancho * 10, 150 * altura],
        [0, 150 * altura],
    );

    return curva;
}

function generarCurvaRueda(radio, ancho) {
    var curva = new Curva();
    var inicio = [0, 0];
    var radio = radio;
    var desnivel_tapa = radio / 8;
    var ancho_goma = radio / 4;
    var ancho_desnivel = radio / 6;
    // tapa inferior
    curva.agregarSegmento(
        inicio,
        [inicio[0] + radio, inicio[1]]
    );
    // borde 
    curva.agregarSegmento(
        [inicio[0] + radio, inicio[1]],
        [inicio[0] + radio, inicio[1] + ancho]
    );
    // borde recto
    curva.agregarSegmento(
        [inicio[0] + radio, inicio[1] + ancho],
        [inicio[0] + radio - ancho_goma, inicio[1] + ancho],
    );
    // diagonal interna
    curva.agregarSegmento(
        [inicio[0] + radio - ancho_goma, inicio[1] + ancho],
        [inicio[0] + radio - ancho_goma - ancho_desnivel, inicio[1] + ancho - desnivel_tapa],
    );
    // tapa superior
    curva.agregarSegmento(
        [inicio[0] + radio - ancho_goma - ancho_desnivel, inicio[1] + ancho - desnivel_tapa],
        [inicio[0], inicio[1] + ancho - desnivel_tapa],
    );
    return curva;
}

function generarCurvaImpresora(radio, ancho) {
    var curva = new Curva();
    var inicio = [0, 0];
    var radio = radio;
    var desnivel_tapa = radio / 10;
    var ancho_goma = radio / 4;
    var ancho_desnivel = radio / 10;
    const deltaU = 0.5;
    // tapa inferior
    curva.agregarSegmento(
        inicio,
        [inicio[0] + radio, inicio[1]],
        deltaU
    );
    // borde 
    curva.agregarSegmento(
        [inicio[0] + radio, inicio[1]],
        [inicio[0] + radio, inicio[1] + ancho - desnivel_tapa],
        deltaU
    );
    // diagonal externa 
    curva.agregarSegmento(
        [inicio[0] + radio, inicio[1] + ancho - desnivel_tapa],
        [inicio[0] + radio - ancho_desnivel, inicio[1] + ancho],
        deltaU
    );
    // borde recto
    curva.agregarSegmento(
        [inicio[0] + radio - ancho_desnivel, inicio[1] + ancho],
        [inicio[0] + radio - ancho_goma, inicio[1] + ancho],
        deltaU
    );
    // diagonal interna
    curva.agregarSegmento(
        [inicio[0] + radio - ancho_goma, inicio[1] + ancho],
        [inicio[0] + radio - ancho_goma - ancho_desnivel, inicio[1] + ancho - desnivel_tapa],
        deltaU
    );
    // tapa superior
    curva.agregarSegmento(
        [inicio[0] + radio - ancho_goma - ancho_desnivel, inicio[1] + ancho - desnivel_tapa],
        [inicio[0], inicio[1] + ancho - desnivel_tapa],
        deltaU
    );
    return curva;
}

function generarCurvaGalpon(alto, ancho) {
    var curva = new Curva();
    var centro = [0, 0];
    var cte_circunferencia = 0.55;
    var radio = (alto + ancho) / 4;

    // techo
    curva.agregarCurvaCubica(
        [centro[0] + ancho / 2, centro[1] + alto],
        [centro[0] + ancho / 2 - radio * cte_circunferencia, centro[1] + alto + radio * cte_circunferencia],
        [centro[0] - ancho / 2 + radio * cte_circunferencia, centro[1] + alto + radio * cte_circunferencia],
        [centro[0] - ancho / 2, centro[1] + alto],
        0.1
    );
    return curva;
}


function generarCurvaChasis(ancho, largo) {
    var curva = new Curva();
    var centro = [0, 0];
    var cola = ancho * 0.3;

    // dibujar lado derecho
    curva.agregarSegmento(
        [centro[0] + ancho / 2, centro[1] - largo / 2],
        [centro[0] + ancho / 2, centro[1] + largo / 2]
    );

    // parte de arriba
    curva.agregarSegmento(
        [centro[0] + ancho / 2, centro[1] + largo / 2],
        [centro[0] + ancho / 2 - cola, centro[1] + largo / 2 + cola],
    );
    curva.agregarSegmento(
        [centro[0] + ancho / 2 - cola, centro[1] + largo / 2 + cola],
        [centro[0] - ancho / 2 + cola, centro[1] + largo / 2 + cola],
    );
    curva.agregarSegmento(
        [centro[0] - ancho / 2 + cola, centro[1] + largo / 2 + cola],
        [centro[0] - ancho / 2, centro[1] + largo / 2],
    );

    // lado izquierdo
    curva.agregarSegmento(
        [centro[0] - ancho / 2, centro[1] + largo / 2],
        [centro[0] - ancho / 2, centro[1] - largo / 2]
    );

    // parte de abajo
    curva.agregarSegmento(
        [centro[0] - ancho / 2, centro[1] - largo / 2],
        [centro[0] - ancho / 2 + cola, centro[1] - largo / 2 - cola],
    );
    curva.agregarSegmento(
        [centro[0] - ancho / 2 + cola, centro[1] - largo / 2 - cola],
        [centro[0] + ancho / 2 - cola, centro[1] - largo / 2 - cola],
    );
    curva.agregarSegmento(
        [centro[0] + ancho / 2 - cola, centro[1] - largo / 2 - cola],
        [centro[0] + ancho / 2, centro[1] - largo / 2],
    );

    return curva;
}


function generarTrapecio(base1, base2, largo) {
    var curva = new Curva();
    curva.agregarSegmento(
        [0, 0],
        [base2, 0],
        0.5
    );
    curva.agregarSegmento(
        [base2, 0],
        [base1, largo],
        0.5
    );
    curva.agregarSegmento(
        [base1, largo],
        [0, largo],
        0.5
    );
    curva.agregarSegmento(
        [0, largo],
        [0, 0],
        0.5
    );

    return curva;
}

export { generarA1, generarA2, generarA3, generarA4, generarB1, generarB2, generarB3, generarB4, generarCurvaChasis, generarCurvaGalpon, generarCurvaRueda, generarCurvaImpresora, generarTrapecio };