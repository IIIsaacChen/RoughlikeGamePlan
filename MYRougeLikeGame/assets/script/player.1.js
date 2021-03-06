// // Learn cc.Class:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
// //  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// // Learn Attribute:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
// //  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
// //  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
// var variables = require('variables')
// cc.Class({
//     extends: cc.Component,

//     properties: {
//         // foo: {
//         //     // ATTRIBUTES:
//         //     default: null,        // The default value will be used only when the component attaching
//         //                           // to a node for the first time
//         //     type: cc.SpriteFrame, // optional, default is typeof default
//         //     serializable: true,   // optional, default is true
//         // },
//         // bar: {
//         //     get () {
//         //         return this._bar;
//         //     },
//         //     set (value) {
//         //         this._bar = value;
//         //     }
//         // },
//         bullet:{
//             default:[],
//             type:cc.Prefab,
//         },
//         audio: {
//             default: null,
//             type: cc.AudioClip
//         },
//         gameList: {
//             default: null,
//             type: cc.JsonAsset,
//         },
//         life:{
//             default:null,
//             type:cc.Node,
//         },
//         joyStick:{
//             default:null,
//             type:cc.Prefab,
//         },
        
//         exR:0,
//         exFireR:0,
//         exFireX:0,
//         exFireY:0,
//         exMoveX:0,
//         exMoveY:0,
//         sin:0,
//         cos:0,
//         ifOutOfScreen:0,
//     },

//     // LIFE-CYCLE CALLBACKS:

//     onLoad () {
//         this.canvasWidth = variables.canvasWidth
//         this.canvasHeight = variables.canvasHeight
//         this.json = this.gameList.json

//         // var manager = cc.director.getCollisionManager();
//         // manager.enabledDebugDraw = true;
//     },

