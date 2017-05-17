/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
    var scene;
    var camera;
    var renderer ;
    var planeta;
    var luna;
    var keys = {};
    var jugador;
    var enemigo=[];
    var meteoro=[];
    var objectCollision=[];
    var clock;
    var deltaTimeShot=0;
    var deltaTimeEnemiSpawn=0;
    var score=0;
    var enemigoObj;
    var dominio="shotingstars.tk/MIWebService/PHP/WebService.php?";
    var pausa=false;
    var composer;

$(document).ready(function() {

    
    if(localStorage.getItem("nickname")!=null){
        $("#nickname").hide();
    }
    GetNudes();
    
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    window.addEventListener( 'mousedown', onclick, false );
    window.addEventListener( 'resize', onWindowResize, false );
    
    
});

    init=function (){

        scene =new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,10000);
        renderer= new THREE.WebGLRenderer();
        clock= new THREE.Clock();
        
        planeta= new Jugador("Assets/modelos/planet/Planet.obj","Assets/modelos/Planet/Planet_Diffuse.png",scene,"planeta",objectCollision,null);
        planeta.scale.x=20;
        planeta.scale.y=20;
        planeta.scale.z=20;
        planeta.position.x=5000;
        planeta.position.z=7000;


        jugador= new Jugador("Assets/Modelos/SciFi_Fighter/MK6_OBJ.obj","Assets/Modelos/SciFi_Fighter/SciFi_Fighter-MK6-diffuse.jpg",scene,"jugador",objectCollision,null);
        jugador.scale.x=.2;
        jugador.scale.y=.2;
        jugador.scale.z=.2;
        
        enemigoObj=new Jugador("Assets/Modelos/dark_fighter_6/dark_fighter_6.obj","Assets/Modelos/dark_fighter_6/dark_fighter_6_color.png",scene,"enemigo"+clock.getElapsedTime(),objectCollision),null;


        //luna = new Jugador("Assets/modelos/moon/Moon.obj","Assets/modelos/moon/Map__27_Falloff.tga",scene,"luna");
        /*luna.scale.x=20;
        luna.scale.y=20;
        luna.scale.z=20;*/



        var path = "Assets/SkyMap/";
        var format = '.png';
        var urls = [
            path + 'right' + format, path + 'left' + format,
            path + 'top' + format, path + 'bot' + format,
            path + 'front' + format, path + 'back' + format
        ];
        
        /*path + 'left' + format, path + 'right' + format,
            path + 'top' + format, path + 'bot' + format,
            path + 'back' + format, path + 'front' + format*/

        var reflectionCube = new THREE.CubeTextureLoader().load( urls );
        reflectionCube.format = THREE.RGBFormat;

                                    //scene = new THREE.Scene();
        scene.background = reflectionCube;
        
        setupScene(scene,camera,renderer);
        
                	// postprocessing
				composer = new THREE.EffectComposer( renderer );
				composer.addPass( new THREE.RenderPass( scene, camera ) );
                                
				/*var effect = new THREE.ShaderPass( THREE.DotScreenShader );
				effect.uniforms[ 'scale' ].value = 4;
				composer.addPass( effect );*/
                                
				var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
				effect.uniforms[ 'amount' ].value = 0.0015;
				effect.renderToScreen = true;
				composer.addPass( effect );
				//
        render();
    };
    ////
    var render = function () {
        
            
            camera.lookAt(new THREE.Vector3( 0,-1, 4000 ));
            /*camera.position.x=jugador.position.x;
            camera.position.y=jugador.position.y+1050;
            camera.position.z=jugador.position.z-1000;*/

            requestAnimationFrame( render );
            //renderer.render(scene, camera);
            composer.render();
            var delta=clock.getDelta();
            deltaTimeShot+=delta;
            deltaTimeEnemiSpawn+=delta;
            if(planeta.modelo)
            planeta.Rotate(0,1,0,1);
           // luna.Rotate(0,1,0,1);
           
           
           
        var pCount = parts.length;
          while(pCount--) {
            parts[pCount].update();
          }
	
           
           
           

            if(deltaTimeEnemiSpawn>5)
            {
                SpawnEnemi();
                deltaTimeEnemiSpawn=0;
            }
            MoveEnemi();

            for(var i=0;i<jugador.proyectil.length;i++)
            {

                jugador.proyectil[i].Move();
                var objCollision=jugador.proyectil[i].Collision();
                    if(objCollision){
                    var name =objCollision.parent.name;
                    for(i=0;i<enemigo.length;i++){
                        if(enemigo[i].name==name){
                            
                            Explote(enemigo[i].position);
                            score++;
                            enemigo[i].Delete();
                            enemigo.splice(i,1);
                            UpdateScore();
                            
                        }

                    }
                    jugador.proyectil[i].Delete();
                    jugador.proyectil.splice(i,1);
                }
                if(jugador.proyectil[i].position.z>10000)
                {
                    jugador.proyectil[i].Delete();
                    jugador.proyectil.splice(i,1);
                }
            }



            for(var i=0;i<enemigo.length;i++)
            {
                if(enemigo[i].position.z<-150){
                    //alert("perdiste");
                    //SendNudes();
                        var r = confirm("Press a button!");
                        if (r == true) {
                            window.location.replace("http://localhost:8383/MI%20three/index.html");
                        } else {
                            txt = "You pressed Cancel!";
                        }
                        
                    
                }
            }

            if (keys[65]) {//A
                jugador.Move(20,0,0);
            } else if (keys[68]) {//D
                jugador.Move(-20,0,0);

            }
            if (keys[87]) {//w
                jugador.Move(0,5,0);

            } else if (keys[83]) {//s
                jugador.Move(0,-5,0);
            }
            if (keys[32]) {//space
                //jugador.Move(0,5,0);
                if(deltaTimeShot>.55){
                    jugador.Disparar(this.objectCollision);    
                    deltaTimeShot=0;
                }

            }        
        
    };
    
    function UpdateScore(){
        $("#score").text(score);
    }
    
    function SpawnEnemi()
    {
            var ran =(Math.random()*10)+1;
            //if(ran<5){
               // var enemi=new Jugador("Assets/Modelos/asteroid OBJ/asteroid OBJ.obj","Assets/Modelos/asteroid OBJ/Map__15_Noise.tga",scene,"enemigo"+clock.getElapsedTime(),objectCollision);
            //}else{
                //var enemi = new Jugador("Assets/Modelos/dark_fighter_6/dark_fighter_6.obj","Assets/Modelos/dark_fighter_6/dark_fighter_6_color.png",scene,"enemigo"+clock.getElapsedTime(),objectCollision,enemigoObj);
                var enemi=new Jugador("Assets/Modelos/dark_fighter_6/dark_fighter_6.obj","Assets/Modelos/dark_fighter_6/dark_fighter_6_color.png",scene,"enemigo"+clock.getElapsedTime(),objectCollision);
            //}
            
            var x=Math.floor((Math.random() * 2000) + 1)-1000;
            //var y=Math.floor((Math.random() * 1000) + 1)-500;
            enemi.scale.x=5;
            enemi.scale.y=5;
            enemi.scale.z=5;
            enemi.rotation.y=-1.8;
            enemi.position.z=10000;
            enemi.position.x=x;
            enemi.position.y=0;
            enemigo.push(enemi);
    };
    function MoveEnemi(){
        if(enemigo.length>0)
        {
            for(var i=0;i<enemigo.length;i++)
            {

                enemigo[i].Move(0,0,-25);
            }
        }
    };
    
        
    	function onKeyDown(event) {
		keys[event.keyCode] = true;
	};
	function onKeyUp(event) {
		keys[event.keyCode] = false;
	};
        
    function StartGame(){
        if (typeof(Storage) !== "undefined") {
            if(localStorage.getItem("nickname")===null){
                if($("#nickname").val()!==undefined){
                    var nickname=$("#nickname").val();    
                    localStorage.setItem("nickname", nickname);
                    $("#menu").toggleClass("menuInvisible");
                    $("#lblNickname").text( localStorage.nickname);
                    init();
                }else{
                    alert("favor de introducir un nickName");
                }
            }else{
                //alert(localStorage.getItem("nickname"));
                $("#menu").toggleClass("menuInvisible");
                $("#lblNickname").text( localStorage.nickname);
                init();
            }
            
            
        pausa=true;
        } else {
        alert("Sorry! No Web Storage support..");
        }   
        
    }
    
    function SendNudes(){
            $.ajax({
            type:"get",
            url:"../MIWebService/PHP/WebService.php?"+"SubirPuntuacion=true&nickname="+$("#lblNickname").val()+"&score="+score,
            async:false,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success:function(data)
                {
                    alert(data);
                    
                } 
            });
    }
    
    function GetNudes(){
            $.ajax({
            type:"get",
            url:"../MIWebService/PHP/WebService.php?"+"ObtenerPuntuacion=true",
            async:false,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success:function(data)
                {
                    listPuntuacion=data;
                    LlenarListaPuntuacion(listPuntuacion);      
                    
                } 
            });
    }
    
    function LlenarListaPuntuacion(lista){
        for (var i = 0; i < lista.length; i++) {
            $("#listaPuntuacion").append("<li>"+lista[i].nombre+": "+lista[i].puntuacion+"</li>");
        }
    
    }
    
    
    
    //////////particulas    
    //////////////settings/////////
