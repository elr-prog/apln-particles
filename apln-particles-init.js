/**
 * APLN Particle Animation - Rhombus/Diamond Shapes
 * Your settings: Distance 200 | Responsiveness 2.5 | Size 16 
 * Particles 9000 | Line Width 2.5 | Opacity 0.3
 */

(function() {
    function initAPLNParticles() {
        const container = document.getElementById('particles');
        if (!container) return;

        const canvas = document.createElement('canvas');
        canvas.style.display = 'block';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouseX = 0, mouseY = 0;
        let winW, winH;

        function resize() {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
            winW = canvas.width;
            winH = canvas.height;
            
            // Recreate particles on resize
            const numParticles = Math.round((canvas.width * canvas.height) / 9000);
            particles = [];
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        }

        class Particle {
            constructor() {
                this.x = Math.random() * winW;
                this.y = Math.random() * winH;
                this.width = 14;  // Wider for slanted effect
                this.height = 8;  // Shorter for slanted effect
                this.speedX = (Math.random() - 0.5) * 0.7;
                this.speedY = (Math.random() - 0.5) * 0.7;
                this.layer = Math.ceil(Math.random() * 3);
                this.parallaxOffsetX = 0;
                this.parallaxOffsetY = 0;
            }

            draw() {
                const x = this.x + this.parallaxOffsetX;
                const y = this.y + this.parallaxOffsetY;
                
                // Draw slanted rhombus (parallelogram shape like APLN logo)
                ctx.fillStyle = '#d3cfc7';
                ctx.beginPath();
                ctx.moveTo(x - this.width * 0.3, y - this.height);      // Top left
                ctx.lineTo(x + this.width * 0.7, y - this.height);      // Top right (slanted)
                ctx.lineTo(x + this.width * 0.3, y + this.height);      // Bottom right
                ctx.lineTo(x - this.width * 0.7, y + this.height);      // Bottom left (slanted)
                ctx.closePath();
                ctx.fill();

                // Draw connections
                ctx.strokeStyle = 'rgba(185, 174, 161, 0.3)';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                
                for (let i = 0; i < particles.length; i++) {
                    const p2 = particles[i];
                    if (p2 === this) continue;
                    
                    const dx = this.x - p2.x;
                    const dy = this.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 200) {
                        ctx.moveTo(x, y);
                        ctx.lineTo(p2.x + p2.parallaxOffsetX, p2.y + p2.parallaxOffsetY);
                    }
                }
                ctx.stroke();
            }

            update() {
                // Parallax
                const parallaxMultiplier = 2.5;
                const targetX = (mouseX - winW / 2) / (parallaxMultiplier * this.layer);
                const targetY = (mouseY - winH / 2) / (parallaxMultiplier * this.layer);
                this.parallaxOffsetX += (targetX - this.parallaxOffsetX) / 10;
                this.parallaxOffsetY += (targetY - this.parallaxOffsetY) / 10;

                // Movement
                if (this.x + this.speedX > winW || this.x + this.speedX < 0) {
                    this.speedX = -this.speedX;
                }
                if (this.y + this.speedY > winH || this.y + this.speedY < 0) {
                    this.speedY = -this.speedY;
                }
                this.x += this.speedX;
                this.y += this.speedY;
            }
        }

        function animate() {
            ctx.clearRect(0, 0, winW, winH);
            
            for (let particle of particles) {
                particle.update();
                particle.draw();
            }
            
            requestAnimationFrame(animate);
        }

        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            mouseX = e.pageX;
            mouseY = e.pageY;
        });

        // Initialize
        resize();
        window.addEventListener('resize', resize);
        animate();

        console.log('APLN Particles: Rhombus shapes initialized ✓');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAPLNParticles);
    } else {
        initAPLNParticles();
    }
})();
