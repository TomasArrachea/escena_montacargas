class SupGalpon {
    constructor(ancho, largo, alto){
        this.ancho = ancho;
        this.largo = largo;
        this.alto = alto;
    }
    
    getPos(u, v) {
        if (u < ancho/4)
        var x = (u-0.5)*ancho;
        var z = (v-0.5)*largo;
        return [x,0,z]
    }

    getNormal(u, v) {
        return [0,0,1]
    }
}

class Piso {
    constructor(ancho, largo){
        this.ancho = ancho;
        this.largo = largo;
    }

    getPos(u, v) {
        // asumo u,v numeros entre 0 y 1
        var x = (u-0.5)*ancho;
        var z = (v-0.5)*largo;
        return [x,0,z]
    }

    getNormal(u, v) {
        return [0,1,0]
    }
}

class Cubo {
    static generarSuperficie(ancho, alto, largo) {
        positionBuffer = [ //revisar orden de los vertices, deberia ser 
            [ancho/2,alto/2,largo/2],
            [-ancho/2,alto/2,largo/2],
            [ancho/2,-alto/2,largo/2],
            [-ancho/2,-alto/2,largo/2],
            [ancho/2,alto/2,largo/2],
            [-ancho/2,alto/2,largo/2],
            [ancho/2,-alto/2,largo/2],
            [-ancho/2,-alto/2,largo/2],
            [ancho/2,alto/2,largo/2],
            [-ancho/2,alto/2,largo/2],
            [ancho/2,-alto/2,largo/2],
            [-ancho/2,-alto/2,largo/2],
            [-ancho/2,-alto/2,-largo/2],
            [-ancho/2,alto/2,-largo/2],
            [ancho/2,alto/2,-largo/2],
            [-ancho/2,-alto/2,-largo/2],
            [ancho/2,alto/2,largo/2],
            [-ancho/2,alto/2,largo/2],
            [ancho/2,-alto/2,largo/2],
            [-ancho/2,-alto/2,largo/2],
            [-ancho/2,-alto/2,-largo/2],
            [-ancho/2,alto/2,-largo/2],
            [ancho/2,alto/2,-largo/2],
            [-ancho/2,-alto/2,-largo/2],
        ];

        // cada cara tiene sus 4 vertices con sus 4 normales. Asi que hay 24 vertices y 24 normales.
        normalBuffer = [ // completar normales, tener en cuenta que hay que hay que repetir vertices para que tengan dos normales. Ver video campus matriz de normales
            [1,0,0],
            [1,0,0],
            [1,0,0],
            [1,0,0],
            [-1,0,0],
            [-1,0,0],
            [-1,0,0],
            [-1,0,0],
            [0,1,0],
            [0,1,0],
            [0,1,0],
            [0,1,0],
            [0,-1,0],
            [0,-1,0],
            [0,-1,0],
            [0,-1,0],
            [0,0,1],
            [0,0,1],
            [0,0,1],
            [0,0,1],
            [0,0,-1],
            [0,0,-1],
            [0,0,-1],
            [0,0,-1]
        ]

        indexBuffer = [1,2,3,4] //puedo usar el mismo algoritmo de antes? solo tengo que ordenar los vertices para generar strip triangles.
        // que serian aca las filas y columnas?


        webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);
        webgl_position_buffer.itemSize = 3;
        webgl_position_buffer.numItems = positionBuffer.length / 3;
    
        webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);
        webgl_normal_buffer.itemSize = 3;
        webgl_normal_buffer.numItems = normalBuffer.length / 3;
    
        webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);
        webgl_index_buffer.itemSize = 1;
        webgl_index_buffer.numItems = indexBuffer.length;
    
/*
        vertices = [
            [0.5,0.5,0.5],
            [-0.5,0.5,0.5],
            [0.5,-0.5,0.5],
            [-0.5,-0.5,0.5],
            [-0.5,-0.5,-0.5],
            [-0.5,0.5,-0.5],
            [0.5,0.5,-0.5],
            [-0.5,-0.5,-0.5],
        ];
*/
        return {
            webgl_position_buffer,
            webgl_normal_buffer,
            webgl_index_buffer
        }
    }
    getPos(u, v) {
        // asumo u,v numeros entre 0 y 1
        //TODO: chequear que esta bien el sentido de los angulos y el cos y sin.

        // no tiene sentido generar un cubo con tantos puntos. Genero uno basico con 4 vertices por lado y lo escalo con alto, largo, ancho
        // puedo hacerlo sin usar el algoritmo de grilla, solo con los 8 puntos. El algoritmo llena los buffers 

        // en realidad hay que 'duplicar' los vertices para las normales
        var x = 0,
            z = 0;
        u = u * Math.PI * 2
        if (u < Math.PI/4) {
            x = ancho/2;
            z = Math.tan(u)*ancho/2;
        } else if (u < Math.PI*3/4) {
            x = (1/Math.tan(u))*ancho/2;
            z = ancho/2;
        } else if (u < Math.PI*5/4) {
            x = Math.tan(u)*ancho/2;
            z = -ancho/2;
        } else if (u < Math.PI*7/4) {
            x = -ancho/2;
            z = (1/Math.tan(u))*ancho/2;
        } else if (u < 2*Math.PI) {
            x = ancho/2;
            z = (1/Math.tan(u))*ancho/2;
        } 
        var y = largo * (v - 0.5);
        return [x,y,z];
    }

    getNormal(u, v) {
        return [0,1,0]
    }
}