//     start () {
//         var manager = cc.director.getCollisionManager();
//         manager.enabled = true;
//         // manager.enabledDebugDraw = true;
//         this.joyStickCenter = cc.instantiate(this.joyStick)
//         this.node.parent.addChild(this.joyStickCenter)
//         // this.joyStickCenter.active=false
//         this.joyStickCenter.opacity = 0
//         this.move = this.joyStickCenter.getChildByName("Joystick_stick")
//         var self = this
//         var moveTouch = cc.find('Canvas/moveTouch')
//         var fireTouch = cc.find('Canvas/fireTouch')
//         this.fire = cc.find('Canvas/fireTouch/fire')
//         this.label = cc.find('Canvas/labelLeft/labelRight')
//         var center = cc.find('Canvas/fireTouch/center')
//         moveTouch.on(cc.Node.EventType.TOUCH_START,function(event){
//             // self.joyStickCenter.active=true
//             self.joyStickCenter.opacity = 255
//             // self.joyStick = cc.instantiate(self.joyStick)
//             // self.node.parent.addChild(self.joyStick)
//             // console.log('hello')
//             self.joyStickCenter.setPosition(self.node.parent.convertToNodeSpaceAR(event.getLocation()))
//             // self.move = self.joyStick.getChildByName("Joystick_stick")
//         })
//         moveTouch.on(cc.Node.EventType.TOUCH_MOVE,function(event){
//             self.exMoveX +=event.getDelta().x
//             self.exMoveY +=event.getDelta().y
//             var leg = Math.sqrt(Math.pow(self.exMoveX,2)+Math.pow(self.exMoveY,2))
//             self.sin = self.exMoveX/leg
//             self.cos = self.exMoveY/leg
//             console.log(self.cos)
//             if(self.sin>0 && self.ifOutOfScreen==1003) {self.ifOutOfScreen=0}
//             if(self.sin<0 && self.ifOutOfScreen==1004) {self.ifOutOfScreen=0}
//             if(self.cos>0 && self.ifOutOfScreen==1002) {self.ifOutOfScreen=0}
//             if(self.cos<0 && self.ifOutOfScreen==1001) {self.ifOutOfScreen=0}
//             variables.deltaMovePosX = self.exMoveX
//             variables.deltaMovePosY = self.exMoveY
//             self.changeMoveButtenRotation()
//             self.changeRotation()
//             // var move = cc.moveBy(0.5,variables.playerSpeed*sin,variables.playerSpeed*cos)
//             // self.node.runAction(move)
//             // self.changeRotation()
//             // var move = cc.moveBy(0.5,event.getDelta())
//             // variables.deltaPosX = event.getDelta().x
//             // variables.deltaPosY = event.getDelta().y
//             // self.node.runAction(move)
//             // self.changeRotation()
//         })
//         moveTouch.on(cc.Node.EventType.TOUCH_END,function(event){
//             // self.joyStickCenter.active=false
//             self.joyStickCenter.opacity = 0
//             self.exMoveX =0
//             self.exMoveY =0
//             self.sin = 0
//             self.cos = 0
//         })
//         moveTouch.on(cc.Node.EventType.TOUCH_CANCEL,function(event){
//             // self.joyStickCenter.active=false
//             self.joyStickCenter.opacity = 0
//             self.exMoveX =0
//             self.exMoveY =0
//             self.sin = 0
//             self.cos = 0
//         })
//         fireTouch.on(cc.Node.EventType.TOUCH_START,function(event){
//             self.createBullet()
//         })
//         fireTouch.on(cc.Node.EventType.TOUCH_MOVE,function(event){
//             // self.createBullet()
//             self.exFireX+=event.getDelta().x
//             self.exFireY+=event.getDelta().y
//             variables.deltaFirePosX = self.exFireX
//             variables.deltaFirePosY = self.exFireY
//             self.changeFireButtenRotation()
//             // console.log(variables.deltaFirePosY)
//         })
//         fireTouch.on(cc.Node.EventType.TOUCH_END,function(event){
//             self.unscheduleAllCallbacks()
//             self.exFireX = 0
//             self.exFireY = 0
//         })
//         fireTouch.on(cc.Node.EventType.TOUCH_CANCEL,function(event){
//             self.unscheduleAllCallbacks()
//             self.exFireX = 0
//             self.exFireY = 0
//         })
//     },

