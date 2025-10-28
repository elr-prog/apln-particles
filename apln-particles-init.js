/**
 * APLN Particle Animation - Zoomed Network Version
 * Particles extend beyond visible bounds for "zoomed into larger network" effect
 * Settings: Density 12000 | Responsiveness 2.5 | Distance 200
 * Shape: Wide rhombus matching APLN logo (20×8 with slant)
 */

(function() {
    function initAPLNParticles() {
        const container = document.getElementById('particles');
        if (!container) {
            console.warn('APLN Particles: Container #particles not found');
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.style.display = 'block';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouseX = 0, mouseY = 0;
        let visibleWidth, visibleHeight;

        function resize() {
            const rect = container.getBoundingClientRect();
            visibleWidth = rect.width;
            visibleHeight = rect.height;
            
            // Canvas extends 50% beyond visible area on all sides (zoomed effect)
            canvas.width = visibleWidth * 2;
            canvas.height = visibleHeight * 2;
            canvas.style.left = `-${visibleWidth * 0.5}px`;
            canvas.style.top = `-${visibleHeight * 0.5}px`;
            
            // Recreate particles
            const numParticles = Math.round((canvas.width * canvas.height) / 12000);
            particles = [];
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.width = 20;   // Wider to match APLN logo
                this.height = 8;   // Shorter - wider than tall
                this.slant = 7;    // Slant angle
                this.speedX = (Math.random() - 0.5) * 0.7;
                this.speedY = (Math.random() - 0.5) * 0.7;
                this.layer = Math.ceil(Math.random() * 3);
                this.parallaxOffsetX = 0;
                this.parallaxOffsetY = 0;
            }

            draw() {
                const x = this.x + this.parallaxOffsetX;
                const y = this.y + this.parallaxOffsetY;
                
                // Skip if too far outside visible area (performance)
                const margin = 100;
                const visibleLeft = visibleWidth * 0.5 - margin;
                const visibleRight = visibleWidth * 1.5 + margin;
                const visibleTop = visibleHeight * 0.5 - margin;
                const visibleBottom = visibleHeight * 1.5 + margin;
                
                if (x < visibleLeft || x > visibleRight || y < visibleTop || y > visibleBottom) {
                    return;
                }
                
                // Draw wide parallelogram matching APLN logo
                ctx.fillStyle = '#d3cfc7';
                ctx.beginPath();
                ctx.moveTo(x - this.width/2 + this.slant, y - this.height);
                ctx.lineTo(x + this.width/2 + this.slant, y - this.height);
                ctx.lineTo(x + this.width/2 - this.slant, y + this.height);
                ctx.lineTo(x - this.width/2 - this.slant, y + this.height);
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
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const targetX = (mouseX - centerX) / (parallaxMultiplier * this.layer);
                const targetY = (mouseY - centerY) / (parallaxMultiplier * this.layer);
                this.parallaxOffsetX += (targetX - this.parallaxOffsetX) / 10;
                this.parallaxOffsetY += (targetY - this.parallaxOffsetY) / 10;

                // Movement
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Wrap around edges (particles flow in/out)
                const padding = this.width;
                if (this.x > canvas.width - padding) this.x = padding;
                if (this.x < padding) this.x = canvas.width - padding;
                if (this.y > canvas.height - padding) this.y = padding;
                if (this.y < padding) this.y = canvas.height - padding;
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let particle of particles) {
                particle.update();
                particle.draw();
            }
            
            requestAnimationFrame(animate);
        }

        // Mouse tracking
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        // Initialize
        resize();
        window.addEventListener('resize', resize);
        animate();

        console.log('APLN Particles: Zoomed network initialized ✓');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAPLNParticles);
    } else {
        initAPLNParticles();
    }
})();
