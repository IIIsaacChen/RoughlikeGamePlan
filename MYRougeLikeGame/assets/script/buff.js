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
        price: {
            default:null,
            type: cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.price.setPosition(0,-70)
        if(this.pattern=="shop"){
            this.price.getComponent(cc.Label).string = variables.itemCost
        } else{
            this.price.getComponent(cc.Label).string = '0'
        }

        // price.string = variables.itemCost
        // console.log(variables.itemCost)
        // price.string = '15'
    },
    bossFreeItem(){
        this.price.getComponent(cc.Label).string = '0'
    },
    // onCollisionEnter: function (other, self) {
    //     switch(other.tag)
    //     {
    //         case 1007:
    //         if(variables.playerCoin>=parseInt(this.price.getComponent(cc.Label).string)){
    //             variables.playerCoin-=parseInt(this.price.getComponent(cc.Label).string)
    //             this.node.destroy()
    //         }
    //         break;
    //     }
    // },
    // getCost(){
    //     return this.price
    // },
    update (dt) {},
});
