class car{
    constructor(x,y,z){
        this.x=x;
        this.y=y;
        this.z=z;
    }
    get x_y_z(){
        this.arr = [this.x,this.y,this.z];
        return this.arr;
    }
    
}