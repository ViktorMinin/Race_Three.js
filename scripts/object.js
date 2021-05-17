class obectjs{
    constructor(x,y,z,sX,sY,sZ,clr,type){
        this.vector = [x,y,z];
        this.SizeVector= [sX,sY,sZ];
        this.material = new THREE.MeshBasicMaterial({color: clr});
        switch(type){
            case "PlaneGeometry":
                this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(),this.material);
                break;
            case "BoxGeometry":
                this.mesh = new THREE.Mesh(new THREE.BoxGeometry(),this.material);
                break;
            case "SphereGeometry":
                this.mesh = new THREE.Mesh(new THREE.SphereGeometry(),this.material);
                break;
        }
    }
    get ret_mesh(){
        return this.mesh;
    }
}