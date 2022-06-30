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

    agregarSegmento(p0, p1) {
        var deltaU = 1;
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
        var deltaU = 0.01;
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

    agregarCurvaCubica(p0, p1, p2, p3) {
        var deltaU = 0.01;
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
    var puntos = [[-0.29, -0.5], [-0.29, 0.5], [0.57, 0], [-0.29, -0.5]]; // triangulo con centro en 0,0

    var curva = new Curva();
    for (var i = puntos.length -1; i > 0; i--) {
        curva.agregarSegmento(puntos[i], puntos[i - 1]);
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
    curva.agregarCurvaCubica(
        [centro[0] + ancho / 2, centro[1] - altura / 2],
        [centro[0] + ancho / 2, centro[1]],
        [centro[0] + ancho / 2, centro[1]],
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
    curva.agregarCurvaCubica(
        [centro[0] - ancho / 2, centro[1] - altura / 2],
        [centro[0] - ancho / 2, centro[1]],
        [centro[0] - ancho / 2, centro[1]],
        [centro[0] - ancho / 2, centro[1] + altura / 2]
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


function generarA1() {
    var inicio = [0, 0];
    var curva = new Curva();

    // segmento horizontal
    curva.agregarSegmento(
        inicio,
        [inicio[0] - 1.2, inicio[1]]
    );
    // segmento vertical 
    curva.agregarSegmento(
        [inicio[0] - 1.2, inicio[1]],
        [inicio[0] - 1.2, inicio[1] - 0.5]
    );
    // curva interna
    curva.agregarCurvaCubica(
        [inicio[0] - 1.2, inicio[1] - 0.5],
        [inicio[0] - 1, inicio[1] - 0.7],
        [inicio[0] - 0.2, inicio[1] - 0.7],
        [inicio[0] - 0.4, inicio[1] - 0.9]
    );
    // curva 
    curva.agregarCurvaCubica(
        [inicio[0] - 0.4, inicio[1] - 0.90],
        [inicio[0] - 1.20, inicio[1] - 1.50],
        [inicio[0] - 1.20, inicio[1] - 2.10],
        [inicio[0] - 0.40, inicio[1] - 2.70]
    );
    // segunda curva interna
    curva.agregarCurvaCubica(
        [inicio[0] - 0.40, inicio[1] - 2.70],
        [inicio[0] - 0.20, inicio[1] - 2.90],
        [inicio[0] - 1, inicio[1] - 2.90],
        [inicio[0] - 1.20, inicio[1] - 3.10],
    );
    // segmento vertical
    curva.agregarSegmento(
        [inicio[0] - 1.20, inicio[1] - 3.10],
        [inicio[0] - 1.20, inicio[1] - 3.60]
    );
    // segmento horizontal
    curva.agregarSegmento(
        [inicio[0] - 1.20, inicio[1] - 3.60],
        [inicio[0], inicio[1] - 3.60]
    );
    return curva;
}


function generarA2() {
    var inicio = [0, 0];
    var curva = new Curva();

    curva.agregarCurvaCubica(
        [inicio[0], inicio[1]],
        [inicio[0] - 1, inicio[1]],
        [inicio[0] - 0.20, inicio[1] - 0.70],
        [inicio[0] - 0.25, inicio[1] - 0.90]
    );
    // curva 
    curva.agregarCurvaCubica(
        [inicio[0] - 0.25, inicio[1] - 0.90],
        [inicio[0] - 0.40, inicio[1] - 1.50],
        [inicio[0] - 0.80, inicio[1] - 2.10],
        [inicio[0] - 0.40, inicio[1] - 2.20]
    );
    // segunda curva interna
    curva.agregarCurvaCubica(
        [inicio[0] - 0.40, inicio[1] - 2.20],
        [inicio[0] - 0.40, inicio[1] - 2.30],
        [inicio[0] - 0.40, inicio[1] - 2.35],
        [inicio[0] - 0.50, inicio[1] - 2.40]
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


function generarCurvaGalpon(alto, ancho) {
    var curva = new Curva();
    var centro = [0, 0];
    var cte_circunferencia = 0.55;
    var radio = (alto + ancho) / 4;

    // pared derecha
    curva.agregarSegmento(
        [centro[0] + ancho / 2, centro[1]],
        [centro[0] + ancho / 2, centro[1] + alto],
    );

    // techo
    curva.agregarCurvaCubica(
        [centro[0] + ancho / 2, centro[1] + alto],
        [centro[0] + ancho / 2 - radio * cte_circunferencia, centro[1] + alto + radio * cte_circunferencia],
        [centro[0] - ancho / 2 + radio * cte_circunferencia, centro[1] + alto + radio * cte_circunferencia],
        [centro[0] - ancho / 2, centro[1] + alto],
    );
    // pared izquierda
    curva.agregarSegmento(
        [centro[0] - ancho / 2, centro[1] + alto],
        [centro[0] - ancho / 2, centro[1]],
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
    );
    curva.agregarSegmento(
        [base2, 0],
        [base1, largo],
    );
    curva.agregarSegmento(
        [base1, largo],
        [0, largo],
    );
    curva.agregarSegmento(
        [0, largo],
        [0, 0],
    );

    return curva;
}

export { generarA1, generarA2, generarB1, generarB2, generarB3, generarB4, generarCurvaChasis, generarCurvaGalpon, generarCurvaRueda, generarTrapecio };