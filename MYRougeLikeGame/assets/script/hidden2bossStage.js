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
        board: {
            default: null,
            type: cc.Prefab,
        },
        timeDisplay: {
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
            
            this.bossstage = cc.find('Canvas/bg/bossstage')
            this.time = variables.hidden2Time
            this.ifBegin = false
            this.player = cc.find('Canvas/bg/player').getComponent('hidden2player')
    },

    update (dt) {
        if(this.time<0){
            cc.audioEngine.stopEffect(this.bgm);
            cc.director.loadScene("game_stage1");
        }
        if(this.time<15&&this.player.dieTime<20){
            cc.find('Canvas/bg/LZgate').active = true
        }
    },
    onCollisionEnter: function (other, self) {
        switch(other.tag)
        {
            case 1702://player
            if(!this.ifBegin){
                var self = this
                this.bgm = cc.audioEngine.play(this.audio, false, 0.5);
                this.timeDisplay.string = '坚持30s'
                setTimeout(function(){
                    self.bossstage.active = true
                    self.GameBegin()
                },5000)
                this.ifBegin = true
            }
        }
    },
    GameBegin(){
        this.schedule(function() {
            var board = cc.instantiate(this.board)
            this.node.addChild(board)
            board.setPosition(0,0)
        }, 0.2, 10, 0);
        this.schedule(function() {
            this.timeDisplay.string = 'time:'+this.time
            this.time -=1          
        }, 1, variables.hidden2Time, 1);
    },
});
