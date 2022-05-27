import {vec3} from 'https://cdn.skypack.dev/gl-matrix';

class SupRevolucion {
    constructor(curva){
        this.curva = curva;
    }
    
    getPos(u, v) {
        var index = Math.floor(v * (this.curva.length/2 -1));
        u = u * 2 * Math.PI;
        var x = this.curva[index*2] * Math.sin(u);
        var z = this.curva[index*2] * Math.cos(u);
        var y = this.curva[index*2+1];
        return [x,y,z];
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

export {SupRevolucion}