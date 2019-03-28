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
        moneyDisplay: {
            default: null,
            type: cc.Label
        },
        timeDisplay: {
            default: null,
            type: cc.Label
        },
        audio: {
            default: null,
            type: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.current = cc.audioEngine.play(this.audio, false, 0.5);
        this.time = variables.hidden1Time
        this.schedule(function(){
            this.time-=1
        },1)
    },

    update (dt) {
        this.moneyDisplay.string = 'x'+variables.playerCoin
        this.timeDisplay.string = 'time:'+this.time
        if(this.time<=0){
            this.unscheduleAllCallbacks()
            cc.audioEngine.stopEffect(this.current);
            cc.director.loadScene("game_stage2");
        }
    },
    onCollisionEnter: function (other, self) {
        switch(other.tag)
        {
            case 1601://bangalore
            case 1603:
            case 1604:
            case 1605:
            this.pattern = 1
            console.log('helo')
            break;
        }
    }
});
