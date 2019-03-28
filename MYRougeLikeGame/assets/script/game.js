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
        player: {
            default: null,
            type: cc.Node,
        },
        toss: {
            default: null,
            type: cc.Prefab,
        },
        NPC: {
            default: [],
            type: cc.Prefab,
        },
        enermy: {
            default: [],
            type: cc.Prefab,
        },
        item: {
            default: [],
            type: cc.Prefab,
        },
        boss: {
            default: [],
            type: cc.Prefab,
        },
        powerDisplay: {
            default: null,
            type: cc.Label
        },
        timeDisplay: {
            default: null,
            type: cc.Label
        },
        moneyDisplay: {
            default: null,
            type: cc.Label
        },
        warning: {
            default: null,
            type: cc.Prefab,
        },
    
        canvasWidth:1280,
        canvasHeight:720,
        leftTime:30,
        money:10,
        itemNum:7,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        variables.canvasWidth = this.canvasWidth
        variables.canvasHeight = this.canvasHeight
        this.leftTime = variables.stageTime
        //读取json道具文件
        // this.json = this.gameList.json
    },

    start () {
        this.bgm = cc.audioEngine.play(this.audio[0], false, 1);
        this.hiddenDial = cc.find('Canvas/hiddenStage')
        this.hiddenDial.opacity = 0
        // var text = this.json[0].tag
        //产生敌人
        this.schedule(function(){
            this.createEnermy()
        },variables.enermyFrequency,'enermy')
        //敌人成长
        this.schedule(function(){
            variables.enermyMaxHP +=1 
        },variables.enermyGrowTime,'enermyGrow')
        //产生toss
        this.schedule(function(){
            this.createToss()
        },variables.tossCreateTime,'tossCreateTime')

        this.schedule(function() {
            this.timeDisplay.string = 'time:'+this.leftTime
            this.leftTime-=1
            if(this.leftTime==-1){
                this.shopStage()
            }
        }, 1);
    },

    update (dt) {
        this.powerDisplay.string = variables.bulletFrequency.toFixed(2)+'\n'+variables. bulletSpeed.toFixed(2)/1000+'\n'+variables.bulletSize.toFixed(2)/10
        this.moneyDisplay.string = 'x'+variables.playerCoin
    },
    createToss(){
        var toss = cc.instantiate(this.toss)
        this.node.addChild(toss)
        toss.getComponent('toss').game = this
        //在地图边缘生成
        var ram1 = Math.random()*2-1
        var ram2 = Math.random()*2-1
        var ram3 = Math.random()*2-1
        if(ram3>0){
            ram2 = Math.abs(ram2)/(ram2+0.000001)
        } else {
            ram1 = Math.abs(ram1)/(ram1+0.01)
        }
        toss.setPosition(ram1*this.canvasWidth/2,ram2*this.canvasHeight/2)
    },
    createEnermy(){
        var enermy = cc.instantiate(this.enermy[0])
        this.node.addChild(enermy)
        //在地图边缘生成
        var ram1 = Math.random()*2-1
        var ram2 = Math.random()*2-1
        var ram3 = Math.random()*2-1
        if(ram3>0){
            ram2 = Math.abs(ram2)/(ram2+0.000001)
        } else {
            ram1 = Math.abs(ram1)/(ram1+0.01)
        }
        enermy.setPosition(ram1*this.canvasWidth/2,ram2*this.canvasHeight/2)
    },
    createItem(){
        var item = cc.instantiate(this.item[Math.floor(Math.random()*this.itemNum)])

        this.node.addChild(item)
        item.setPosition(0,0)
        item.getComponent('buff').pattern = "boss"
        this.leftTime = 10
        var player = cc.find('Canvas/player').getComponent('player')
        this.schedule(function() {
            this.timeDisplay.string = 'time:'+this.leftTime
            this.leftTime-=1
            if(this.leftTime<3){
                this.unscheduleAllCallbacks()
                // player.prepareChangeScene()
                this.player.destroy()
                var self = this
                setTimeout(function(){
                    console.log('game')
                    cc.audioEngine.stopEffect(self.bgm);
                    cc.director.loadScene("game_stage2");
                },3000)
            }
        }, 1);
        
    },
    shopStage(){
        var shopMan = cc.instantiate(this.NPC[0])
        this.node.addChild(shopMan)
        shopMan.setPosition(0,100)
        this.unscheduleAllCallbacks()
        this.leftTime = variables.shopTime
        var m1 = 0
        this.schedule(function(){
            // 这里的 this 指向 component
            var item = cc.instantiate(this.item[Math.floor(Math.random()*this.itemNum)])
        // var item = cc.instantiate(this.item[9])

            shopMan.addChild(item)
            item.setPosition(-200+m1,-200)
            item.getComponent('buff').pattern = "shop"
            m1+=200
        }, 0.5, 2, 0);

        // var item2 = cc.instantiate(this.item[Math.floor(Math.random()*this.itemNum)])
        // shopMan.addChild(item2)
        // item2.setPosition(0,-200)

        // var item3 = cc.instantiate(this.item[Math.floor(Math.random()*this.itemNum)])
        // shopMan.addChild(item3)
        // item3.setPosition(200,-200)

        this.schedule(function() {
            this.timeDisplay.string = 'time:'+this.leftTime
            this.leftTime-=1
            if(this.leftTime==-1){
                shopMan.destroy()
                this.bossStage()
            }
        }, 1);
    },
    bossStage(){
        //开始boss
        this.unscheduleAllCallbacks()
        this.current = cc.audioEngine.play(this.audio[1], false, 3);
        var warning = cc.instantiate(this.warning)
        this.node.addChild(warning)
        this.warningTwinkle(warning)
        var self = this
        setTimeout(function(){
            warning.destroy()
            var boss = cc.instantiate(self.boss[0])
            self.node.addChild(boss)
            boss.setPosition(0,0)
            boss.getComponent('boss1').game = self
        },2000)
    },
    warningTwinkle(warning){
        var time=0
        var x=-1
        while(time<500){
            warning.opacity+=x 
            time+=1
            if(warning.opacity<128||warning.opacity>250){
                x=-x
            }   
        }
            
    },
    hiddenDialStart(){
        this.hiddenDial.opacity=255
        var dial = cc.find('Canvas/hiddenStage/dial')
        var anim =dial.getComponent(cc.Animation);
        var animState = anim.play('dial');
        animState.wrapMode = cc.WrapMode.Loop
        var self = this
        setTimeout(function(){
            anim.stop();
            var ram = Math.floor(Math.random()*24)
            dial.setRotation(ram*24)
            if(ram<3){
                self.unscheduleAllCallbacks()
                self.player.destroy()
                setTimeout(function(){
                    cc.audioEngine.stopEffect(self.bgm);
                    cc.director.loadScene("hidden1GoldMiner");
                },2000)
            }
            if(ram>3){
                self.unscheduleAllCallbacks()   
                self.player.destroy()
                setTimeout(function(){
                    cc.audioEngine.stopEffect(self.bgm);
                    cc.director.loadScene("hidden2IWanna");
                },2000)
            }
            self.hiddenDial.opacity=0
        },3000)  
    }

});
