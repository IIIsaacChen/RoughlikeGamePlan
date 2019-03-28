// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

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
            default: [],
            type: cc.AudioClip
        },
        item: {
            default: [],
            type: cc.Prefab,
        },
        speed1:300,
        speed2:900,
        ifButton:false,
        pattern:0
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.lineAdd = 0
        this.item = cc.instantiate(this.item[0])
        this.node.parent.addChild(this.item)
        this.item.setPosition(0,0)
        this.item.opacity = 0
        this.player = cc.find('Canvas/player')
        this.line = cc.find('Canvas/hook/line')
        this.gold1 = cc.find('Canvas/gold1')
        this.gold2 = cc.find('Canvas/gold2')
        this.node.setRotation(-85)
        this.rotate = 15
        var n = 1
        this.schedule(function(){
            if(!this.ifButton){
                this.node.setRotation(this.rotate)
                this.rotate+=n
                if(this.rotate>44||this.rotate<-84){
                    n = -n
                }
            }
        },0.015,'rotate')
    },
    catch(){
        var rot = this.line.rotation
        var rot1 = this.node.rotation
        var rot = rot+rot1
        var sin = Math.sin(rot/180*3.14)
        var cos = Math.cos(rot/180*3.14)
        this.x = -this.speed1*sin
        this.y = -cos*this.speed1
        this.ifButton = true
        // console.log(this.x)
    },
    update (dt) {
        // if(this.item.opacity>250){
        //     this.unschedule('appear')
        //     // console.log('helo')
        // }
        if(this.ifButton&&this.pattern==0){
            var move = cc.moveBy(0.2,this.x*dt,this.y*dt)
            this.node.runAction(move)
            this.line.setContentSize(2,34+this.lineAdd)
            this.lineAdd+=this.speed1*dt
        }
        if(this.pattern==1){
            var move = cc.moveBy(0.2,-3*this.x*dt,-3*this.y*dt)
            this.node.runAction(move)
            this.line.setContentSize(2,34+this.lineAdd)
            this.lineAdd-=this.speed1*dt*3
            if(this.lineAdd<0){
                this.ifButton=false
                this.pattern=0
            }
        }
        if(this.pattern==2){
            var move = cc.moveBy(0.2,-0.3*this.x*dt,-0.3*this.y*dt)
            // this.gold1.runAction(move)
            this.node.runAction(move)
            this.line.setContentSize(2,34+this.lineAdd)
            this.lineAdd-=this.speed1*dt*0.3
            if(this.lineAdd<0){
                this.ifButton=false
                this.pattern=0
            }
        }
        if(this.pattern==3){
            var move = cc.moveBy(0.2,-0.3*this.x*dt,-0.3*this.y*dt)
            // this.gold2.runAction(move)
            this.node.runAction(move)
            this.line.setContentSize(2,34+this.lineAdd)
            this.lineAdd-=this.speed1*dt*0.3
            if(this.lineAdd<0){
                this.ifButton=false
                this.pattern=0
            }
        }
    },
    onCollisionEnter: function (other, self) {
        switch(other.tag)
        {
            case 1601://bangalore
                this.current = cc.audioEngine.play(this.audio[1], false, 1);
            case 1605://bg
                this.pattern = 1
                console.log('helo')
                break;
            case 1604://gold1
                this.current = cc.audioEngine.play(this.audio[0], false, 1);
                this.pattern = 2
                break;
            case 1603://goldBag
                this.pattern = 2
                var self = this
                setTimeout(function(){
                    self.current = cc.audioEngine.play(self.audio[2], false, 1);
                    self.createDragonBall2()
                },2500)
                
                break;

        }
    },
    createDragonBall2(){
        var size= 100
        this.schedule(function(){
            this.item.opacity +=4
            size -=0.15
            this.item.setContentSize(size,size)
        },0.01,250,0)
        var self = this
        setTimeout(function(){
            var move = cc.moveTo(2,self.player.getPosition())
            self.item.runAction(move)
            setTimeout(function(){
                //getLZ2
                self.current = cc.audioEngine.play(self.audio[4], false, 1);
                self.item.opacity = 0
            },2000)
        },4000)
        this.item.opacity
        // item.getComponent('buff').pattern = "boss"
    }

    // update (dt) {},
});
