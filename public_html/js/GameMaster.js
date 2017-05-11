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

$(document).ready(function() {

    
    if(localStorage.getItem("nickname")!=null){
        $("#nickname").hide();
    }
    
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);	
    
    
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
        render();
    };
    ////
    var render = function () {
        
        camera.lookAt(new THREE.Vector3( 0,-1, 4000 ));
        /*camera.position.x=jugador.position.x;
        camera.position.y=jugador.position.y+1050;
        camera.position.z=jugador.position.z-1000;*/
        
        requestAnimationFrame( render );
        renderer.render(scene, camera);
        var delta=clock.getDelta();
        deltaTimeShot+=delta;
        deltaTimeEnemiSpawn+=delta;
        planeta.Rotate(0,1,0,1);
       // luna.Rotate(0,1,0,1);
        
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
        
        /*for(var i=0;i<enemigo.length;i++)
        {
            if(enemigo[i].position.z<-150){
                enemigo[i].Delete();
                enemigo[i].splice(i,1);
            }
        }*/
        
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
            if(localStorage.getItem("nickname")==null){
                if(nickname!=""){
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
            
            
        
        } else {
        alert("Sorry! No Web Storage support..");
        }   
        
    }
    
    function SendNudes(){
            $.ajax({
            type:"get",
            url:"../Controller/ControllerRazon.php?razon=1",
            async:false,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success:function(data)
                {
                    listRazon=data;
                    LlamarDenuncia();           
                } 
            });
    }
    
    function getNudes(){
            $.ajax({
            type:"get",
            url:"../Controller/ControllerRazon.php?razon=1",
            async:false,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success:function(data)
                {
                    listRazon=data;
                    LlamarDenuncia();           
                } 
            });
    }

 