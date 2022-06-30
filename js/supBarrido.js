class SupBarrido {
    constructor(curva, altura, torsion, tieneTapas = false) {
        this.puntos = curva.puntos;
        this.topePuntos = this.puntos.length / 2 - 1;
        this.normales = curva.normales;
        this.topeNormales = this.normales.length / 2 - 1;
        this.altura = altura;
        this.torsion = torsion; //angulo en radianes
        this.tieneTapas = tieneTapas;
    }

    getPos(u, v) {
        if (this.tieneTapas) { // las impresiones tienen la base en el y = 0
            var y = (v - 0.5) * this.altura;
        } else {
            var y = v * this.altura;
        }
        var index = Math.floor(u * this.topePuntos) // hay muchos vertices repetidos, resultan en triangulos colapsados. Que pasa con las normales?
        var x = this.puntos[index * 2];
        var z = this.puntos[index * 2 + 1];

        // rotacion alrededor del eje y con angulo de torsion
        var angulo = v * this.torsion * Math.PI / 180;
        x = Math.cos(angulo) * x - Math.sin(angulo) * z;
        z = Math.sin(angulo) * x + Math.cos(angulo) * z;
        return [x, y, z];
    }

    getNormal(u, v) {
        var index = Math.floor(u * this.topeNormales)
        var x = this.normales[index * 2];
        var z = this.normales[index * 2 + 1];

        var angulo = this.torsion * v * Math.PI / 180;
        x = Math.cos(angulo) * x - Math.sin(angulo) * z;
        z = Math.sin(angulo) * x + Math.cos(angulo) * z;
        return [x, 0, z];
    }

    getCoordenadasTextura(u, v) {
        return [u, v];
    }
}

export { SupBarrido };