//     update (dt) {  
//         this.bulletFrequency = variables.bulletFrequency
//         this.bulletDistance = variables.bulletDistance
//         this.bulletSpeed = variables.bulletSpeed
//         this.bulletSize = variables.bulletSize
//         this.move1 = null
//         if(this.joyStickCenter.opacity==255){
//             switch(this.ifOutOfScreen)
//             {
//                 case 0:this.move1 = cc.moveBy(0.3,variables.playerSpeed*this.sin*dt,variables.playerSpeed*this.cos*dt);break;
//                 case 1001:this.move1 = cc.moveBy(0.3,variables.playerSpeed*this.sin*dt,0);break;
//                 case 1002:this.move1 = cc.moveBy(0.3,variables.playerSpeed*this.sin*dt,0);break;
//                 case 1003:this.move1 = cc.moveBy(0.3,0,variables.playerSpeed*this.cos*dt);break;
//                 case 1004:this.move1 = cc.moveBy(0.3,0,variables.playerSpeed*this.cos*dt);break;
//                 default:this.move1 = cc.moveBy(0.3,variables.playerSpeed*this.sin*dt,variables.playerSpeed*this.cos*dt);break;
//             }
//             // var move = cc.moveBy(0.1,variables.playerSpeed*this.sin*dt,variables.playerSpeed*this.cos*dt)
//             this.node.runAction(this.move1)
//             console.log('hol')
//         }
//     },
//     createBullet(){
//         this.schedule(function(){
//             var bullet = cc.instantiate(this.bullet[0])
//             this.node.parent.addChild(bullet)
//             bullet.setPosition(this.node.getPosition())
//             this.current = cc.audioEngine.play(this.audio, false, 0.3);
//         },variables.bulletFrequency,'bullet')
//         // console.log('hello')
//     },
//     changeRotation(){
//         var R = Math.asin(this.sin)/3.14*180
//         if(this.cos<0){
//             R = 180-R
//         }
//         this.node.setRotation(R)
//     },
//     changeFireButtenRotation(){
//         this.deltaFirePosX = variables.deltaFirePosX
//         this.deltaFirePosY = variables.deltaFirePosY
//         var leg = Math.sqrt(Math.pow(this.deltaFirePosX,2)+Math.pow(this.deltaFirePosY,2))
//         // var sin = this.deltaFirePosX/leg
//         var R = Math.asin(this.deltaFirePosX/leg)/3.14*180
//         if(this.deltaFirePosY<0){
//             R = 180-R
//         }
//         this.fire.setRotation(R)
//     },
//     changeMoveButtenRotation(){
//         this.deltaMovePosX = variables.deltaMovePosX
//         this.deltaMovePosY = variables.deltaMovePosY
//         var leg = Math.sqrt(Math.pow(this.deltaMovePosX,2)+Math.pow(this.deltaMovePosY,2))
//         // var sin = this.deltaMovePosX/leg
//         var R = Math.asin(this.deltaMovePosX/leg)/3.14*180
//         if(this.deltaMovePosY<0){
//             R = 180-R
//         }
//         this.move.setRotation(R)
//     },
//     onCollisionEnter: function (other, self) {
//         switch(other.tag)
//         {
//             case 1000:
//             case 1500:
//             case 1501:
//             variables.playerHP-=1
//             this.life.setContentSize(variables.playerHP*20,20)
//             break;
//             case 1001://上方墙壁
//             // this.cos = -Math.abs(this.cos);
//             this.node.stopAllActions();
//             this.ifOutOfScreen = 1001;break;
//             case 1002://下方墙壁
//             // this.cos = Math.abs(this.cos);
//             this.node.stopAllActions();
//             this.ifOutOfScreen = 1002;
//             console.log(this.ifOutOfScreen);break;
//             case 1003://左墙壁
//             // this.sin = Math.abs(this.sin);
//             this.node.stopAllActions();
//             this.ifOutOfScreen = 1003;break;
//             case 1004://右墙壁
//             // this.sin = -Math.abs(this.sin);
//             this.node.stopAllActions();
//             this.ifOutOfScreen = 1004;break;
            
//         }//道具类item
//         if(other.tag<999)
//         {
//             this.itemData = this.json[other.tag]
//             var money = parseInt(other.node.getChildByName("price").string);
//             // console.log(money)
//             if(variables.playerCoin>money){
//                 other.node.destroy()
//                 variables.playerCoin-=money
//                 if(this.itemData.way=="add"){
//                     this.itemAddEffect()
//                 }
//             }
//             // if(this.itemData.way=="change"){
//             //     variables.bulletFrequency=this.itemData.bulletFrequency;
//             //     variables.bulletDistance=this.itemData.bulletDistance;
//             //     variables.bulletSpeed=this.itemData.bulletSpeed;
//             //     variables.bulletSize=this.itemData.bulletSize;
//             // }
//         }
//     },
//     itemAddEffect(){
//         variables.bulletFrequency+=this.itemData.bulletFrequency;
//         variables.bulletDistance+=this.itemData.bulletDistance;
//         variables.bulletSpeed+=this.itemData.bulletSpeed;
//         variables.bulletSize+=this.itemData.bulletSize;
//         variables.playerHP+=this.itemData.playerHP;
//         this.life.setContentSize(variables.playerHP*20,20)
//     }
// });


// // Learn cc.Class:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
// //  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// // Learn Attribute:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
// //  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
// //  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
// var variables = require('variables')
// cc.Class({
//     extends: cc.Component,

