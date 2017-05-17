/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var Jugador=function(modelPath,texturePath,scene,nombre,objectCollision,clone){
    this.position = new THREE.Vector3(0.0, 0, 0);
    this.rotation = new THREE.Vector3(0.0, 0.0, 0.0);
    this.scale = new THREE.Vector3(1, 1,1);
    this.modelo;
    this.textura;
    this.proyectil=[];
    this.scene=scene;
    this.name=nombre;
    this.objectCollision=objectCollision;
    if(clone==null){
        this.Create(modelPath,texturePath,this.scene,this.name,this.scale,this.position,this.rotation,this.objectCollision);
    }
    else{
        this.CreateClone(clone,this.scene,this.name,this.scale,this.position,this.rotation,this.objectCollision);
    }
        
};

Jugador.prototype={
      Move:function(x,y,z){
          obje=this.scene.getObjectByName(this.name);
          this.position.x+=x;
          this.position.y+=y;
          this.position.z+=z;
          obje.position.x=this.position.x;
          obje.position.y=this.position.y;
          obje.position.z=this.position.z;
    },
    Scale:function(sx,sy,sz){
          obje=this.scene.getObjectByName(this.name);
          obje.scale.x=sx;
          obje.scale.y=sy;
          obje.scale.z=sz;
        
    },
    Rotate:function(rx,ry,rz,ang){
        _ang=ang*(Math.PI/180);
        obje=this.scene.getObjectByName(this.name);
        obje.rotateOnAxis(new THREE.Vector3(rx,ry,rz),_ang);
    },
    GetObject3d:function(){
        return this.scene.getObjectByName(this.name);
    },
    Delete:function(){
    obje=this.scene.getObjectByName(this.name);
    this.scene.remove(obje);
    
    },
    
    Disparar:function(objectCollision){
      
    var _position = new THREE.Vector3(this.position.x,this.position.y,this.position.z);
    var geometry = new THREE.SphereGeometry( 10, 10, 10 );
    var material = new THREE.MeshBasicMaterial( {color:0xffffff,  overdraw: 0.5 } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.x=_position.x;
    mesh.position.y=_position.y;
    mesh.position.z=_position.z;
    //this.modelo=mesh;
    
    
      
      var _scale=new THREE.Vector3(.2,.2,.2);
      var bala=new Proyectil(objectCollision);
      
      bala.modelo=mesh;
      bala.modelo.name="time"+new Date().getTime();
      bala.position=_position;
      bala.scene=this.scene;
      bala.light.position.set(_position);
      this.proyectil.push(bala);
      this.scene.add(bala.modelo);
      //this.scene.add(bala.light);
      
    },
    Create:function(modelPath,texturePath,scene,name,scale,position,rotation,objectCollision){
                    var loader = new THREE.TextureLoader();
                    // load a resource
                   loader.load(
                            texturePath,
                            function ( texture ) {
                                    var material = new THREE.MeshPhongMaterial( {
                                            map: texture
                                     } );
                                            var loader = new THREE.OBJLoader();
                                            loader.load(

                                                    modelPath,

                                                    function ( object ) {
                                                                //object.position.z=-600;
                                                                object.scale.x=scale.x;
                                                                object.scale.y=scale.y;
                                                                object.scale.z=scale.z;
                                                                object.position.x=position.x;
                                                                object.position.y=position.y;
                                                                object.position.z=position.z;
                                                                object.rotation.x=rotation.x;
                                                                object.rotation.y=rotation.y;
                                                                object.rotation.z=rotation.z;
                                                               //object.scale=scale.;
                                                                object.children[0].material=material;
                                                                object.name=name;
                                                                console.log(object.name);
                                                                console.log(objectCollision);
                                                            scene.add(object);
                                                            if(name!=="jugador"){
                                                                
                                                            objectCollision.push(object);
                                                            }
                                                        
                                                    }
                                            );
                            },
                            // Function called when download progresses
                            function ( xhr ) {
                                    console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
                            },
                            // Function called when download errors
                            function ( xhr ) {
                                    console.log( 'An error happened' );
                            }
                    );
    },
    CreateClone:function(jugador,scene,name,scale,position,rotation,objectCollision){
        var obj=jugador.GetObject3d();
        obj.scale.x=scale.x;
        obj.scale.y=scale.y;
        obj.scale.z=scale.z;
        obj.position.x=position.x;
        obj.position.y=position.y;
        obj.position.z=position.z;
        obj.rotation.x=rotation.x;
        obj.rotation.y=rotation.y;
        obj.rotation.z=rotation.z;
        obj.name=name;
        console.log(obj.name);
        console.log(objectCollision);
        scene.add(obj);
        
        if(name!=="jugador"){
            objectCollision.push(obj);
        }
        
        
    }
   


        
};


