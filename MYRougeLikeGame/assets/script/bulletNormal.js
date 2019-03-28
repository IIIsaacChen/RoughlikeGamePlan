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
        ani:{
            default:[],
            type:cc.Prefab,
        },
        audio: {
            default: [],
            type: cc.AudioClip
        },
        ifAlive:true,
        ifDead:false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.time = 0
        this.node.children.active = false
        //AIshoot
        this.ifBulletAI = this.pattern
        this.ifAIChange = false
        this.deltaPosX = variables.deltaFirePosX
        this.deltaPosY = variables.deltaFirePosY
        this.bulletSpeed = variables.bulletSpeed
        var leg = Math.sqrt(Math.pow(this.deltaPosX,2)+Math.pow(this.deltaPosY,2))
        this.sin = this.deltaPosY/leg
        this.cos = this.deltaPosX/leg
        var self = this
        this.timer = setTimeout(function(){
            if(!self.ifDead){self.node.destroy();self.ifDead = true;}
        },variables.bulletDistance)
        this.bulletFrequency = variables.bulletFrequency
        this.bulletDistance = variables.bulletDistance
        this.bulletSpeed = variables.bulletSpeed
        this.bulletSize = variables.bulletSize
        this.boxCollide = this.node.getComponent(cc.BoxCollider)
        this.node.setContentSize(this.bulletSize,this.bulletSize)
        this.boxCollide.size.width = this.bulletSize
        this.boxCollide.size.height = this.bulletSize
        this.x = this.cos*this.bulletSpeed
        this.y = this.sin*this.bulletSpeed
    },

    update (dt) {
        if(this.ifAlive){
            this.time+=dt
            var move = cc.moveBy(0.01,this.x*dt,this.y*dt)
            this.node.runAction(move)
        }

    },
    onCollisionEnter: function (other, self) {
        switch(other.tag)
        {
            case 1000:
            case 1010:
            case 1500:
            case 1501:
            case 1200:
            // console.log(this.special)
            if(variables.bulletSpecial.indexOf("thunderCore")!=-1)
            {
                cc.audioEngine.play(this.audio[0], false, 2);
                this.ifAlive = false
                this.thunder = cc.instantiate(this.ani[0])
                this.node.parent.addChild(this.thunder)
                this.thunder.setPosition(this.node.getPosition())
            }
            this.node.removeFromParent();

            case 1009://AIShoot1
            if(this.ifBulletAI&&!this.ifAIChange&&this.time<0.1){
                // console.log()
                // var x1 = other.world.position.x
                // var x2 = self.world.position.x
                var preAabb = other.world.preAabb;
                // console.log(preAabb.x)
                var aabb = other.world.aabb;
                var deltax = aabb.x-preAabb.x
                var deltay = aabb.y-preAabb.y
                // console.log(aabb.x)
                var targetPos = cc.find('Canvas').convertToNodeSpaceAR(other.world.position)
                var x = targetPos.x-this.node.getPosition().x
                var y = targetPos.y-this.node.getPosition().y
                var leg = Math.sqrt(Math.pow(x,2)+Math.pow(y,2))//leg是两者之间的距离
                var time = leg/this.bulletSpeed
                targetPos.x = targetPos.x+time*60*deltax
                targetPos.y = targetPos.y+time*60*deltay
                var x = targetPos.x-this.node.getPosition().x
                var y = targetPos.y-this.node.getPosition().y
                var leg = Math.sqrt(Math.pow(x,2)+Math.pow(y,2))//leg是两者之间的距离
                this.sin = y/leg
                this.cos = x/leg
                this.x = this.cos*this.bulletSpeed
                this.y = this.sin*this.bulletSpeed
                this.ifAIChange = true
            }
            break;

        }
    },
  
    
});
