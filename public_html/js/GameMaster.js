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

$(document).ready(function() {
    init();
    setupScene(scene,camera,renderer);
    
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);	
    
    render();
});

    init=function (){
        
    scene =new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,10000);
    renderer= new THREE.WebGLRenderer();
    clock= new THREE.Clock();
    
    jugador= new Jugador("Assets/Modelos/SciFi_Fighter/MK6_OBJ.obj","Assets/Modelos/SciFi_Fighter/SciFi_Fighter-MK6-diffuse.jpg",scene,"jugador",objectCollision);
    jugador.scale.x=.2;
    jugador.scale.y=.2;
    jugador.scale.z=.2;
    
    planeta= new Jugador("Assets/modelos/planet/Planet.obj","Assets/modelos/Planet/Planet_Diffuse.png",scene,"planeta");
    planeta.scale.x=20;
    planeta.scale.y=20;
    planeta.scale.z=20;
    
   
        
				var path = "Assets/SkyMap/";
				var format = '.png';
				var urls = [
						path + 'left' + format, path + 'right' + format,
						path + 'top' + format, path + 'bot' + format,
						path + 'back' + format, path + 'front' + format
					];

				var reflectionCube = new THREE.CubeTextureLoader().load( urls );
				reflectionCube.format = THREE.RGBFormat;

				//scene = new THREE.Scene();
				scene.background = reflectionCube;

        
        
    
    planeta.position.x=5000;
    planeta.position.z=7000;
    
    
    };
    ////
    var render = function () {
        
        camera.position.x=jugador.position.x;
        camera.position.y=jugador.position.y+150;
        camera.position.z=jugador.position.z-500;
        requestAnimationFrame( render );
        renderer.render(scene, camera);
        var delta=clock.getDelta();
        deltaTimeShot+=delta;
        deltaTimeEnemiSpawn+=delta;
        planeta.Rotate(0,1,0,1);
        
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
                        enemigo[i].Delete();
                        enemigo.splice(i,1);
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
        
        if (keys[65]) {//A
            jugador.Move(5,0,0);
	} else if (keys[68]) {//D
            jugador.Move(-5,0,0);
            
	}
        if (keys[87]) {//w
            jugador.Move(0,5,0);
            
	} else if (keys[83]) {//s
            jugador.Move(0,-5,0);
	}
        if (keys[32]) {//space
            //jugador.Move(0,5,0);
            if(deltaTimeShot>.25){
                jugador.Disparar(this.objectCollision);    
                deltaTimeShot=0;
            }
            
	}        
    };
    function getTexturesFromAtlasFile( atlasImgUrl, tilesNum ) {
			var textures = [];
			for ( var i = 0; i < tilesNum; i ++ ) {
				textures[ i ] = new THREE.Texture();
			}
			var imageObj = new Image();
			imageObj.onload = function() {
				var canvas, context;
				var tileWidth = imageObj.height;
				for ( var i = 0; i < textures.length; i ++ ) {
					canvas = document.createElement( 'canvas' );
					context = canvas.getContext( '2d' );
					canvas.height = tileWidth;
					canvas.width = tileWidth;
					context.drawImage( imageObj, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth );
					textures[ i ].image = canvas
					textures[ i ].needsUpdate = true;
				}
			};
			imageObj.src = atlasImgUrl;
			return textures;
		}
    function SpawnEnemi()
    {
            var enemi=new Jugador("Assets/Modelos/dark_fighter_6/dark_fighter_6.obj","Assets/Modelos/dark_fighter_6/dark_fighter_6_color.png",scene,"enemigo"+clock.getElapsedTime(),objectCollision);
            var x=Math.floor((Math.random() * 1000) + 1)-500;
            var y=Math.floor((Math.random() * 1000) + 1)-500;
            enemi.scale.x=5;
            enemi.scale.y=5;
            enemi.scale.z=5;
            enemi.rotation.y=-1.8;
            enemi.position.z=10000;
            enemi.position.x=x,
            enemi.position.y=y,
            enemigo.push(enemi);
    };
    function MoveEnemi()
    {
        if(enemigo.length>0)
        {
            for(var i=0;i<enemigo.length;i++)
            {

                enemigo[i].Move(0,0,-15);
            }
        }
    }
    
    	function onKeyDown(event) {
		keys[event.keyCode] = true;
	};
	function onKeyUp(event) {
		keys[event.keyCode] = false;
	};
