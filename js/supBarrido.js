import {vec3} from 'https://cdn.skypack.dev/gl-matrix';

class SupBarrido {
    constructor(curva, altura, torsion) {
        this.curva = curva
        this.altura = altura
        this.torsion = torsion //angulo en radianes
    }

    getPos(u, v) {
        var tope = this.curva.length/2 - 1
        var index = Math.floor(u * tope) // hay muchos vertices repetidos, resultan en triangulos colapsados. Que pasa con las normales?
        var angulo = this.torsion * v;
        var x = this.curva[index*2];
        var z = this.curva[index*2+1];
        var y = (v - 0.5) * this.altura 

        // rotacion alrededor del eje y con angulo de torsion
        x = Math.cos(angulo)*x - Math.sin(angulo)*z
        z = Math.sin(angulo)*x + Math.cos(angulo)*z
        return [x,y,z]
    }

    getNormal(u, v) {
        // Normal estimada. Revisar triangulos colapsados.
        var p=this.getPos(u,v);
        var v=vec3.create();
        vec3.normalize(v,p);

        var delta=0.05;
        var p1=this.getPos(u,v);
        var p2=this.getPos(u,v+delta);
        var p3=this.getPos(u+delta,v);

        var v1=vec3.fromValues(p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]);
        var v2=vec3.fromValues(p3[0]-p1[0],p3[1]-p1[1],p3[2]-p1[2]);

        vec3.normalize(v1,v1);
        vec3.normalize(v2,v2);
        
        var n=vec3.create();
        vec3.cross(n,v1,v2);
        vec3.scale(n,n,-1);
        return n;
    }
} 

export {SupBarrido};