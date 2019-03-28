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
        fire: {
            default: null,
            type: cc.Prefab,
        },
        size:150,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;

        this.maxHP = variables.boss2MaxHP
        this.HP = this.maxHP
        this.boss2ChangeMoveTime = variables.boss2ChangeMoveTime
        this.boss2FireSpeed = variables.boss2FireSpeed

        this.boss2Bonfires1 = this.node.getChildByName('boss2Bonfires1')
        this.boss2Bonfires2 = this.node.getChildByName('boss2Bonfires2')
        this.boss2Bonfires3 = this.node.getChildByName('boss2Bonfires3')
        this.boss2Bonfires1.active = false
        this.boss2Bonfires2.active = false
        this.boss2Bonfires3.active = false
        var self = this
        this.fireAttack1()
        var n = false
        this.schedule(function(){
            if(n){
                this.fireAttack1()
            } else {
                this.fireAttack2()
                this.fireAttack3()
            }
            n =!n
        },variables.boss2ChangeMoveTime,'bossChangeMoveTime')
    },

    update (dt) {},
    fireAttack1(){
        var self = this
        this.schedule(function() {
            var fire = cc.instantiate(this.fire)
            self.node.addChild(fire)
        
            // var ram1 = Math.random()*2-1
            // var ram2 = Math.random()*2-1
            // var leg = Math.sqrt(Math.pow(ram1,2)+Math.pow(ram2,2))
            var player = cc.find('Canvas/player')
            var playerPos = player.getPosition()
            // console.log(playerPos.x)
            var dx = playerPos.x-this.node.getPosition().x
            var dy = playerPos.y-this.node.getPosition().y
            var leg = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2))
            var R = Math.asin(dx/(leg+0.01))/3.14*180
            if(dy<0){R = 180-R}
            R = R+(Math.random()*60-30)
            // console.log(R)
            fire.getComponent('ani_fire').mode = 'boss1'
            fire.getComponent('ani_fire').COS = Math.sin(R/180*3.14)
            fire.getComponent('ani_fire').SIN = Math.cos(R/180*3.14)
        }, 0.1, 100, 0);

        // fire.setPosition(this.node.getPosition())
        // this.current = cc.audioEngine.play(this.audio[0], false, 0.5);
    },
    fireAttack2(){
        var self = this
        this.schedule(function() {
            var fire = cc.instantiate(this.fire)
            self.node.addChild(fire)
        
            var ram1 = Math.random()*2-1
            var ram2 = Math.random()*2-1
            var leg = Math.sqrt(Math.pow(ram1,2)+Math.pow(ram2,2))
        
            fire.getComponent('ani_fire').mode = 'boss2'
            fire.getComponent('ani_fire').SIN = ram2/(leg+0.01)
            fire.getComponent('ani_fire').COS = ram1/(leg+0.01)
        }, 0.5, 40, 0);

        // fire.setPosition(this.node.getPosition())
        // this.current = cc.audioEngine.play(this.audio[0], false, 0.5);
    },
    fireAttack3(){
        var self = this
        this.schedule(function() {
            var fire = cc.instantiate(this.fire)
            self.node.addChild(fire)
        
            var ram1 = Math.random()*2-1
            var ram2 = Math.random()*2-1
            var leg = Math.sqrt(Math.pow(ram1,2)+Math.pow(ram2,2))
        
            fire.getComponent('ani_fire').mode = 'boss3'
            fire.getComponent('ani_fire').SIN = ram2/(leg+0.01)
            fire.getComponent('ani_fire').COS = ram1/(leg+0.01)
        }, 2, 5, 0);

        // fire.setPosition(this.node.getPosition())
        // this.current = cc.audioEngine.play(this.audio[0], false, 0.5);
    },
    onCollisionEnter: function (other, self) {
        switch(other.tag)
        {
            case 1005:
            // this.current = cc.audioEngine.play(this.audio, false, 0.25);
            this.HP -=variables.bulletSize/10
            this.node.setContentSize(this.size*(this.HP/(this.maxHP*2)+0.5), this.size*(this.HP/(this.maxHP*2)+0.5));
            if(this.HP<0){
                this.unschedule('bossChangeMoveTime');
                this.game.createItem()
                this.node.destroy()
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
    },
});
