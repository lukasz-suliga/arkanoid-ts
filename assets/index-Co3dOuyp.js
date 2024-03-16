var f=Object.defineProperty;var b=(r,e,t)=>e in r?f(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var i=(r,e,t)=>(b(r,typeof e!="symbol"?e+"":e,t),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const h of a)if(h.type==="childList")for(const n of h.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function t(a){const h={};return a.integrity&&(h.integrity=a.integrity),a.referrerPolicy&&(h.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?h.credentials="include":a.crossOrigin==="anonymous"?h.credentials="omit":h.credentials="same-origin",h}function s(a){if(a.ep)return;a.ep=!0;const h=t(a);fetch(a.href,h)}})();class k{constructor(e,t){i(this,"width");i(this,"height");i(this,"x");i(this,"y");i(this,"canvasWidth");i(this,"canvasHeight");i(this,"speed");i(this,"movingLeft");i(this,"movingRight");i(this,"paddleImages");i(this,"animationFrame");i(this,"frameDelay");i(this,"frameDelayCounter");this.width=90,this.height=10,this.x=(e-this.width)/2,this.y=t-this.height-10,this.canvasWidth=e,this.canvasHeight=t,this.speed=6,this.movingLeft=!1,this.movingRight=!1,this.paddleImages=[],this.animationFrame=0,this.frameDelay=10,this.frameDelayCounter=0,this.preloadPaddleImages()}preloadPaddleImages(){for(let e=0;e<3;e++){const t=new Image;t.src=`./images/paddle_${e}.png`,this.paddleImages.push(t)}}moveLeft(){this.x>0&&(this.x-=this.speed)}moveRight(){this.x+this.width<this.canvasWidth&&(this.x+=this.speed)}update(){this.movingLeft&&this.moveLeft(),this.movingRight&&this.moveRight(),this.frameDelayCounter++,this.frameDelayCounter>=this.frameDelay&&(this.animationFrame=(this.animationFrame+1)%this.paddleImages.length,this.frameDelayCounter=0)}draw(e){const h=this.width/3.7890625,n=this.y-h+this.height;e.drawImage(this.paddleImages[this.animationFrame],this.x,n,this.width,h)}}function o(r){const e=new Audio(r);return e.load(),e}const c={brick:o("sounds/brick.mp3"),gameover:o("sounds/gameover.mp3"),go:o("sounds/go.mp3"),levelup:o("sounds/levelup.mp3"),loselife:o("sounds/loselife.mp3"),paddle:o("sounds/paddle.mp3")};function d(r){r.paused||(r.pause(),r.currentTime=0),r.play()}const g=o("sounds/music.wav");g.loop=!0;g.volume=.15;let m=!1;function y(){m||(g.play(),m=!0,g.addEventListener("timeupdate",function(){this.currentTime>this.duration-.3&&(this.currentTime=0,this.play())},!1))}class v{constructor(e,t,s,a){i(this,"paddle");i(this,"getCurrentState");i(this,"restartGame");i(this,"startGame");this.paddle=e,this.getCurrentState=t,this.restartGame=s,this.startGame=a,document.addEventListener("keydown",h=>this.keyDownHandler(h)),document.addEventListener("keyup",h=>this.keyUpHandler(h))}keyDownHandler(e){const t=this.getCurrentState();if(t==="playing")switch(e.key){case"ArrowLeft":this.paddle.movingLeft=!0;break;case"ArrowRight":this.paddle.movingRight=!0;break}else t==="gameOver"?this.restartGame():t==="starting"&&(y(),this.startGame())}keyUpHandler(e){if(this.getCurrentState()==="playing")switch(e.key){case"ArrowLeft":this.paddle.movingLeft=!1;break;case"ArrowRight":this.paddle.movingRight=!1;break}}}class I{constructor(e){i(this,"name");i(this,"highScore");i(this,"score");i(this,"level");i(this,"lives");this.name=e,this.highScore=Number(localStorage.getItem("highScore"))||0,this.score=0,this.level=1,this.lives=2}increaseScore(e){this.score+=e,this.score>this.highScore&&(this.highScore=this.score,this.saveHighScore())}getHighScore(){return Number(localStorage.getItem("highScore"))||0}saveHighScore(){localStorage.setItem("highScore",this.score.toString())}reset(){this.score=0,this.level=1,this.lives=3}levelUp(){this.level++}}class w{constructor(e){i(this,"brickRowCount");i(this,"brickColumnCount");i(this,"brickWidth");i(this,"brickHeight");i(this,"brickPadding");i(this,"brickOffsetTop");i(this,"brickOffsetLeft");i(this,"bricksArray");i(this,"bricksImages");i(this,"bricksImagesLoaded");const{canvasWidth:t,rowCount:s,columnCount:a,width:h,height:n,padding:l,offsetTop:p}=e;this.brickRowCount=s,this.brickColumnCount=a,this.brickWidth=h,this.brickHeight=n,this.brickPadding=l,this.brickOffsetTop=p,this.brickOffsetLeft=(t-(a*(h+l)-l))/2,this.bricksArray=[],this.bricksImages=[],this.bricksImagesLoaded=!1,this.preloadBrickImages(),this.resetBricks()}preloadBrickImages(){let t=0;for(let s=0;s<10;s++)this.bricksImages[s]={new:new Image,broken:new Image},this.bricksImages[s].new.onload=()=>{++t===10*2&&(this.bricksImagesLoaded=!0)},this.bricksImages[s].new.src=`./images/brick_0${s}_new.png`,this.bricksImages[s].broken.onload=()=>{++t===10*2&&(this.bricksImagesLoaded=!0)},this.bricksImages[s].broken.src=`./images/brick_0${s}_broken.png`}resetBricks(){for(let e=0;e<this.brickColumnCount;e++){this.bricksArray[e]=[];for(let t=0;t<this.brickRowCount;t++){const s=t%10;let a=e*(this.brickWidth+this.brickPadding)+this.brickOffsetLeft,h=t*(this.brickHeight+this.brickPadding)+this.brickOffsetTop;this.bricksArray[e][t]={x:a,y:h,health:2,colorIndex:s}}}}draw(e){for(let t=0;t<this.brickColumnCount;t++)for(let s=0;s<this.brickRowCount;s++){let a=this.bricksArray[t][s];if(a.health>0){let h=a.x,n=a.y,l=a.health===2?this.bricksImages[a.colorIndex].new:this.bricksImages[a.colorIndex].broken;e.drawImage(l,h,n,this.brickWidth,this.brickHeight)}}}}class x{constructor(e,t,s){i(this,"x");i(this,"y");i(this,"radius");i(this,"dx",0);i(this,"dy",0);i(this,"baseSpeed");i(this,"speedIncrease");i(this,"ballImage");this.x=e,this.y=t,this.radius=s,this.baseSpeed=5,this.speedIncrease=0,this.ballImage=new Image,this.preloadBallImage(),this.setInitialVelocity()}preloadBallImage(){this.ballImage.src="./images/ball.png"}setInitialVelocity(){const e=this.baseSpeed+this.speedIncrease;this.dx=(Math.random()*2-1)*e,this.dy=-e}draw(e){const t=this.radius*2;e.drawImage(this.ballImage,this.x-this.radius,this.y-this.radius,t,t)}reset(e,t){this.x=e,this.y=t,this.speedIncrease=0,this.setInitialVelocity()}increaseSpeed(e){this.speedIncrease+=e,this.setInitialVelocity()}update(e,t){if((this.x+this.dx>e-this.radius||this.x+this.dx<this.radius)&&(this.dx=-this.dx),this.y+this.dy<this.radius&&(this.dy=-this.dy),this.x>t.x&&this.x<t.x+t.width&&this.y+this.radius>t.y){this.dy=-this.dy;const s=this.x-(t.x+t.width/2);this.dx=s*.1,d(c.paddle)}this.x+=this.dx,this.y+=this.dy}}function S(r){const e=document.getElementById("levelDisplay");e&&(e.innerHTML="Level: "+r)}function u(r){const e=document.getElementById("livesDisplay");if(e){e.innerHTML="";for(let t=0;t<r;t++){let s=document.createElement("div");s.classList.add("heart"),e.appendChild(s)}}}function L(r){const e=document.getElementById("scoreDisplay");e&&(e.innerHTML="Score: "+r)}function C(r){const e=document.getElementById("highScoreDisplay");e&&(e.innerHTML="High Score: "+r)}class B{constructor(e){i(this,"canvas");i(this,"ctx");i(this,"player");i(this,"paddle");i(this,"bricks");i(this,"ball");i(this,"backgroundImages");i(this,"currentBackgroundIndex");i(this,"backgroundImage");i(this,"inputHandler");i(this,"currentState");i(this,"animationFrameId");const t=document.getElementById(e);if(!(t instanceof HTMLCanvasElement))throw new Error("Canvas element not found");this.canvas=t,this.canvas.width=800,this.canvas.height=600,this.ctx=this.canvas.getContext("2d"),this.player=new I("Player1"),this.paddle=new k(this.canvas.width,this.canvas.height),this.bricks=new w({canvasWidth:this.canvas.width,rowCount:3,columnCount:8,width:75,height:20,padding:10,offsetTop:30}),this.ball=new x(this.canvas.width/2,this.canvas.height-40,10),this.backgroundImages=["./images/background_6.png","./images/background_7.png","./images/background_8.jpeg","./images/background_9.jpeg","./images/background_10.jpeg","./images/background_11.jpeg","./images/background_12.jpeg","./images/background_13.jpeg","./images/background_14.jpeg"],this.currentBackgroundIndex=0,this.backgroundImage=new Image,this.backgroundImage.src=this.backgroundImages[this.currentBackgroundIndex],this.currentState="starting",this.inputHandler=new v(this.paddle,()=>this.currentState,()=>this.restartGame(),()=>this.startGame())}startGame(){this.currentState="playing",d(c.go),this.gameLoop()}checkBallBrickCollision(){this.bricks.bricksArray.forEach((e,t)=>{e.forEach((s,a)=>{s.health>0&&this.ball.x>s.x&&this.ball.x<s.x+this.bricks.brickWidth&&this.ball.y>s.y&&this.ball.y<s.y+this.bricks.brickHeight&&(this.ball.dy*=-1,s.health-=1,this.player.increaseScore(1),this.checkLevelProgression(),d(c.brick))})})}checkBallBottomCollision(){this.ball.y+this.ball.dy>this.canvas.height-this.ball.radius&&this.loseLife()}checkLevelProgression(){this.bricks.bricksArray.every(t=>t.every(s=>s.health<=0))&&(this.player.levelUp(),this.bricks.resetBricks(),this.resetBallAndPaddle(),d(c.levelup),this.currentBackgroundIndex=(this.currentBackgroundIndex+1)%this.backgroundImages.length,this.backgroundImage.src=this.backgroundImages[this.currentBackgroundIndex])}loseLife(){this.player.lives-=1,u(this.player.lives),this.player.lives<=0?(this.currentState="gameOver",d(c.gameover)):(this.resetBallAndPaddle(),d(c.loselife))}resetBallAndPaddle(){this.ball.reset(this.canvas.width/2,this.canvas.height-30),this.paddle.x=(this.canvas.width-this.paddle.width)/2}updateGame(){this.paddle.update(),this.ball.update(this.canvas.width,this.paddle),this.checkBallBrickCollision(),this.checkBallBottomCollision()}drawGame(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.ctx.drawImage(this.backgroundImage,0,0,this.canvas.width,this.canvas.height),u(this.player.lives),this.bricks.draw(this.ctx),this.ball.draw(this.ctx),this.paddle.draw(this.ctx),S(this.player.level),L(this.player.score),C(this.player.highScore)}drawStartScreen(){const e=new Image;e.onload=()=>{this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.ctx.drawImage(e,0,0,this.canvas.width,this.canvas.height)},e.src="./images/splash_screen_2.png"}drawGameOver(){this.animationFrameId!==void 0&&cancelAnimationFrame(this.animationFrameId);const e=new Image;e.onload=()=>{this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.ctx.drawImage(e,0,0,this.canvas.width,this.canvas.height)},e.src="./images/game_over_screen_3.png"}gameLoop(){switch(this.currentState){case"starting":this.drawStartScreen();break;case"playing":this.updateGame(),this.drawGame(),this.animationFrameId=requestAnimationFrame(()=>this.gameLoop());break;case"gameOver":this.drawGameOver();break}}restartGame(){typeof this.animationFrameId<"u"&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=void 0),this.player.reset(),this.bricks.resetBricks(),this.resetBallAndPaddle(),this.currentState="playing",this.gameLoop()}}const H=new B("gameCanvas");document.addEventListener("DOMContentLoaded",()=>{H.gameLoop()});
