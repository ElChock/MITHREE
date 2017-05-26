/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



        
        function setupScene(scene,camera,renderer) {	
            
            var fogScene=new THREE.Fog(0xffffff,1,30000);
            
            scene.fog=fogScene;
            
            camera.position.y=3000;
            camera.position.z = -2000;
            camera.lookAt(new THREE.Vector3( 1,1, 1 ));
            
            var renderer ;
            renderer.setSize(window.innerWidth,window.innerHeight);
            document.body.appendChild( renderer.domElement );
            
            var ambientLight = new THREE.AmbientLight("#3333cc", 1.0);
		scene.add(ambientLight);
                
            var directionalLight = new THREE.DirectionalLight(new THREE.Color(1, 1, 1), 1.0);
		directionalLight.position.set(0, 0, 1);
		scene.add(directionalLight);

            var light = new THREE.PointLight(new THREE.Color(1, 1, 1), 1 );
                light.position.set( 0, 50,-50 );
                scene.add( light );
                
                
        }   