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
            default: [],
            type: cc.AudioClip
        },
        dieDisplay: {
            default: null,
            type: cc.Label
        },
        moneyDisplay: {
            default: null,
            type: cc.Label
        },
        speed:600,
        pattern:1,//0地面，1空中
        g : 200,
        jumpNumber:2,
        dieTime:0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {
        this.ifBoard = false
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.begin = cc.find('Canvas/begin')
        this.right = cc.find('Canvas/UI/right')
        this.left = cc.find('Canvas/UI/left')
        this.up = cc.find('Canvas/UI/up')
        this.bossstage = cc.find('Canvas/bg/bossstage')
        cc.find('Canvas/bg/lz').opacity = 0
        cc.find('Canvas/bg/sticklast').active = false
        cc.find('Canvas/bg/LZgate').active = false
        this.bossstage.active = false
        this.nextstage = true
        this.laststage = true
        this.lzstage = true
        this.laststageTime=0
        this.bg = cc.find('Canvas/bg')
        this.landLeft = cc.find('Canvas/bg/landleft')
        this.x = 0
        this.landLeft.active = false
        this.y = 0
        this.rot = 0
        this.speed = 1000
        this.g = 40
        this.pattern = 1
        this.xxx = 0//x为1的时候在说明自己是移动了才下坠
        var self = this
        this.right.on(cc.Node.EventType.TOUCH_START,function(event){
            self.x = self.speed/200
            self.xxx = 1
            // self.pattern = 0
        })
        this.right.on(cc.Node.EventType.TOUCH_END,function(event){
            self.x = 0
            // self.pattern = 0
        })
        this.right.on(cc.Node.EventType.TOUCH_CANCEL,function(event){
            self.x = 0
            // self.pattern = 0
        })
        this.left.on(cc.Node.EventType.TOUCH_START,function(event){
            self.x = -self.speed/200
            self.xxx = 1
            // self.pattern = 0
        })
        this.left.on(cc.Node.EventType.TOUCH_END,function(event){
            self.x = 0
            // self.pattern = 0
        })
        this.left.on(cc.Node.EventType.TOUCH_CANCEL,function(event){
            self.x = 0
            // self.pattern = 0
        })
        this.up.on(cc.Node.EventType.TOUCH_START,function(event){
            if(self.jumpNumber>0){
                self.y = 10
                self.pattern = 1
                self.jumpNumber-=1
                cc.audioEngine.play(self.audio[0], false, 1);
            }
            

        })
        this.up.on(cc.Node.EventType.TOUCH_END,function(event){
        })
        this.up.on(cc.Node.EventType.TOUCH_CANCEL,function(event){
        })
        
        // this.up.on(cc.Node.EventType.TOUCH_END,function(event){
        //     // self.x = 0
        // })
        // this.up.on(cc.Node.EventType.TOUCH_CANCEL,function(event){
        //     // self.x = 0
        // })
    },

    update (dt) {
        var move = cc.moveBy(0.01,this.x,this.y)
        this.node.runAction(move)
        if(this.pattern==1){
            this.y -=this.g*dt
        }
        this.changeRotate()
        this.dieDisplay.string = '死亡次数:'+this.dieTime
    },
    onCollisionEnter: function (other, self) {
        switch(other.tag)
        {
            case 1701://stick
            this.bgm = cc.audioEngine.play(this.audio[1], false, 1);
            this.node.setPosition(this.begin.getPosition())
            this.pattern = 1
            this.dieTime+=1
            if(!this.lzstage){
                var x = -440
                this.schedule(function() {
                    this.bg.setPosition(x,0)
                    x-=20
                }, 0.01, 40, 0); 
                this.lzstage = true
            }
            break;
            case 1700://land 
            this.node.stopAllActions()
            this.jumpNumber = 2
            this.pattern = 0
            this.y = 0
            break;
            case 1703:
            case 1705:
            this.y = 0
            // this.pattern = 0
            break;
            case 1704://nextstage
            if(this.nextstage){
                var x = 0
                this.node.active = false
                this.begin.setPosition(1250,20)
                var self = this
                this.landLeft.active = true
                setTimeout(function(){
                    self.node.active = true
                },1000)
                this.schedule(function() {
                    this.bg.setPosition(x,0)
                    x-=20
                }, 0.01, 62, 0); 
                this.nextstage=false
            }
            break;
            case 1707://laststage(only a time)
            if(this.laststage){
                var x = 0
                this.node.active = false
                this.begin.setPosition(-630,20)
                cc.find('Canvas/bg/last').setPosition(-600,-30)
                var self = this
                setTimeout(function(){
                    self.node.active = true
                },600)
                this.schedule(function() {
                    this.bg.setPosition(x,0)
                    x+=10
                }, 0.01, 20, 0); 
                this.laststage=false
            } else{
                var x = 200
                this.node.active = false
                    setTimeout(function(){
                        self.node.active = true
                    },600)
                this.schedule(function() {
                    this.bg.setPosition(x,0)
                    x-=10
                }, 0.01, 20, 0);
                var sticklast = cc.find('Canvas/bg/sticklast')
                cc.find('Canvas/bg/last').active = false
                cc.find('sticklast').active =  true
                cc.find('sticklast').opacity = 0
                var fadein = cc.fadeIn(2)
                cc.find('sticklast').runAction(fadein)
                this.begin.setPosition(-500,20)
                // this.laststage=flas
            }
             
            break;
            case 1708://gold
            cc.audioEngine.play(this.audio[2], false, 1);
            variables.playerCoin+=1
            other.node.destroy()
            this.moneyDisplay.string = 'x'+variables.playerCoin
            break;
            case 1709://lzway
            if(this.lzstage){
                cc.audioEngine.play(this.audio[3], false, 1);
                cc.find('Canvas/bg/lz').opacity = 255
                cc.find('Canvas/bg/lz').runAction(cc.blink(20,20))
                var x= -1240
                this.node.active = false
                setTimeout(function(){
                    self.node.active = true
                },600)
                this.schedule(function() {
                    this.bg.setPosition(x,0)
                    x+=20
                }, 0.01, 40, 0); 
                this.lzstage = false
            }
            cc.find('Canvas/bg/bossstage/rowStick123').setPosition(595,150)
            break;
            case 1710://lz
            cc.audioEngine.play(this.audio[4], false, 1);
            other.node.destroy()

           

        }
    },
    changeRotate(){
        var leg = Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))
        var sin = this.x/(leg+0.001)
        var R=Math.asin(sin)
        R = R/3.14*180
        if(this.y<0){
            R = 180-R
        }
        if(this.x==0&&this.y==0){
            R = this.rot
        }
        this.node.rotation = R
        this.rot = R
    },
    onCollisionExit: function (other, self) {
        // if(this.xxx==1){
            if(other.tag==1700){
                this.pattern=1
                this.xxx=0
                console.log('helo')
            }

        // }

    }
});
