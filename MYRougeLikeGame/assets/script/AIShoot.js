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
        distance:2000,
        pattern:false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // this.player = this.node.parent
        var self = this
        this.schedule(function(){
            self.distance = 1000
        },0.25)
    },
    // onCollisionEnter: function (other, self) {
    //     var deltax = other.world.x-self.world.x
    //     var deltay = other.world.y-self.world.y
    // },
    onCollisionStay: function (other, self) {
        if(other.tag==1000){
            var deltax = other.node.getPosition().x-self.node.getPosition().x
            var deltay = other.node.getPosition().y-self.node.getPosition().y
            var dis = Math.sqrt(Math.pow(deltax,2)+Math.pow(deltay,2))
            // variables.deltaFirePosX = deltax
            // variables.deltaFirePosY = deltay
            if(dis<=this.distance){
                this.distance=dis
                if(this.pattern){
                    variables.deltaFirePosX = deltax
                    variables.deltaFirePosY = deltay
                }
            }
        }
    },
    OpenUseAIShoot(){
        this.pattern = !this.pattern
    }
    // update (dt) {},
});
