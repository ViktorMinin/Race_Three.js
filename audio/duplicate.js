
import { RGB_PVRTC_2BPPV1_Format, TetrahedronGeometry, TextGeometry } from "../three.js-master/build/three.module.js";
import { GLTFLoader } from "../three.js-master/examples/jsm/loaders/GLTFLoader.js";
import  {GLTFLoader} from "../three.js-master/examples/jsm/loaders/GLTFLoader.js";
export function main(){
    document.getElementById('start').addEventListener('click',first);
    document.getElementById('start').style.display = 'block';
		function first(params) {
			document.getElementById('start').removeEventListener('click',first);
			document.getElementById('start').style.display='none';
			document.getElementById('score').style.visibility = 'visible';
			start();
		}
        
}
function start(){
    var score = document.getElementById('cls');
    var keyboard = new THREEx.KeyboardState();
    var num = 0;
    var id = undefined;
    var flag_light=false;
    let width = window.innerWidth;
    let height = window.innerHeight;
    var canvas = document.getElementById('canvas');
    canvas.setAttribute('width',width);
    canvas.setAttribute('height', height);
    var clock = new THREE.Clock;
    var scene = new THREE.Scene();

    var renderer = new THREE.WebGLRenderer({canvas:canvas,antialias: true});
    renderer.setClearColor(0x99ffff);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);    
    const light = new THREE.DirectionalLight( 0xffffff, 1, 100 );
    light.position.set( 0, 1, 0 );
    light.castShadow = true; 
    scene.add( light );

    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default

    const light2 = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light2 );

    //Фары

    const light_car = new THREE.SpotLight(0xffeeee);

    light_car.shadow.mapSize.width = 1024;
    light_car.shadow.mapSize.height = 1024;
    light_car.rotation.x = 90;
    light_car.target.updateMatrixWorld();
    light_car.shadow.camera.near = 50;
    light_car.shadow.camera.far = 400;
    light_car.shadow.camera.fov = 30;
    light_car.position.z=-1.5;
    light_car.position.y=2;

    const targetObject = new THREE.Object3D();
    targetObject.position.set(0,2.1,-2.1);
    light_car.target = targetObject;
    
    //камера
    var camera = new THREE.PerspectiveCamera(65, width/height, 0.1,1000);
    camera.position.set(7,14,8);
    camera.lookAt(0,0,0);

    //машинка
    var loader = new GLTFLoader();
    var loa= null;
    loader.load( 'models/car_test_-_03/scene.gltf',function (gltf) {
        loa = gltf;
        loa.scene.scale.set(0.2,0.2,0.2);
        loa.scene.position.set(0,1.2,0);
        loa.scene.rotation.y = Math.PI;
        scene.add(loa.scene);
    });
// create road's modules
    var obj = [];
   // obj.push(new spawn_road(scene,0));
   // obj.push(new spawn_road(scene,obj[0].coor-18));
   // obj.push(new spawn_road(scene,obj[1].coor-18));
   // obj.push(new spawn_road(scene,obj[2].coor-18));
    var speed_spawn =20;
    var time = 1;
    var compare = 100;
// end of creartion road's modules

