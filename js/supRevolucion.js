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
        // v = v * this.topeNormales;
        // la coord 0,0 está en el centro de la textura -> width/2, height/2
        // la coord 1,1 está en el borde derecho de la textura -> width, height

        // u recorre la circunferencia y v recorre el radio
        
        // recorrer en espiral la textura desde el centro, cada circunferencia es una fila de la superficie (v constante)
        // v recorre el angulo de la textura 0 a 2 pi, y u recorre el radio de la textura 0 a width (o height)
    
        let coordu = u; 
        u = u * 2 * Math.PI;
        let coordv = v * Math.cos(u);
        // console.log('u = '+ coordu + ' v = ' + coordv);
        return [coordu, coordv];
    }
}

export { SupRevolucion }