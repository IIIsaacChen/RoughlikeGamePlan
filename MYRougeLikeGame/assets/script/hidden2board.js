// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        speed:400,
        ifAlive:true
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // this.node.active = true
        var ram1 = Math.random()*2-1
        var ram2 = Math.random()*2-1
        var leg = Math.sqrt(ram1*ram1+ram2*ram2)
        ram1 = ram1/leg
        ram2 = ram2/leg
        this.x = ram1*this.speed
        this.y = ram2*this.speed
        this.player = cc.find('Canvas/bg/player')
    },

    update (dt) {
        if(this.ifAlive){
            var move = cc.moveBy(0,this.x*dt,this.y*dt)
            this.node.runAction(move)
            this.changeRotate()
            if(this.ifPlayer)
            {
                this.player.runAction(move)
            }
        }
    },
    onCollisionEnter: function (other, self) {
        switch(other.tag)
        {
            case 1001://上方墙壁
            this.y = -Math.abs(this.y);break;
            case 1002://下方墙壁
            this.y = Math.abs(this.y);break;
            case 1003://左墙壁
            this.x = Math.abs(this.x);break;
            case 1004://右墙壁
            this.x = -Math.abs(this.x);break;
            case 1702:
            if(self.tag==1705&&!this.player.getComponent('hidden2player').ifBoard){
                this.ifPlayer=true
                this.player.getComponent('hidden2player').ifBoard = true
            }
            break;
        }
    },
    changeRotate(){
        var leg = Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))
        var sin = this.x/(leg+0.001)
        var R=Math.asin(sin)
        R = R/3.14*180
        if(this.y<0){
            R = 180-R
        }
        if(this.x==0&&this.y==0){
            R = this.rot
        }
        this.node.rotation = R
        this.rot = R
    },
    onCollisionExit: function (other, self) {
        switch(other.tag){
            case 1702:
            this.ifPlayer=false
            this.player.getComponent('hidden2player').ifBoard = false
            break;
        }
    }
});
