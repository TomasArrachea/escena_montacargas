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

class Rectangulo {
    constructor(ancho, alto, largo){
        this.ancho = ancho;
        this.largo = largo;
        this.alto = alto;
    }

    getPos(u, v) {
        // asumo u,v numeros entre 0 y 1
        //TODO: chequear que esta bien el sentido de los angulos y el cos y sin.
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