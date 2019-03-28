// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var variables = require('variables')
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
        audio: {
            default: null,
            type: cc.AudioClip
        },
        rotate:0,
        size:100,
        HP:0,
        maxHP:0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // this.game = cc.find('Canvas')
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.bossSpeed = variables.boss1Speed
        this.HP = variables.boss1MaxHP
        this.maxHP = this.HP
        var ram1 = Math.random()*2-1
        var ram2 = Math.random()*2-1
        var leg = Math.sqrt(ram1*ram1+ram2*ram2)
        ram1 = ram1/leg
        ram2 = ram2/leg
        this.x = ram1*this.bossSpeed
        this.y = ram2*this.bossSpeed
        this.schedule(function(){
            this.changeMoveDirection()           
        },variables.boss1ChangeMoveTime,'bossChangeMoveTime')
    },
    changeMoveDirection(){
        var x = this.node.getPosition().x
        var y = this.node.getPosition().y
        var leg = Math.sqrt(x*x+y*y)
        var sin = -x/leg
        var cos = -y/leg
        this.x = sin*this.bossSpeed
        this.y = cos*this.bossSpeed
    },
    update (dt) {
        var move = cc.moveBy(0.05,this.x*dt,this.y*dt)
        this.node.runAction(move)
        this.node.setRotation(this.rotate)
        this.rotate+=1
    },
    onCollisionEnter: function (other, self) {
        switch(other.tag)
        {
            case 1005:
            this.current = cc.audioEngine.play(this.audio, false, 0.25);
            this.HP -=variables.bulletSize/10
            this.node.setContentSize(this.size*(this.HP/(this.maxHP*2)+0.5), this.size*(this.HP/(this.maxHP*2)+0.5));
            if(this.HP<0){
                this.unschedule('bossChangeMoveTime');
                this.game.createItem()
                this.node.destroy()
            }
            break;
            case 1001://上方墙壁
            this.y = -Math.abs(this.y);this.pattern+=1;break;
            case 1002://下方墙壁
            this.y = Math.abs(this.y);this.pattern+=1;break;
            case 1003://左墙壁
            this.x = Math.abs(this.x);this.pattern+=1;break;
            case 1004://右墙壁
            this.x = -Math.abs(this.x);this.pattern+=1;break;
        }
    },
});
