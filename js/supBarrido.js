import {vec3} from 'https://cdn.skypack.dev/gl-matrix';

class SupBarrido {
    constructor(curva, altura, torsion) {
        this.curva = curva
        this.altura = altura
        this.torsion = torsion //angulo en radianes
    }

    getPos(u, v) {
        // TODO: revisar que es mas util si u y v no vienen como angulos
        var index = (u/2*Math.PI) * (this.curva.length/2 -1) // revisar: seria mejor que para los segmentos lineales se elija siempre los extremos, sino se pierde mucha info. El parametro deberia usarse solo en las curvas cub y cuadr.
        var angulo = this.torsion * (v/Math.PI)
        var x = this.curva[index*2];
        var z = this.curva[index*2+1];
        var y = (v - 0.5) * this.altura 

        // rotacion alrededor del eje y
        x = Math.cos(angulo)*x - Math.sin(angulo)*y
        z = Math.sin(angulo)*x + Math.cos(angulo)*y
        return [x,y,z]
    }

    getNormal(u, v) {
        // Revisar, creo que calcula la normal con los puntos del triangulo haciendo prod vectorial. Es generico para todas las superficies? revisar triangulos colapsados
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
 

class SupRevolucion {
    // Sup de revolucion.
    constructor(curva){
        this.curva = curva;
    }
    
    getPos(u, v) {
        var index = (v/Math.PI) * (this.curva.length/2 -1)
        var x = this.curva[index*2] * Math.sin(u);
        var z = this.curva[index*2] * Math.cos(u);
        var y = this.curva[index*2+1]
        return [x,y,z]
    }

    getNormal(u, v) {
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

export {SupBarrido, SupRevolucion};