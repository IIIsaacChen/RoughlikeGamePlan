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
        size:50,
        HP:0,
        maxHP:0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.speed = variables.boss1entourageSpeed
        this.HP = variables.boss1entourageMaxHP
        this.maxHP = this.HP
        var angle = this.node.rotation+15
        // console.log(angle)
        // this.size =
        this.x = this.speed*Math.cos(angle/180*3.14)
        this.y = this.speed*Math.sin(angle/180*3.14)
        this.schedule(function(){
            this.x = -this.x
            this.y = -this.y
        },3)
        //this.delta = (this.anchor-variables.boss1entourageAnchor)/300
    },

    update (dt) {
        var move = cc.moveBy(4,this.x*dt,this.y*dt)
        this.node.runAction(move)
        
    },
    onCollisionEnter: function (other, self) {
        switch(other.tag)
        {
            case 1005:
            this.current = cc.audioEngine.play(this.audio, false, 0.25);
            this.HP -=1
            console.log(this.HP)
            this.node.setContentSize(this.size*(this.HP/(this.maxHP*2)+0.5), this.size*(this.HP/(this.maxHP*2)+0.5));
            if(this.HP==0){this.unscheduleAllCallbacks();this.node.destroy()}
            break;
        }
    },
});