//     properties: {
//         // foo: {
//         //     // ATTRIBUTES:
//         //     default: null,        // The default value will be used only when the component attaching
//         //                           // to a node for the first time
//         //     type: cc.SpriteFrame, // optional, default is typeof default
//         //     serializable: true,   // optional, default is true
//         // },
//         // bar: {
//         //     get () {
//         //         return this._bar;
//         //     },
//         //     set (value) {
//         //         this._bar = value;
//         //     }
//         // },
//         bullet:{
//             default:[],
//             type:cc.Prefab,
//         },
//         audio: {
//             default: null,
//             type: cc.AudioClip
//         },
//         gameList: {
//             default: null,
//             type: cc.JsonAsset,
//         },
//         life:{
//             default:null,
//             type:cc.Node,
//         },
//         joyStick:{
//             default:null,
//             type:cc.Prefab,
//         },
        
//         exR:0,
//         exFireR:0,
//         exFireX:0,
//         exFireY:0,
//         exMoveX:0,
//         exMoveY:0,
//         sin:0,
//         cos:0,
//         ifOutOfScreen:0,
//     },

//     // LIFE-CYCLE CALLBACKS:

//     onLoad () {
//         this.canvasWidth = variables.canvasWidth
//         this.canvasHeight = variables.canvasHeight
//         this.json = this.gameList.json

//         // var manager = cc.director.getCollisionManager();
//         // manager.enabledDebugDraw = true;
//     },

//     start () {
//         var manager = cc.director.getCollisionManager();
//         manager.enabled = true;
//         // manager.enabledDebugDraw = true;
//         this.joyStickCenter = cc.instantiate(this.joyStick)
//         this.node.parent.addChild(this.joyStickCenter)
//         // this.joyStickCenter.active=false
//         this.joyStickCenter.opacity = 0
//         this.move = this.joyStickCenter.getChildByName("Joystick_stick")
//         var self = this
//         var moveTouch = cc.find('Canvas/moveTouch')
//         var fireTouch = cc.find('Canvas/fireTouch')
//         this.fire = cc.find('Canvas/fireTouch/fire')
//         this.label = cc.find('Canvas/labelLeft/labelRight')
//         var center = cc.find('Canvas/fireTouch/center')
//         moveTouch.on(cc.Node.EventType.TOUCH_START,function(event){
//             // self.joyStickCenter.active=true
//             self.joyStickCenter.opacity = 255
//             // self.joyStick = cc.instantiate(self.joyStick)
//             // self.node.parent.addChild(self.joyStick)
//             // console.log('hello')
//             self.joyStickCenter.setPosition(self.node.parent.convertToNodeSpaceAR(event.getLocation()))
//             // self.move = self.joyStick.getChildByName("Joystick_stick")
//         })
//         moveTouch.on(cc.Node.EventType.TOUCH_MOVE,function(event){
//             self.exMoveX +=event.getDelta().x
//             self.exMoveY +=event.getDelta().y
//             var leg = 1+Math.sqrt(Math.pow(self.exMoveX,2)+Math.pow(self.exMoveY,2))
//             self.sin = self.exMoveX/leg
//             var sin1 = self.exMoveX/leg
//             console.log(sin1)
//             self.cos = self.exMoveY/leg
//             var cos1 = self.exMoveY/leg
//             console.log(cos1)
//             if(self.sin>0 && self.ifOutOfScreen==1003) {self.ifOutOfScreen=0}
//             if(self.sin<0 && self.ifOutOfScreen==1004) {self.ifOutOfScreen=0}
//             if(self.cos>0 && self.ifOutOfScreen==1002) {self.ifOutOfScreen=0}
//             if(self.cos<0 && self.ifOutOfScreen==1001) {self.ifOutOfScreen=0}
//             variables.deltaMovePosX = self.exMoveX
//             variables.deltaMovePosY = self.exMoveY
//             self.changeMoveButtenRotation()
//             self.changeRotation()
//             var move1 = cc.moveBy(0.3,self.playerSpeed*self.sin,self.playerSpeed*self.cos);
//             // console.log(self.playerSpeed*self.sin)
//             // var x1=self.playerSpeed*self.sin 
//             // var y1=self.playerSpeed*self.cos
//             // console.log(x1)
//             // var move1 = cc.moveBy(0.3,self.exMoveX/2,self.exMoveY/2);
//             self.node.runAction(move1)
//             // var move = cc.moveBy(0.5,variables.playerSpeed*sin,variables.playerSpeed*cos)
//             // self.node.runAction(move)
//             // self.changeRotation()
//             // var move = cc.moveBy(0.5,event.getDelta())
//             // variables.deltaPosX = event.getDelta().x
//             // variables.deltaPosY = event.getDelta().y
//             // self.node.runAction(move)
//             // self.changeRotation()
//         })
//         moveTouch.on(cc.Node.EventType.TOUCH_END,function(event){
//             // self.joyStickCenter.active=false
//             self.joyStickCenter.opacity = 0
//             self.exMoveX =0
//             self.exMoveY =0
//             self.sin = 0
//             self.cos = 0
//         })
//         moveTouch.on(cc.Node.EventType.TOUCH_CANCEL,function(event){
//             // self.joyStickCenter.active=false
//             self.joyStickCenter.opacity = 0
//             self.exMoveX =0
//             self.exMoveY =0
//             self.sin = 0
//             self.cos = 0
//         })
//         fireTouch.on(cc.Node.EventType.TOUCH_START,function(event){
//             self.createBullet()
//         })
//         fireTouch.on(cc.Node.EventType.TOUCH_MOVE,function(event){
//             // self.createBullet()
//             self.exFireX+=event.getDelta().x
//             self.exFireY+=event.getDelta().y
//             variables.deltaFirePosX = self.exFireX
//             variables.deltaFirePosY = self.exFireY
//             self.changeFireButtenRotation()
//             // console.log(variables.deltaFirePosY)
//         })
//         fireTouch.on(cc.Node.EventType.TOUCH_END,function(event){
//             self.unscheduleAllCallbacks()
//             self.exFireX = 0
//             self.exFireY = 0
//         })
//         fireTouch.on(cc.Node.EventType.TOUCH_CANCEL,function(event){
//             self.unscheduleAllCallbacks()
//             self.exFireX = 0
//             self.exFireY = 0
//         })
//     },

