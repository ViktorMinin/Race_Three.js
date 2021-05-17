import { RGB_PVRTC_2BPPV1_Format, TetrahedronGeometry, TextGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
//import { GLTFLoader } from "../three.js-master/examples/jsm/loaders/GLTFLoader.js";
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js';
var endgame = false;
var new_game;

export function main() {
    document.getElementById('score').style.visibility = 'visible';
    document.getElementById('score').style.display = 'block';
    new_game = new game(29, 14);
}
function lose_screen() {
    localStorage.setItem("score", parseInt(document.getElementById('score').innerHTML));
    alert('You Lose');
    document.getElementById('score').innerHTML = 0;
    document.getElementById('score').style.display = 'none';
    new_game = null;
    endgame = false;
    document.location = "index.html";
}
class game {
    constructor(speed, cam) {
        this.canvas = document.getElementById('canvas');
        this.canvas.style.display = 'block';
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.setAttribute('width', this.width);
        this.canvas.setAttribute('height', this.height);

        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        this.renderer.setClearColor(0x99ffff);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(65, this.width / this.height, 0.1, 500);
        //this.camera.position.set(4,cam,8);
        this.camera.position.set(-0.5, cam / 2.2, 8);
        //this.camera.position.set(0,20,4);
        this.camera.lookAt(0, 0, 0);
        this.scene.add(this.camera);

        this.lightAmb = new THREE.AmbientLight(0x404040, 2);
        this.scene.add(this.lightAmb);

        this.lightDl = new THREE.DirectionalLight(0xffffff, 1.5, 1);
        this.lightDl.position.set(1, 10, 1);
        this.lightDl.target.position.set(0, 0, 0);
        this.lightDl.castShadow = true;
        this.scene.add(this.lightDl);


        this.spotlight = new THREE.SpotLight(0xffffff, 0);
        this.spotlight.position.set(0, 1, 0.2);
        this.spotlight.distance = 10.5;
        this.spotlight.angle = Math.PI / 3;
        this.spotlight.rotation.x = Math.PI;
        this.scene.add(this.spotlight);
        this.target = new THREE.Object3D();
        this.target.position.set(0, 0.5, -4);
        this.scene.add(this.target);
        this.spotlight.target = this.target;
        this.switch_light_distance = 1000;
        /*this.lightDl.shadow.mapSize.width = 512; // default
        this.lightDl.shadow.mapSize.height = 512; // default
        this.lightDl.shadow.camera.near = 0.5; // default
        this.lightDl.shadow.camera.far = 500; // default*/

        this.clock = new THREE.Clock;

        this.score = document.getElementById('score');

        this.arr_car = [];
        this.arr_boxes = [];
        this.arr_sand = [];
        this.arr_car2 = [];
        this.arr_boxes2 = [];

        this.flag_first = true;
        this.road_load = false;
        this.change_light = false;
        this.day = 1;
        this.speed = speed;

        this.box = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1, 3.4), new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0, side: THREE.DoubleSide }));
        this.box.position.set(0, 0.5, -0.1);
        this.scene.add(this.box);

        this.difficult = 500;

        this.audio = new Audio();
        this.audio.src = './audio/Twin Musicom - Training in the Fire.mp3';
        this.audio.autoplay = true;
        document.getElementById('music_off').addEventListener('click', (e) => {
            if (this.audio.paused == true) {
                document.getElementById('music_off').style.backgroundColor = 'rgba(0, 0, 0, 0)';
                this.audio.play();
            }
            else {
                document.getElementById('music_off').style.backgroundColor = ' rgba(0, 255, 21, 0.65)';
                this.audio.pause();
            }
        })
        this.keyboard = [];
        addEventListener('keydown', (e) => {
            this.keyboard[e.keyCode] = true;
        });
        addEventListener('keyup', (e) => {
            this.keyboard[e.keyCode] = false;
        });
        this.keyboard[65] = false;
        this.keyboard[68] = false;
        this.touches = [];
        addEventListener('touchstart', (e) => {
            if (e.changedTouches[0].screenX < window.outerWidth / 2) {
                this.touches[0] = true;
            }
            else {
                this.touches[1] = true;
            }
        }, false);
        addEventListener('touchend', (e) => {
            if (e.changedTouches[0].screenX < window.outerWidth / 2) {
                this.touches[0] = false;
            }
            else {
                this.touches[1] = false;
            }
        }, false);
        this.touches[0] = false;
        this.touches[1] = false;
        this.LoadMainCar();
        this.animation();
    }
    LoadMainCar() {
        const loader = new GLTFLoader();
        this.car = null;
        loader.load('models/cars/main_car.glb', (gltf) => {
            this.car = gltf;
            this.car.scene.scale.set(2.5, 2, 2);
            this.car.scene.position.set(0, 0.4, 0);
            this.car.scene.rotation.y = Math.PI;
            this.car_box = new colliders(this.box);
            this.scene.add(this.car.scene);
        });
        this.second_car = null;
        loader.load('models/cars/car1.glb', (gltf) => {
            this.second_car = gltf;
            this.second_car.scene.scale.set(1.8, 1.8, 1.8);
            this.second_car.scene.position.set(10, 10.5, 0);
            this.second_car.scene.rotation.y = 0;
        });
        this.third_car = null;
        loader.load('models/cars/car2_2.glb', (gltf) => {
            this.third_car = gltf;
            this.third_car.scene.scale.set(1.8, 1.8, 1.8);
            this.third_car.scene.position.set(0, 0.5, 0);
            this.third_car.scene.rotation.y = 0;
        });
    }
    LoadRoad() {
        const loader2 = new GLTFLoader();
        loader2.load('models/sand.glb', (gltf) => {
            this.sand = gltf;
            this.sand.scene.scale.set(1, 1, 1);
            this.sand.scene.position.set(0, 0, 10);
            this.sand.scene.rotation.y = Math.PI;
            this.scene.add(this.sand.scene);
            this.road_load = true;
        });
    }
    SpawnCar(x, z, y, arr, arr_box, angel = 0) {
        if (arr.length < y) {
            let car_ = null;
            if (Math.random() < 0.5) {
                car_ = this.second_car.scene.clone();
                car_.scale.set(1.3, 1.3, 1.3);
            }
            else {
                car_ = this.third_car.scene.clone();
                car_.scale.set(2.5, 2, 2);
            }

            if (arr[0] != null)
                car_.position.set(x, 0.7, z - 5);
            else car_.position.set(x, 0.6, z);
            car_.rotation.y = angel;
            this.scene.add(car_);
            arr.push(car_);
            let box_ = new colliders();
            arr_box.push(box_);
            //let help = new THREE.Box3Helper(box_.collision,0xffff00);
            //this.scene.add(help);
            car_ = null;
            box_ = null
        }
    }
    SpawnSand(z) {
        let sand_ = this.sand.scene.clone();
        sand_.scale.set(1.1, 1.1, 1.1);
        sand_.position.set(0, 0, z);
        this.scene.add(sand_);
        this.arr_sand.push(sand_);
        sand_ = null;
    }
    CreateFirstElements() {
        if (this.sand) {
            this.SpawnSand(0);
            this.SpawnSand(-41.3915);
            this.SpawnSand(-2 * 41.3915);
        }
    }
    animation() {
        this.id = window.requestAnimationFrame(() => this.animation());
        this.update();
        if (endgame == true) this.cancel();
        this.renderer.render(this.scene, this.camera);
    }
    cancel() {
        cancelAnimationFrame(this.id);
        this.renderer.renderLists.dispose();
        this.renderer.clear();
        this.renderer.domElement.addEventListener('dblclick', null, false);
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
        this.spotlight = null;
        this.target = null;
        this.canvas.style.display = 'none';
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio = null;
        this.road_first = null;
        this.sand = null;
        this.car = null;
        this.second_car = null;
        this.third_car = null;
        this.arr_car = null;
        this.arr_car2 = null;
        this.arr_boxes2 = null;
        this.arr_boxes = null;
        lose_screen();
    }
    detection(arr_boxes, arr_car) {
        if (this.car) {
            for (let i = 0; i < arr_car.length; i++) {
                let x = arr_boxes[i].collision;
                if (x.intersectsBox(this.car_box.collision)) endgame = true;
            }
        }
    }
    update() {
       this.detection(this.arr_boxes, this.arr_car);
        this.detection(this.arr_boxes2, this.arr_car2);
        this.delte = this.clock.getDelta();
        this.switch_light(this.day);
        if (this.car) {
            this.target.position.z = this.car.scene.position.z - 5;
            if (this.difficult < (this.car.scene.position.z * (-1))) {
                this.speed += 2;
                this.difficult += 500;
            }
            if (this.switch_light_distance < this.car.scene.position.z * (-1)) {
                this.change_light = true;
            }
            if (this.flag_first == true) {
                //this.helper = new THREE.Box3Helper(this.car_box.collision,0xffff00);
                //this.scene.add(this.helper);
                this.flag_first = false;
                this.spotlight.position.z = this.car.scene.position.z - 2.4;
                this.LoadRoad();
            }
            if (this.sand && this.road_load) {
                this.CreateFirstElements();
                this.road_load = false;
            }
            this.box.position.z -= this.delte * this.speed;
            this.car.scene.position.z -= this.delte * this.speed;
            this.camera.position.z -= this.delte * this.speed;

            this.score.innerHTML = parseInt(this.car.scene.position.z * (-1));

            this.control();
            if (Math.random() < 0.01) {
                this.SpawnCar(Math.random() * (-0.5 - (-4.5)) + (-4.5), this.car.scene.position.z - Math.floor(Math.random() * (50 - 45) + 45), 2, this.arr_car, this.arr_boxes);
            }
            if (this.arr_car[0]) {
                if (this.arr_car[0].position.z > this.car.scene.position.z + 41) {
                    this.scene.remove(this.arr_car[0]);
                    this.arr_car[0] = null;
                    this.arr_car.splice(0, 1);
                    this.arr_boxes[0].collision.makeEmpty();
                    this.arr_boxes.splice(0, 1);
                }
                else {
                    for (let i = 0; i < this.arr_car.length; i++) {
                        if (this.arr_car[i]) {
                            this.arr_car[i].position.z -= this.delte * this.speed / 3;
                            this.arr_boxes[i].updateCollider(this.arr_car[i]);
                        }
                    }
                }
            }
            if (Math.random() < 0.01) this.SpawnCar(Math.random() * (4.5 - (0.5)) + (0.5),
                this.car.scene.position.z - Math.floor(Math.random() * (50 - 45) + 45), 2, this.arr_car2, this.arr_boxes2, -Math.PI)
            if (this.arr_car2[0]) {
                if (this.arr_car2[0].position.z > this.car.scene.position.z + 35) {
                    this.scene.remove(this.arr_car2[0]);
                    this.arr_car2[0] == null;
                    this.arr_car2.splice(0, 1);
                    this.arr_boxes2[0].collision.makeEmpty();
                    this.arr_boxes2[0] = null;
                    this.arr_boxes2.splice(0, 1);
                }
                else {
                    for (let i = 0; i < this.arr_car2.length; i++) {
                        if (this.arr_car2[i]) {
                            this.arr_car2[i].position.z += this.delte * this.speed / 4;
                            this.arr_boxes2[i].updateCollider(this.arr_car2[i]);
                        }
                    }
                }
            }
        }
        if (this.arr_sand[0]) {
            if (this.arr_sand[0].position.z > this.car.scene.position.z + 30) {
                if (this.arr_sand[this.arr_sand.length - 1]) {
                    this.SpawnSand(this.arr_sand[this.arr_sand.length - 1].position.z - 41.3915);
                    this.scene.remove(this.arr_sand[0]);
                    this.arr_sand[0] = null;
                    this.arr_sand.splice(0, 1);

                }
            }
        }
    }
    control() {
        if ((this.keyboard[65] == true || this.touches[0] == true || this.keyboard[37] == true) && this.car.scene.position.x >= -4.0 && this.keyboard[68] == false) {
            this.car.scene.position.x -= this.speed / 5 * this.delte;
            this.spotlight.position.x -= this.speed / 5 * this.delte;
            this.box.position.x -= this.speed / 5 * this.delte;
            this.target.position.x = this.car.scene.position.x - 0.5;
            if (this.car.scene.rotation.y < Math.PI + 0.09) {
                this.car.scene.rotation.y += (10 * this.delte);
            }
        }
        else if ((this.keyboard[68] == true || this.touches[1] == true || this.keyboard[39] == true) && this.car.scene.position.x < 4.0 && this.keyboard[65] == false) {
            this.car.scene.position.x += (this.speed / 5 * this.delte);
            this.box.position.x += (this.speed / 5 * this.delte);
            this.spotlight.position.x += this.speed / 5 * this.delte;
            this.target.position.x = this.car.scene.position.x + 0.5;
            if (this.car.scene.rotation.y > Math.PI - 0.09) {
                this.car.scene.rotation.y -= (10 * this.delte);
            }
        }
        else {
            if (this.car.scene.rotation.y - Math.PI > this.delte) {
                this.car.scene.rotation.y = Math.PI;
                this.target.position.x = this.car.scene.position.x;
            }
            else if (this.car.scene.rotation.y + this.delte < Math.PI) {
                this.car.scene.rotation.y = Math.PI;
                this.target.position.x = this.car.scene.position.x;
            }
        }

        this.car_box.updateCollider(this.box);

    }
    switch_light(x) {
        this.spotlight.position.z -= this.speed * this.delte;
        if (this.change_light == true) {
            if (x == 1) {
                this.lightDl.intensity -= 0.1 * this.delte;
                if (this.lightDl.intensity <= 0) {
                    this.lightAmb.intensity = 0.5;
                    this.spotlight.intensity = 6;
                    this.change_light = false;
                    this.day = 0;
                    this.switch_light_distance += 700;
                }
            }
            else {
                this.lightDl.intensity += 0.1 * this.delte;
                if (this.lightDl.intensity >= 1.5) {
                    this.lightAmb.intensity = 1;
                    this.spotlight.intensity = 0;
                    this.change_light = false;
                    this.day = 1;
                    this.switch_light_distance += 1000;
                }
            }
        }
    }
}

class colliders {
    constructor() {
        this.collider = new THREE.Box3();
    }
    updateCollider(params) {
        this.collider.setFromObject(params);
    }
    get collision() {
        return this.collider;
    }
    check(params) {
        if (this.collider.intersectsBox(params))
            return true;
        else return false;
    }
}