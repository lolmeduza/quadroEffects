let myImage = new Image();
myImage.src = "./girl.jpg";

myImage.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const body = document.getElementById("body");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

//   const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

  class Particle {
    constructor(effect,x,y,color) {
        this.effect = effect
        this.x = 0
        this.y = 0
        this.originX = Math.floor(x)
        this.originY = Math.floor(y)       
        this.color = color
        this.size = this.effect.gap 
        // this.vx = Math.random()*10+1
        // this.vy = Math.random()*10-3
        //направление блоков
        this.vx = 0
        this.vy = 0
        this.ease = 0.2
        this.friction = 0.8
        this.dx = 0
        this.dy = 0
        this.force = 0
        this.angle = 0
        this.active = true
        this.timeout = undefined
  }
  draw(context){
    context.fillStyle = this.color
    context.fillRect(this.x, this.y, this.size, this.size)
  }
  update(){
    if(this.active){
      this.dx = this.effect.mouse.x - this.x
      this.dy = this.effect.mouse.y - this.y
      this.distance = this.dx*this.dx + this.dy*this.dy
      this.force = -this.effect.mouse.radius / this.distance
  
      if(this.distance < this.effect.mouse.radius){
      this.angle = Math.atan2(this.dy, this.dx)
      this.vx += this.force* Math.cos(this.angle)
      this.force += this.force* Math.sin(this.angle)
      }
  
  this.x +=(this.vx *= this.friction) +(this.originX - this.x)* this.ease
  this.y += (this.vy*= this.friction) +(this.originY - this.y)* this.ease
    }
   
  }

  warp(){
    this.x = Math.random()*this.effect.width
        this.y =Math.random()*this.effect.height
        this.ease = 0.06
        this.size = 9
  }
  blocks(){
    this.x = Math.random()*this.effect.width
        this.y = Math.random()>0.5?0: this.effect.height
        this.ease = 0.05
        this.size = 20
  }
  assembled(){
    clearTimeout(this.timeout)
    this.x = Math.random()*this.effect.width
        this.y = Math.random()*this.effect.height
        this.ease = 0.05
        this.size = this.effect.gap
        this.active = false
        this.effect.counter+=1
      this.timeout = setTimeout(() => {
          this.active = true
}, this.effect.counter*0.5)
  }
  particlePrint(){
    clearTimeout(this.timeout)
    this.x= this.effect.width*0.5
    this.y= Math.random()*this.effect.height*0.5
    this.ease = 0.15
    this.size = this.effect.gap
    this.active = false
    this.effect.counter++
    this.timeout = setTimeout(() => {
      this.active = true

    }, this.effect.counter * 0.5)
  }
}

let frame = 0
class Effect {
    constructor(width, height){
        this.width = width
        this.height = height
        this.particlesArray = []
    this.image = myImage
    //размер блоков
    this.gap = 8
    this.mouse = {
      radius: 8000,
      x: undefined,
      y: undefined
    }
// window.addEventListener("", event => {
// this.mouse.x = event.x
// this.mouse.y = event.y

// // console.log(this.mouse.x, this.mouse.y);
// })
body.addEventListener("mousemove", (e) => {
  this.mouse.x = e.x;
  this.mouse.y = e.y;
});
body.addEventListener("mouseleave", (e) => {
  this.mouse.x = undefined;
  this.mouse.y = undefined;
console.log(frame);

  // cancelAnimationFrame(frame)
});
this.counter = 0
    }
    init(context){
        // for(let i = 0; i < 100; i++){
        //     this.particlesArray.push(new Particle(this))
        // }
        context.drawImage(myImage, 0, 0, canvas.width, canvas.height);
        const pixels = context.getImageData(0, 0, this.width, this.height).data;
        for(let y = 0; y < this.height; y+= this.gap){
            for(let x = 0; x < this.width; x+= this.gap){
          const index = (y  * this.width + x) * 4;
          const red = pixels[index]; 
          const green= pixels[index + 1];
          const blue = pixels[index + 2];
          const alpha = pixels[index + 3]
          const color = `rgba(${red}, ${green}, ${blue}, ${alpha})`

          if(alpha>0){
            this.particlesArray.push(new Particle(this, x, y, color))
          }
        }}
    }
    draw(context){
        this.particlesArray.forEach(particle => particle.draw(context))
    }
    update(){
        this.particlesArray.forEach(particle => particle.update())
    }
    warp(){
      this.particlesArray.forEach(particle => particle.warp())
    }
    blocks(){
      this.particlesArray.forEach(particle => particle.blocks())
    }
    assembled(){
      this.counter=0;
      this.particlesArray.forEach(particle => particle.assembled())
    }
    particlePrint(){
        this.counter = 0
        this.particlesArray.forEach(particle => particle.particlePrint())
    }
}

const effect = new Effect(canvas.width, canvas.height)
effect.init(ctx)

let isAnimating = true; // флаг для отслеживания состояния анимации

function animate() {
    if (!isAnimating) {
        cancelAnimationFrame(frame);
        return; // выход из функции, если анимация остановлена
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.draw(ctx);
    effect.update();
    console.log(frame);
    frame = requestAnimationFrame(animate);
}

// Остановить анимацию при определённом условии
body.addEventListener("mouseleave", (e) => {
    isAnimating = false; // останавливаем анимацию, когда мышь покидает canvas
    console.log('Animation stopped');
});
body.addEventListener("mouseenter", (e) => {
  if (!isAnimating) {
      isAnimating = true;
      animate(); // запустить анимацию снова
  }
});

// Запуск анимации
animate();
//warp 
const warpButton = document.getElementById("warpButton")
warpButton.addEventListener("click", () => {
effect.warp()

this.removeEventListener("click", warpButton)
})
//block 
const blockButton = document.getElementById("blockButton")
blockButton.addEventListener("click", () => {
  effect.blocks()
  this.removeEventListener("click", blockButton)
})
const assembledButton = document.getElementById("assembledButton")
assembledButton.addEventListener("click", () => {
  effect.assembled()
  this.removeEventListener("click", assembledButton)
})

//
const printButton = document.getElementById("printButton")
printButton.addEventListener("click", () => {
  effect.particlePrint()
  this.removeEventListener("click", printButton)
})
})