//create other cars:
var arr_car = [];
//создания дороги
var arr_road = [];
new_road(0);
new_road(-36);
new_road(-72);
    function  animation() {
        id=window.requestAnimationFrame(animation);
        update();
        renderer.render(scene,camera);
    }
    animation();
    function update(params) {
        var delte = clock.getDelta();
        if(loa)score.innerText = parseInt(loa.scene.position.z*(-1));
        time+=delte;
        
        //road spawn
        if(loa){
            targetObject.position.z-=speed_spawn*delte;
            targetObject.position.x = loa.scene.position.x
            if(flag_light==false && loa.scene.position.z<-1000){
                if(flag_light==false){
                    light_car.castShadow = true;
                    scene.add(light_car.target);
                    scene.add(light_car);
                    flag_light=true;
                    renderer.setClearColor(0x00000);
                    light.intensity = 0.2;
                }
            }
            light_car.position.z-=speed_spawn*delte;
            light_car.position.x = loa.scene.position.x
           /* if(obj[0].coor>loa.scene.position.z+25){
                obj.push(new spawn_road(scene,obj[obj.length-1].coor-18));
                obj[0].remove(scene);
                obj[0]==null;
                for(let i=1;i<obj.length;i++){
                    obj[i-1]=obj[i];
                }
                obj[obj.length-1]=null;
                obj.length-=1;
                renderer.renderLists.dispose();
            }*/
        }
        if(time>compare){
            compare+=500;
            speed_spawn+=5;
                }
        // end road spawn
        if(arr_road[0] && loa){
            if(arr_road[0].scene.position.z>loa.scene.position.z+72){
                if(arr_road[arr_road.length-1])
                new_road(arr_road[arr_road.length-1].scene.position.z-36);
                scene.remove(arr_road[0].scene);
                arr_road.splice(0,1);
            }
        }
        for(let i=0;i<arr_car.length;i++){
            
            if(arr_car[i])
            {
           
            if(arr_car[i].scene.position.z>loa.scene.position.z+20){
                scene.remove(arr_car[i].scene);
                num--;
                arr_car.splice(i,1);
            }
            else {
                arr_car[i].scene.position.z-=(delte)*speed_spawn/2;
            }
        }
        }
        control(delte);
        if(Math.random()<0.01 &&  arr_car.length<1)spawn();
    }
    function control(delte){
        if(loa){
           loa.scene.position.z-=speed_spawn*delte;
            camera.position.z -=(speed_spawn*delte);
            if(keyboard.pressed("a")&& keyboard.pressed("d")==false){
                if(loa.scene.position.x>=-4.0){      
                    loa.scene.position.x-=speed_spawn/5*delte;
                     if(loa.scene.rotation.y<Math.PI+0.09){
                            loa.scene.rotation.y+=(10*delte);
                        }   
                    }
            }
            else if(keyboard.pressed("d") && loa.scene.position.x<4.0 && keyboard.pressed("a")==false){
                loa.scene.position.x+=(speed_spawn/5*delte);
                if(loa.scene.rotation.y>Math.PI-0.09){
                    loa.scene.rotation.y-=(10*delte);
                }
            }
            else{  
                if(loa.scene.rotation.y-Math.PI>delte && keyboard.pressed("a")==false){
                    loa.scene.rotation.y=Math.PI;
                }
                else if(loa.scene.rotation.y+delte<Math.PI && keyboard.pressed("d")==false){
                    loa.scene.rotation.y=Math.PI;
                    }
                }
            }
        }
