import { mat4, vec3 } from 'https://cdn.skypack.dev/gl-matrix';

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

    normalizar(v) {
        var modulo = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2)
        if (modulo > 0) {
            v[0] = v[0] / modulo;
            v[1] = v[1] / modulo;
            v[2] = v[2] / modulo;
        }
        return v;
    }

    getNormal(u, v) {
        // ver como se resuelve en revolucion
        if (!this.esImpresion) {
            if (v == 0) {
                return [0, -1, 0];
            } else if (v == 1 / this.filas) {
                return [0, -1, 0];
            } else if (v == (this.filas - 1) / this.filas) {
                return [0, 1, 0];
            } else if (v == 1) {
                return [0, 1, 0];
            }
        }

        if (this.torsion != 0) {
            // calculo la normal aproximada segun los vertices vecinos
            var p0, p1, p2;
            p0 = this.getPos(u, v);
            p1 = this.getPos(u + 1/this.columnas, v);
            p2 = this.getPos(u, v + 1/this.filas);

            var vec1 = [p2[0]-p0[0], p2[1]-p0[1], p2[2]-p0[2]];
            var vec2 = [p0[0]-p1[0], p0[1]-p1[1], p0[2]-p1[2]];    

            var normal = vec3.create();
            vec3.cross(normal, vec2, vec1);
            var normal = this.normalizar(normal);
            return normal;
        }

        // normal exacta usando la normal de la curva
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
        return [u, v];
    }
}

export { SupBarrido };