var movementSpeed = 500;
var totalObjects = 500;
var objectSize = 50;
var sizeRandomness = 4000;
var colors = [0xFF0FFF, 0xCCFF00, 0xFF000F, 0x996600, 0xFFFFFF];
/////////////////////////////////
var dirs = [];
var parts = [];

function ExplodeAnimation(x,y)
{
  var geometry = new THREE.Geometry();
  
  for (i = 0; i < totalObjects; i ++) 
  { 
    var vertex = new THREE.Vector3();
    vertex.x = x;
    vertex.y = y;
    vertex.z = 0;
  
    geometry.vertices.push( vertex );
    dirs.push({x:(Math.random() * movementSpeed)-(movementSpeed/2),y:(Math.random() * movementSpeed)-(movementSpeed/2),z:(Math.random() * movementSpeed)-(movementSpeed/2)});
  }
  var material = new THREE.ParticleBasicMaterial( { size: objectSize,  color: colors[Math.round(Math.random() * colors.length)] });
  var particles = new THREE.ParticleSystem( geometry, material );
  
  this.object = particles;
  this.status = true;
  
  this.xDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  this.yDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  this.zDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  
  scene.add( this.object  ); 
  
  this.update = function(){
    if (this.status == true){
      var pCount = totalObjects;
      while(pCount--) {
        var particle =  this.object.geometry.vertices[pCount]
        particle.y += dirs[pCount].y;
        particle.x += dirs[pCount].x;
        particle.z += dirs[pCount].z;
      }
      this.object.geometry.verticesNeedUpdate = true;
    }
  }
  
}

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild( renderer.domElement );

renderer.render( scene, camera );
parts.push(new ExplodeAnimation(0, 0));
render();

function render() {
        requestAnimationFrame( render );
         

}



function Explote(position){
  
  parts.push(new ExplodeAnimation(position.x, position.z));
}



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

 