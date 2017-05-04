/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var Colision=function(){
    this.buffers = [];
    this.drawByIndex = false;
    this.isColorEnabled = false;
    this.position = vec3.fromValues(0.0, -1.0, -5.0);
    this.rotation = vec3.fromValues(0.0, 0.0, 0.0);
    this.scale = vec3.fromValues(1.0, 1.0, 1.0);
    this.color = vec4.fromValues(0.0, 1.0, 1.0, 1.0);
};

Colision.prototype={
    DetectarColision:function(a,b){
        return (a.minX <= b.maxX && a.maxX >= b.minX) &&
         (a.minY <= b.maxY && a.maxY >= b.minY) &&
         (a.minZ <= b.maxZ && a.maxZ >= b.minZ);
    }
};