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
        pattern:0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
    //     this.hook = cc.find('Canvas/hook').getComponent('hook')
    //     this.x = this.hook.x
    //     this.y = this.hook.y
    },

    update (dt) {
        if(this.pattern!=0){
            var move = cc.moveBy(0.2,-0.3*this.x*dt,-0.3*this.y*dt)
            this.node.runAction(move)
            this.lineAdd-=this.speed1*dt*0.3
            if(this.lineAdd<0){
                variables.playerCoin+=5
                this.current = cc.audioEngine.play(this.audio, false, 1);                    
                this.node.destroy()
                this.pattern = 0
            }
        }  
    },
    onCollisionEnter: function (other, self) {
        switch(other.tag)
        {
            case 1602://hook
            this.hook = cc.find('Canvas/hook').getComponent('hook')
            this.x = this.hook.x
            this.y = this.hook.y
            this.lineAdd = this.hook.lineAdd
            this.speed1 = this.hook.speed1
            this.pattern = 1
            break;
        }
    },
});
