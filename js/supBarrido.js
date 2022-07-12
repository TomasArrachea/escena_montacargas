import { mat4, vec3, vec4, vec2 } from 'https://cdn.skypack.dev/gl-matrix';

class SupBarrido {
    constructor(curva, altura, torsion = 0, esImpresion = false, filas = 20, columnas = 20) {
        this.puntos = curva.puntos;
        this.topePuntos = this.puntos.length / 2 - 1;
        this.normales = curva.normales;
        this.topeNormales = this.normales.length / 2 - 1;
        this.altura = altura;
        this.torsion = torsion; //angulo en radianes
        this.esImpresion = esImpresion; // si es impresion, la base esta en el eje y = 0 y no tiene tapas
        this.filas = filas;
        this.columnas = columnas;
        this.matrizRotacion = mat4.create();
    }

    getPos(u, v) {
        if (!this.esImpresion) {
            v = v - 0.5; // base en el eje y = 0
        }
        var y = v * this.altura;
        var index = Math.floor(u * this.topePuntos) // hay muchos vertices repetidos, resultan en triangulos colapsados. Que pasa con las normales?
        var x = this.puntos[index * 2];
        var z = this.puntos[index * 2 + 1];

        if (!this.esImpresion) {
            // tapas
            if (v == -0.5) {
                y = -0.5 * this.altura;
                z = 0;
            } else if (v == 1 / this.filas - 0.5) {
                y = -0.5 * this.altura;
            } else if (v == 2 / this.filas - 0.5) {
                y = -0.5 * this.altura;
            } else if (v == (this.filas - 2) / this.filas - 0.5) {
                y = 0.5 * this.altura;
            } else if (v == (this.filas - 1) / this.filas - 0.5) {
                y = 0.5 * this.altura;
            } else if (v == 0.5) {
                y = 0.5 * this.altura;
                z = 0;
            }
        }

        // rotacion alrededor del eje y con angulo de torsion
        var angulo = v * this.torsion * (Math.PI / 180);
        mat4.fromRotation(this.matrizRotacion, angulo, vec3.fromValues(0, 1, 0));
        var pos = vec3.fromValues(x, y, z);
        vec3.transformMat4(pos, pos, this.matrizRotacion);
        
        return [pos[0], pos[1], pos[2]];
    }
    
    getNormal(u, v) {
        var index = Math.floor(u * this.topeNormales)
        var x = this.normales[index * 2];
        var y = 0;
        var z = this.normales[index * 2 + 1];

        var angulo = this.torsion * v * Math.PI / 180;
        var pos = vec3.fromValues(x, y, z);
        mat4.fromRotation(this.matrizRotacion, angulo, vec3.fromValues(0, 1, 0));
        vec3.transformMat4(pos, pos, this.matrizRotacion);
        
        return [pos[0], pos[1], pos[2]];
    }

    getCoordenadasTextura(u, v) {
        // if (v == 0) {
        //     return [0, 0.5];
        // } else if (v == 1 / this.filas) {
        //     return [0, -1];
        // } else if (as) {

        // } else if (as) {

        // } else if (v == (this.filas - 1) / this.filas) {
        //     return [0, 1];
        // } else if (v == 1) {
        //     return [0, 1];
        // }
        return [u, v];
    }
}

export { SupBarrido };