class SupRevolucion {
    constructor(curva, radio) {
        this.puntos = curva.puntos;
        this.radio = radio;
        this.topePuntos = this.puntos.length / 2 - 1;
        this.normales = curva.normales;
        this.topeNormales = this.normales.length / 2 - 1;
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
        return [x, y, z];
    }
}

export { SupRevolucion }