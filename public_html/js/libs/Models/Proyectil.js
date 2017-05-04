/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Proyectil=function(objectCollision){
    this.position = new THREE.Vector3(0.0,0.0, 0.0);
    this.rotation = new THREE.Vector3(0.0, 0.0, 0.0);
    this.scale = new THREE.Vector3(1.0, 1.0, 1.0);
    this.modelo;
    this.textura;
    this.colision;
    this.name;
    this.scene;
    this.rays=[];
    
    this.caster;
    this.objectCollision=objectCollision;
    
    this.Create();
};
Proyectil.prototype={
    Move:function(){
        this.position.z+=50;
        obje=this.scene.getObjectByName(this.modelo.name);
        obje.position.z=this.position.z;
        //this.position[2]-=.1;
//        this.Collision();
        
        
    },
    DetectarColision:function(Proyectil){
        
    },
    Delete:function(){
    obje=this.scene.getObjectByName(this.modelo.name);
    this.scene.remove(obje);
    
    },
    Create:function(){
        this.rays = [
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1)
        ];
        this.caster= new THREE.Raycaster();
        //this.objectCollision.push(this.modelo);
        
    },
    Collision:function(){
	for(var i=0;i<this.rays.length;i++){
            var ray = this.rays[i];
            this.caster.set(this.position,ray);
            var collision = this.caster.intersectObjects(this.objectCollision,true);
            if (collision.length>0&&collision[0].distance<10){
		console.log("colision");
                return collision[0].object;
            }
	}
    }
};