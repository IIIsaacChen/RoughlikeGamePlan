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
        ifMove: true,
        audio: {
            default: [],
            type: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var current = cc.audioEngine.play(this.audio[0], false, 0.5);
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.fireMaxHP = 5;
        this.fireHP = 5;
        this.pattern = this.mode
        var sin = this.SIN
        var cos = this.COS
        var boss2FireSpeed = variables.boss2FireSpeed
        if(this.pattern=='boss3'){
            boss2FireSpeed = 2*boss2FireSpeed
        }
        this.x = boss2FireSpeed*cos
        this.y = boss2FireSpeed*sin
        var self = this
        if(this.pattern=='boss2'){
            var ram = Math.random()+0.5
            setTimeout(function(){
                self.ifMove = false
            // self.node.destroy()
            },ram*1000)
        }
    },

    update (dt) {
        if((this.pattern!=null)&&this.ifMove){
            var move = cc.moveBy(0.2,this.x*dt,this.y*dt)
            this.node.runAction(move)
        }
    },
    onCollisionEnter: function (other, self) {
        switch(other.tag)
        {
            case 1005:
            this.fireHP-=variables.bulletSize/10
            this.node.setContentSize(50,(this.fireHP/(this.fireMaxHP*2)+0.5)*100)
            if(this.fireHP<0){
                this.node.destroy()
            }
            break;
            case 1001://上方墙壁
                if(this.pattern == 'boss3'){
                    this.y = -Math.abs(this.y);
                } else {
                    this.node.destroy()
                }
                break;
            case 1002://下方墙壁
                if(this.pattern == 'boss3'){
                    this.y = Math.abs(this.y);
                } else {
                    this.node.destroy()
                }
                break;
            case 1003://左墙壁
                if(this.pattern == 'boss3'){
                    this.x = Math.abs(this.x);
                } else {
                    this.node.destroy()
                }
                break;
            case 1004://右墙壁
                if(this.pattern == 'boss3'){
                    this.x = -Math.abs(this.x);
                } else {
                    this.node.destroy()
                }
                break;
        }
    }
});
