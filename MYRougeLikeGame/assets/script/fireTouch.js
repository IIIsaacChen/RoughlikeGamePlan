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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.player = cc.find('Canvas/player')
        this.fire = cc.find('Canvas/fireTouch/fire')
        var self = this
        this.node.on(cc.Node.EventType.TOUCH_START,function(event){
            self.player.createBullet()
        })
        this.node.on(cc.Node.EventType.TOUCH_MOVE,function(event){
            // self.createBullet()
            var centerX = 490
            var centerY = -210
            variables.deltaFirePosX = event.getLocation().x-centerX
            variables.deltaFirePosY = event.getLocation().y-centerY
            // self.changeFireButtenRotation()
        })
        this.node.on(cc.Node.EventType.TOUCH_END,function(event){
            self.player.unscheduleAllCallbacks()
        })
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,function(event){
            self.player.unscheduleAllCallbacks()
        })
    },
    changeFireButtenRotation(){
        this.deltaFirePosX = variables.deltaFirePosX
        this.deltaFirePosY = variables.deltaFirePosY
        var leg = Math.sqrt(Math.pow(this.deltaFirePosX,2)+Math.pow(this.deltaFirePosY,2))
        var sin = this.deltaFirePosX/leg
        var R = Math.asin(this.deltaFirePosX/leg)/3.14*180
        if(this.deltaFirePosY<0){
            R = 180-R
        }
        if(Math.abs(this.exFireR-R)>45){
            this.fire.setRotation(R)
        }
    },

    // update (dt) {},
});
