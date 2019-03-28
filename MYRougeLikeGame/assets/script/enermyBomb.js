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
        pattern:0,
        ani_fire:{
            default:null,
            type:cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.player = cc.find('Canvas/player')
        this.maxHP = variables.enermyBombMaxHP
        this.HP = this.maxHP
        // this.fireAni = this.node.getChildByName('ani_fire')
        // this.fireAni.active = false
        var posX = this.node.getPosition().x
        var posY = this.node.getPosition().y
        var playerPosX = this.player.getPosition().x
        var playerPosY = this.player.getPosition().y
        this.enermyBombSpeed = variables.enermyBombSpeed
        this.enermyBombMaxHP = variables.enermyBombMaxHP
        var leg = Math.sqrt(Math.pow(playerPosX-posX,2)+Math.pow(playerPosY-posY,2))
        this.cos = (playerPosX-posX)/leg
        this.sin = (playerPosY-posY)/leg
        this.time = Math.abs(leg/(this.enermyBombSpeed+0.1)*1.05)
        var self = this
        var fireAni = cc.instantiate(this.ani_fire)
        this.node.parent.addChild(fireAni)
        fireAni.active = false
        var anim = fireAni.getComponent(cc.Animation);
        // var animState = anim.play('suicide_fire');
        this.timer = setTimeout(function(){
            fireAni.active = true
            self.node.opacity=0
            fireAni.setPosition(self.node.getPosition())
            self.pattern=1
            var animState = anim.play('suicide_fire');
            animState.wrapMode = cc.WrapMode.Loop;
        },this.time*1000)
    },

    update (dt) {
        if(this.pattern==0){
            var move = cc.moveBy(0.2,this.cos*dt*this.enermyBombSpeed,this.sin*dt*this.enermyBombSpeed)
            this.node.runAction(move)
        }
    },
    onCollisionEnter: function (other, self) {
        switch(other.tag)
        {
            case 1005:
            clearTimeout(this.timer);
            this.HP -=variables.bulletSize/10
            if(this.HP<0){
                this.node.destroy()
            }
            break;
        }
    }
});