function spawn(){
    let loaders = new GLTFLoader();
    let car = null;
    let x = Math.random()*(4.5-(-4.5))+(-4.5);
    if(Math.random()<0.5){
    loaders.load( 'models/car_test_-_03/scene.gltf',function (gltf) {
        car = gltf;
        car.scene.scale.set(0.2,0.2,0.2);
        car.scene.position.set(x,1,loa.scene.position.z-25);
        car.scene.rotation.y = Math.PI;
        scene.add(car.scene);
        arr_car.push(car);
        num++;
    });     
    }
    else{
        loaders.load( 'models/car_test_-02/scene.gltf',function (gltf) {
            car = gltf;
            car.scene.scale.setcar.scene.scale.set(0.2,0.2,0.2);
            car.scene.position.set(x,1,loa.scene.position.z-25);
            car.scene.rotation.y = -Math.PI/2;
            scene.add(car.scene);
            arr_car.push(car);
            num++;
        });     
    }
}
function new_road(z){
    let loaders = new GLTFLoader();
    let road = null;
    loaders.load( 'models/road2_0.glb',function (gltf) {
        road = gltf;
        road.scene.scale.set(0.2,0.1,0.3);
        road.scene.position.set(0,1,z);
        //car.scene.rotation.y = Math.PI;
        scene.add(road.scene);
        arr_road.push(road);
    });     
}

}
class spawn_road{
    constructor(scene,z){
        this.rand= Math.random();
        if(this.rand<=0.35)
        this.materialPlane = new THREE.MeshStandardMaterial({color: 0x330066});
        else if(this.rand>0.35&& this.rand<=0.75)
        this.materialPlane = new THREE.MeshStandardMaterial({color: 0xffeeaa});
        else
        this.materialPlane = new THREE.MeshStandardMaterial({color: 0x0000ff});
        this.geometryPlane = new THREE.BoxGeometry(10,1,18);
        this.meshPlane = new THREE.Mesh(this.geometryPlane,this.materialPlane);
        this.meshPlane.castShadow = true;
        this.meshPlane.receiveShadow = true;
        this.meshPlane.position.set(0,0,z);
        scene.add(this.meshPlane);
    }
    get coor(){
     return this.meshPlane.position.z;
    }
    set change(x){
      this.meshPlane.position.z+=x;
    }
    remove(scene) {
         this.meshPlane.geometry.dispose();
        this.meshPlane.material.dispose();
        scene.remove(this.meshPlane);
    }
}
import { TetrahedronGeometry, TextGeometry } from "../three.js-master/build/three.module.js";
import  {GLTFLoader} from "../three.js-master/examples/jsm/loaders/GLTFLoader.js";
var endgame = false;
var new_game;

