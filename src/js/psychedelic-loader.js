let canvas = document.createElement("canvas")
    let c = canvas.getContext("2d")
let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight
c.fillStyle = "rgb(0,0,0)"
c.fillRect(0, 0, w, h)
let particles = {}
    let particleIndex = 0
    let particleNum = 1
function particle() {
    this.x = Math.random() * w
    this.y = Math.random() * h
    this.vx = 0
    this.vy = 0
    this.gravity = 1
    particleIndex++
    particles[particleIndex] = this
    this.id = particleIndex
    this.life = 0
    this.maxLife = Math.random() * 100
    this.shadeR = Math.floor(this.x / (w / 180))
    this.shadeG = Math.floor(Math.random() * 255)
    this.shadeB = Math.floor(Math.random() * 90)
    this.color = 'hsla(' + this.shadeR + ',100%,' + this.shadeB + '%,' + Math.random() * 0.7 + ')'
    this.size = 0.1
    this.a1 = 100
    this.a2 = Math.random() * 4 + 1
    this.a3 = 0
    this.a4 = 1
}
particle.prototype.draw = function() {
    this.y += 0
    c.beginPath()
    c.lineWidth = this.size
    c.lineTo(this.x, this.y)
    for(var k = 0; k < 10; k++){
        this.x += this.a1 * Math.sin(this.a2 * this.vx) + this.a3 * this.vx * Math.sin(this.a4 * this.vx)
        this.y += this.a1 * Math.cos(this.a2 * this.vx) + this.a3 * this.vx * Math.cos(this.a4 * this.vx)
        this.vy += this.gravity / 1
        this.vx += this.gravity / 1
        c.lineTo(this.x, this.y)
    }
    c.lineTo(this.x, this.y)
    c.strokeStyle = this.color
    c.stroke()
    this.life++
    if (this.life >= this.maxLife) {
        delete particles[this.id]
    }
}
let mouse = {x: 0, y: 0}
let last_mouse = {x: 0, y: 0}
canvas.addEventListener('mousemove', function(e) {
    last_mouse.x = mouse.x
    last_mouse.y = mouse.y
    mouse.x = e.pageX - this.offsetLeft
    mouse.y = e.pageY - this.offsetTop
}, false)
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60)
        }
})()
var psychedelicLoader = {
    appended: false,
    showing: false,
    drawParticle() {
        c.fillStyle = "rgba(0,0,0,0)"
        c.fillRect(0, 0, w, h)
        for (var i = 0; i < particleNum; i++) {
            new particle()
        }
        // eslint-disable-next-line no-redeclare
        for (var i in particles) {
            particles[i].draw()
        }
    },
    showLoader() {
        if(!psychedelicLoader.showing){ return }
        if(!psychedelicLoader.appended){
            document.body.appendChild(canvas)
            // eslint-disable-next-line no-undef
            appended = true
        }
        window.requestAnimFrame(psychedelicLoader.showLoader)
        psychedelicLoader.drawParticle()
    },
    start () {
        psychedelicLoader.showing = true
        psychedelicLoader.showLoader()
    },
    stop () {
        if(!psychedelicLoader.showing){ return } // Avoid removeChild already removed errors
        psychedelicLoader.showing = false
        psychedelicLoader.appended = false
        document.body.removeChild(canvas)
    },
};
(function() {
    // your page initialization code here the DOM will be available here
    psychedelicLoader.start()
})()
