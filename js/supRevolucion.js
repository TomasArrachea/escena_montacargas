class SupRevolucion {
    constructor(curva, filas = 10, columnas = 20) {
        this.puntos = curva.puntos;
        this.topePuntos = this.puntos.length / 2 - 1;
        this.normales = curva.normales;
        this.topeNormales = this.normales.length / 2 - 1;
        this.filas = filas;
        this.columnas = columnas;
    }

    getPos(u, v) {
        var index = Math.floor(v * this.topePuntos);
        u = u * 2 * Math.PI;
        var x = this.puntos[index * 2] * Math.sin(u);
        var z = this.puntos[index * 2] * Math.cos(u);
        var y = this.puntos[index * 2 + 1];
        return [x, y, z];
    }

    getNormal(u, v) {
        var index = Math.floor(v * this.topeNormales);
        u = u * 2 * Math.PI;
        var x = this.normales[index * 2] * Math.sin(u);
        var z = this.normales[index * 2] * Math.cos(u);
        var y = this.normales[index * 2 + 1];
        var modulo = Math.sqrt(x ** 2 + y ** 2 + z ** 2)
        return [x / modulo, y / modulo, z / modulo];
    }

    getCoordenadasTextura(u, v) {
        return [v,u];
    }
}

export { SupRevolucion }