export function main(){
    if(endgame==false){

    document.getElementById('start').addEventListener('click',first);
    document.getElementById('start').style.display = 'block';
    document.getElementById('best_score').style.display = 'block';
    if(localStorage.getItem("score")!=null)
    document.getElementById('p_best_score').innerHTML = localStorage.getItem("score");
		function first() {
			document.getElementById('start').removeEventListener('click',first);
			document.getElementById('start').style.display='none';
			document.getElementById('score').style.visibility = 'visible';
            document.getElementById('score').style.display='block';
			document.getElementById('best_score').style.display ='none';
            if(/Mobile|webOS|BlackBerry|IEMobile|MeeGo|mini|Fennec|Windows Phone|Android|iP(ad|od|hone)/i.test(navigator.userAgent)){
                new_game = new game(25,25);
            }
            else{
                new_game = new game(30,20);
            }
            
		}
    }
}
function lose_screen(){
    if(parseInt(document.getElementById('score').innerHTML)>parseInt(document.getElementById('p_best_score').innerHTML)){
        document.getElementById('p_best_score').innerHTML=parseInt(document.getElementById('score').innerHTML);
        localStorage.setItem("score",parseInt(document.getElementById('score').innerHTML));

    }
    alert('You Lose');
    document.getElementById('score').innerHTML = 0;
    document.getElementById('score').style.display='none';
    new_game = null;
    endgame=false;
    main();
}
class game{
    constructor(speed,cam){
        this.canvas = document.getElementById('canvas');
        this.canvas.style.display='block';
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.setAttribute('width',this.width);
        this.canvas.setAttribute('height',this.height);
        
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({canvas:canvas,antialias: true});
        this.renderer.setClearColor(0x99ffff);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(65, this.width/this.height, 0.1,1000);
        this.camera.position.set(4,cam,8);
        this.camera.lookAt(0,0,0);
        this.scene.add(this.camera);

        this.lightAmb= new THREE.AmbientLight( 0x404040,1.5);
        this.scene.add(this.lightAmb);

        this.lightDl = new THREE.DirectionalLight( 0xffffff, 1, 1 );
        this.lightDl.position.set( 1, 10, 1 );
        this.lightDl.target.position.set(0,0,0);
        this.lightDl.castShadow = true; 
        this.scene.add(this.lightDl); 

        /*this.lightDl.shadow.mapSize.width = 512; // default
        this.lightDl.shadow.mapSize.height = 512; // default
        this.lightDl.shadow.camera.near = 0.5; // default
        this.lightDl.shadow.camera.far = 500; // default*/

        this.clock = new THREE.Clock;

        this.score=document.getElementById('score');

        this.arr_road = [];
        this.arr_car = [];
        this.arr_boxes = [];
        this.arr_sand=[];
        this.arr_car2 = [];
        this.arr_boxes2 = [];
        
        this.flag_first=true;
        this.road_load = false;

        this.speed = speed;

        this.box = new THREE.Mesh(new THREE.BoxGeometry(1.8,1,3.8), new THREE.MeshBasicMaterial({color:0x00ff00, transparent:true, opacity:0, side: THREE.DoubleSide}));
        this.box.position.set(0,0.5,-0.1);
        this.scene.add(this.box);

        this.difficult = 500;

        this.audio = new Audio();
        //this.audio.src='./audio/6 FEET - SCARLXRD.mp3';
        this.audio.autoplay=true;

        this.keyboard = [];
        addEventListener('keydown',(e)=>{
            this.keyboard[e.keyCode]=true;
        });
        addEventListener('keyup',(e)=>{
            this.keyboard[e.keyCode]=false;
        });
        this.keyboard[65]=false;
        this.keyboard[68]=false;
        this.touches = [];
        addEventListener('touchstart',(e)=>{
            if(e.changedTouches[0].screenX<window.outerWidth/2){
                this.touches[0]=true;
            }
            else{
                this.touches[1]=true;
            }
        },false);
        addEventListener('touchend',(e)=>{
            if(e.changedTouches[0].screenX<window.outerWidth/2){
                this.touches[0]=false;
            }
            else{
                this.touches[1]=false;
            }
        },false);
        this.touches[0]=false;
        this.touches[1]=false;
        this.LoadMainCar();
        this.animation();    
    }
    LoadMainCar(){
        const loader = new GLTFLoader();
        this.car = null;
        loader.load( 'models/cars/low_poly_car/scene.gltf', (gltf)=> {
           this.car = gltf;
           this.car.scene.scale.set(0.005,0.005,0.005);
           this.car.scene.position.set(0,0.2,0);
           this.car.scene.rotation.y = Math.PI;
           this.car_box = new colliders(this.box);
           this.scene.add(this.car.scene);
    });
    this.second_car = null;
   /* loader.load( 'models/car_test_-02/scene.gltf', (gltf)=> {
        this.second_car = gltf;
        this.second_car.scene.scale.set(0.2,0.2,0.2);
        this.second_car.scene.position.set(-10,-10,0);
        this.second_car.scene.rotation.y = -Math.PI/2;
        this.scene.add(this.second_car.scene);
    });*/
    loader.load( 'models/cars/car2.glb', (gltf)=> {
        this.second_car = gltf;
        this.second_car.scene.scale.set(1.8,1.8,1.8);
        this.second_car.scene.position.set(10,10.5,0);
        this.second_car.scene.rotation.y = 0;
        //this.scene.add(this.second_car.scene);
    });
    this.third_car = null;
    loader.load( 'models/cars/car2.glb', (gltf)=> {
        this.third_car = gltf;
        this.third_car.scene.scale.set(1.8,1.8,1.8);
        this.third_car.scene.position.set(0,0.5,0);
        this.third_car.scene.rotation.y = 0;
        //this.scene.add(this.third_car.scene);
    });
    }
    LoadRoad(){
    const loader = new GLTFLoader();
        this.road_first = null;
        loader.load( 'models/new_road.glb', (gltf)=> {
            this.road_first = gltf;
            this.road_first.scene.scale.set(0.2,0.1,0.3);
            this.road_first.scene.position.set(0,0,10);
            this.road_first.scene.rotation.y = Math.PI;
            this.road_load  = true;
            //this.scene.add(this.road_first.scene);
    });
    const loader2 = new GLTFLoader();
    loader2.load('models/sand.glb',(gltf)=>{
        this.sand = gltf;
        this.sand.scene.scale.set(1,1,1);
        this.sand.scene.position.set(0,0,10);
        this.sand.scene.rotation.y = Math.PI;
        this.scene.add(this.sand.scene);
    });
}
    SpawnCar(x,z,y,arr,arr_box,angel=0){
        if(arr.length<y){
            let car_ = null;
        if(Math.random()<0.5)
        car_ = this.second_car.scene.clone();
        else car_ = this.third_car.scene.clone();
        car_.scale.set(1.14,1.14,1.14);
        this.scene.add(car_);
        car_.position.set(x,0.5,z);
        car_.rotation.y = angel;
        arr.push(car_);
        let box_ = new colliders();
        arr_box.push(box_);
        let help = new THREE.Box3Helper(box_.collision,0xffff00);
        this.scene.add(help);
        car_=null;
        box_=null
        }
    }
    SpawnRoad(z){
        let road = this.road_first.scene.clone();
        this.scene.add(road);
        road.position.set(0,0,z);
        this.arr_road.push(road);
        road = null;
    }
    SpawnSand(z){
        let sand_ = this.sand.scene.clone();
        this.scene.add(sand_);
        sand_.scale.set(1,1,1);
        sand_.position.set(0,0,z);
        this.arr_sand.push(sand_);
        sand_ = null; 
    }
    CreateFirstElements(){
        //    this.SpawnRoad(0);
          //  this.SpawnRoad(-36);
            //this.SpawnRoad(-72);
        
        if(this.sand){
            this.SpawnSand(0);
            this.SpawnSand(-36);
            this.SpawnSand(-72);
        }
    }
    animation(){
        this.id = window.requestAnimationFrame(()=>this.animation());
        this.update();
        if(endgame==true)this.cancel();
        this.renderer.render(this.scene,this.camera);
    }
    cancel(){
        cancelAnimationFrame(this.id);
        this.renderer.clear();
        this.renderer.domElement.addEventListener('dblclick', null, false);
        while(this.scene.children.length>0){
            this.scene.remove(this.scene.children[0]);
        }
        this.canvas.style.display='none';
        this.audio.pause();
        this.audio.currentTime=0;
        this.audio = null;
        this.road_first = null;
        this.sand = null;
        this.car = null;
        this.second_car = null;
        this.third_car = null;
        lose_screen();
    }
    detection(arr_boxes,arr_car){
        if(this.car){
           for(let i=0;i<arr_car.length;i++){
               let x = arr_boxes[i].collision;
               if(x.intersectsBox(this.car_box.collision))endgame=true;
           }
        }
    }
    update(){
        this.detection(this.arr_boxes,this.arr_car);
        this.detection(this.arr_boxes2,this.arr_car2);
        this.delte = this.clock.getDelta();
        
        if(this.car){
            if(this.difficult<(this.car.scene.position.z*(-1))){
                this.speed+=5;
                this.difficult*=2;
            }
            if(this.flag_first==true){
                this.helper = new THREE.Box3Helper(this.car_box.collision,0xffff00);
                this.scene.add(this.helper);
                this.flag_first=false;
                this.LoadRoad();
                
            }
            if(this.sand && this.road_load){
                this.CreateFirstElements();
                this.road_load=false;
            }
        this.box.position.z-=this.delte*this.speed;
        this.car.scene.position.z-=this.delte*this.speed;
        this.camera.position.z-=this.delte*this.speed;
        this.camera.lookAt(this.car.scene.position);
        
        this.score.innerHTML=parseInt(this.car.scene.position.z*(-1));

        this.control();
        if(Math.random()<0.01){            
            this.SpawnCar(Math.random()*(-0.5-(-4.5))+(-4.5),this.car.scene.position.z-Math.floor(Math.random()*(50-45)+45),2,this.arr_car,this.arr_boxes);
        }
        if(this.arr_car[0]){
            if(this.arr_car[0].position.z>this.car.scene.position.z+35){
                this.scene.remove(this.arr_car[0]);
                this.arr_car.splice(0,1);
                this.arr_boxes[0].collision.makeEmpty();
                this.arr_boxes.splice(0,1);
            }
            else{
                for(let i=0;i<this.arr_car.length;i++){
                if(this.arr_car[i]){
                    this.arr_car[i].position.z-=this.delte*this.speed/3;
                    this.arr_boxes[i].updateCollider(this.arr_car[i]);
                }
                }
            }
        }
        if(Math.random()<0.01)this.SpawnCar(Math.random()*(4.5-(0.5))+(0.5),
        this.car.scene.position.z-Math.floor(Math.random()*(50-45)+45),2,this.arr_car2,this.arr_boxes2,-Math.PI)
        if(this.arr_car2[0]){
            if(this.arr_car2[0].position.z>this.car.scene.position.z+35){
                this.scene.remove(this.arr_car2[0]);
                this.arr_car2.splice(0,1);
                this.arr_boxes2[0].collision.makeEmpty();
                this.arr_boxes2.splice(0,1);
            }
            else{
                for(let i=0;i<this.arr_car2.length;i++){
                if(this.arr_car2[i]){
                    this.arr_car2[i].position.z+=this.delte*this.speed/4;
                    this.arr_boxes2[i].updateCollider(this.arr_car2[i]);
                }
                }
            }
        }
        
        if(this.arr_road[0]){
            if(this.arr_road[0].position.z>this.car.scene.position.z+30){
                if(this.arr_road[this.arr_road.length-1]){
                    this.SpawnRoad(this.arr_road[this.arr_road.length-1].position.z-37);
                    this.scene.remove(this.arr_road[0]);
                    this.arr_road.splice(0,1);
                    }
                }
            }
        }
        if(this.arr_sand[0]){
            if(this.arr_sand[0].position.z>this.car.scene.position.z+30){
                if(this.arr_sand[this.arr_sand.length-1]){
                    this.SpawnSand(this.arr_sand[this.arr_sand.length-1].position.z-37);
                    this.scene.remove(this.arr_sand[0]);
                    this.arr_sand.splice(0,1);
                    }
                }
        }
    }
    control(){
        if((this.keyboard[65]==true || this.touches[0]==true) && this.car.scene.position.x>=-4.0 && this.keyboard[68]==false){
            this.car.scene.position.x-=this.speed/5*this.delte;
            this.box.position.x-=this.speed/5*this.delte;
             if(this.car.scene.rotation.y<Math.PI+0.09){
                this.car.scene.rotation.y+=(10*this.delte);
                }   
        }
        else if((this.keyboard[68]==true || this.touches[1]==true) && this.car.scene.position.x<4.0  && this.keyboard[65]==false){
            this.car.scene.position.x+=(this.speed/5*this.delte);
            this.box.position.x+=(this.speed/5*this.delte);
            if(this.car.scene.rotation.y>Math.PI-0.09){
                this.car.scene.rotation.y-=(10*this.delte);
            }
        }
        else{  
            if(this.car.scene.rotation.y-Math.PI>this.delte){
                this.car.scene.rotation.y=Math.PI;
            }
            else if(this.car.scene.rotation.y+this.delte<Math.PI){
                this.car.scene.rotation.y=Math.PI;
                }
            }
            
            this.car_box.updateCollider(this.box);
    }
}

class colliders{
    constructor(){
        this.collider = new THREE.Box3();
    }
    updateCollider(params){
        this.collider.setFromObject(params);
    }
    get collision(){
        return this.collider;
    }
    check(params){
        if(this.collider.intersectsBox(params))
            return true;
        else return false;
    }
}