//     update (dt) {  
//         this.bulletFrequency = variables.bulletFrequency
//         this.bulletDistance = variables.bulletDistance
//         this.bulletSpeed = variables.bulletSpeed
//         this.bulletSize = variables.bulletSize
//         this.playerSpeed = variables.playerSpeed
//         this.move1 = null
//         if(this.joyStickCenter.opacity==255){
//             switch(this.ifOutOfScreen)
//             {
//                 case 0:this.move1 = cc.moveBy(0.3,variables.playerSpeed*this.sin*dt,variables.playerSpeed*this.cos*dt);break;
//                 case 1001:this.move1 = cc.moveBy(0.3,variables.playerSpeed*this.sin*dt,0);break;
//                 case 1002:this.move1 = cc.moveBy(0.3,variables.playerSpeed*this.sin*dt,0);break;
//                 case 1003:this.move1 = cc.moveBy(0.3,0,variables.playerSpeed*this.cos*dt);break;
//                 case 1004:this.move1 = cc.moveBy(0.3,0,variables.playerSpeed*this.cos*dt);break;
//                 default:this.move1 = cc.moveBy(0.3,variables.playerSpeed*this.sin*dt,variables.playerSpeed*this.cos*dt);break;
//             }
//             // var move = cc.moveBy(0.1,variables.playerSpeed*this.sin*dt,variables.playerSpeed*this.cos*dt)
//             this.node.runAction(this.move1)
//             console.log('hol')
//         }
//     },
//     createBullet(){
//         this.schedule(function(){
//             var bullet = cc.instantiate(this.bullet[0])
//             this.node.parent.addChild(bullet)
//             bullet.setPosition(this.node.getPosition())
//             this.current = cc.audioEngine.play(this.audio, false, 0.3);
//         },variables.bulletFrequency,'bullet')
//         // console.log('hello')
//     },
//     changeRotation(){
//         var R = Math.asin(this.sin)/3.14*180
//         if(this.cos<0){
//             R = 180-R
//         }
//         this.node.setRotation(R)
//     },
//     changeFireButtenRotation(){
//         this.deltaFirePosX = variables.deltaFirePosX
//         this.deltaFirePosY = variables.deltaFirePosY
//         var leg = Math.sqrt(Math.pow(this.deltaFirePosX,2)+Math.pow(this.deltaFirePosY,2))
//         // var sin = this.deltaFirePosX/leg
//         var R = Math.asin(this.deltaFirePosX/leg)/3.14*180
//         if(this.deltaFirePosY<0){
//             R = 180-R
//         }
//         this.fire.setRotation(R)
//     },
//     changeMoveButtenRotation(){
//         this.deltaMovePosX = variables.deltaMovePosX
//         this.deltaMovePosY = variables.deltaMovePosY
//         var leg = Math.sqrt(Math.pow(this.deltaMovePosX,2)+Math.pow(this.deltaMovePosY,2))
//         // var sin = this.deltaMovePosX/leg
//         var R = Math.asin(this.deltaMovePosX/leg)/3.14*180
//         if(this.deltaMovePosY<0){
//             R = 180-R
//         }
//         this.move.setRotation(R)
//     },
//     onCollisionEnter: function (other, self) {
//         switch(other.tag)
//         {
//             case 1000:
//             case 1500:
//             case 1501:
//             variables.playerHP-=1
//             this.life.setContentSize(variables.playerHP*20,20)
//             break;
//             case 1001://上方墙壁
//             // this.cos = -Math.abs(this.cos);
//             this.node.stopAllActions();
//             this.ifOutOfScreen = 1001;break;
//             case 1002://下方墙壁
//             // this.cos = Math.abs(this.cos);
//             this.node.stopAllActions();
//             this.ifOutOfScreen = 1002;
//             console.log(this.ifOutOfScreen);break;
//             case 1003://左墙壁
//             // this.sin = Math.abs(this.sin);
//             this.node.stopAllActions();
//             this.ifOutOfScreen = 1003;break;
//             case 1004://右墙壁
//             // this.sin = -Math.abs(this.sin);
//             this.node.stopAllActions();
//             this.ifOutOfScreen = 1004;break;
            
//         }//道具类item
//         if(other.tag<999)
//         {
//             this.itemData = this.json[other.tag]
//             var money = parseInt(other.node.getChildByName("price").string);
//             // console.log(money)
//             if(variables.playerCoin>money){
//                 other.node.destroy()
//                 variables.playerCoin-=money
//                 if(this.itemData.way=="add"){
//                     this.itemAddEffect()
//                 }
//             }
//             // if(this.itemData.way=="change"){
//             //     variables.bulletFrequency=this.itemData.bulletFrequency;
//             //     variables.bulletDistance=this.itemData.bulletDistance;
//             //     variables.bulletSpeed=this.itemData.bulletSpeed;
//             //     variables.bulletSize=this.itemData.bulletSize;
//             // }
//         }
//     },
//     itemAddEffect(){
//         variables.bulletFrequency+=this.itemData.bulletFrequency;
//         variables.bulletDistance+=this.itemData.bulletDistance;
//         variables.bulletSpeed+=this.itemData.bulletSpeed;
//         variables.bulletSize+=this.itemData.bulletSize;
//         variables.playerHP+=this.itemData.playerHP;
//         this.life.setContentSize(variables.playerHP*20,20)
//     }
// });
