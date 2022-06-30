class SupPiso {
    constructor(ancho, largo) {
        this.ancho = ancho;
        this.largo = largo;
    }

    getPos(u, v) {
        // asumo u,v numeros entre 0 y 1
        var x = (u - 0.5) * this.ancho;
        var z = (v - 0.5) * this.largo;
        return [x, 0, z]
    }

    getNormal(u, v) {
        return [0, 1, 0]
    }

    getCoordenadasTextura(u, v) {
        return [u, v];
    }
}

class SupCubo {
    static generarSuperficie(x, y, z) {
        var positionBuffer = [
            x / 2, y / 2, z / 2,
            x / 2, -y / 2, z / 2,
            x / 2, y / 2, -z / 2,
            x / 2, -y / 2, -z / 2,

            x / 2, y / 2, -z / 2,
            -x / 2, y / 2, -z / 2,
            x / 2, -y / 2, -z / 2,
            -x / 2, -y / 2, -z / 2,

            x / 2, y / 2, z / 2,
            -x / 2, y / 2, z / 2,
            x / 2, -y / 2, z / 2,
            -x / 2, -y / 2, z / 2,

            -x / 2, y / 2, z / 2,
            -x / 2, -y / 2, z / 2,
            -x / 2, y / 2, -z / 2,
            -x / 2, -y / 2, -z / 2,

            x / 2, y / 2, z / 2,
            x / 2, y / 2, -z / 2,
            -x / 2, y / 2, z / 2,
            -x / 2, y / 2, -z / 2,

            x / 2, -y / 2, z / 2,
            x / 2, -y / 2, -z / 2,
            -x / 2, -y / 2, z / 2,
            -x / 2, -y / 2, -z / 2,

        ];
        var normalBuffer = [
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,

            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,

            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,

            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,

            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,

            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
        ];

        var indexBuffer = [
            0, 1, 2, 2, 1, 3,
            4, 5, 6, 6, 5, 7,
            8, 9, 10, 10, 9, 11,
            12, 13, 14, 14, 13, 15,
            16, 17, 18, 18, 17, 19,
            20, 21, 22, 22, 21, 23
        ];

        var uvBuffer = [
            // Front
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Back
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Top
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Bottom
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Right
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Left
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0
        ];

        return {
            positionBuffer,
            normalBuffer,
            indexBuffer,
            uvBuffer
        }
    }
}


class Cilindro {
    constructor(radio, largo) {
        this.radio = radio;
        this.largo = largo;
    }

    getPos(u, v) {
        u = u * 2 * Math.PI
        var y = this.largo * v;
        var x = this.radio * Math.sin(u);
        var z = this.radio * Math.cos(u);
        return [x, y, z];
    }

    getNormal(u, v) {
        // En x,z la normal es igual al vector de posicion normalizado.
        var pos = this.getPos(u, v);
        var modulo = Math.sqrt(pos[0] ** 2 + pos[1] ** 2)
        return [pos[0] / modulo, 0, pos[1] / modulo];
    }

    getCoordenadasTextura(u, v) {
        return [u, v];
    }
}


export { Cilindro, SupCubo, SupPiso };