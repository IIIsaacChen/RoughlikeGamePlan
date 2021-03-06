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
        coin:{
            default:null,
            type:cc.Prefab,
        },
        pattern:0,
        size:50,
        ifAlive:true,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var manager = cc.director.getCollisionManager();
        this.life = cc.find("canvas/life")
        manager.enabled = true;
        this.enermySpeed = variables.enermySpeed
        this.HP = variables.enermyMaxHP
        this.maxHP = variables.enermyMaxHP
        var ram1 = Math.random()*2-1
        var ram2 = Math.random()*2-1
        var leg = Math.sqrt(ram1*ram1+ram2*ram2)
        ram1 = ram1/leg
        ram2 = ram2/leg
        this.x = ram1*this.enermySpeed
        this.y = ram2*this.enermySpeed
    },

    update (dt) {
        if(this.ifAlive){
            var move = cc.moveBy(0.2,this.x*dt,this.y*dt)
            this.node.runAction(move)
        }

    },
    onCollisionEnter: function (other, self) {
        switch(other.tag)
        {
            case 1012://fireWall
            case 1005://子弹
            if(this.ifAlive){
                this.HP -=variables.bulletSize/10
                this.node.setContentSize(this.size*(this.HP/(this.maxHP*2)+0.5), this.size*(this.HP/(this.maxHP*2)+0.5));
                if(this.HP<=0){
                    this.node.setContentSize(this.size, this.size);
                    this.ifAlive = false
                    variables.playerCoin+=1
                    var anim =this.getComponent(cc.Animation);
                    var animState = anim.play('enermy1Die');
                    animState.wrapMode = cc.WrapMode.Normal
                    var self = this
                    this.createCoin()
                    setTimeout(function(){
                        var current = cc.audioEngine.play(self.audio, false, 0.25);
                        self.node.destroy()
                    },400)
                    // var animation = this.node.getComponent(cc.Animation);
                    // animState.on('finished',  this.node.destroy(),    this);
                    // this.node.destroy()
                }
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
        if(this.pattern==4){if(this.ifAlive){this.node.destroy()}}
    },
    createCoin(){
        var coin = cc.instantiate(this.coin)
        this.node.parent.addChild(coin)
        coin.setPosition(this.node.getPosition())
    }
});
