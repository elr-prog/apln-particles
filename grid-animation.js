/**
 * APLN Grid Background Animation
 * Creates a grid of nodes with random dappling and emphasis effects
 *
 * Usage:
 * 1. Include this script in your HTML
 * 2. Add a canvas element with id="gridCanvas"
 * 3. The animation will initialize automatically
 *
 * Configuration options can be customized through the config object
 */

(function() {
    'use strict';

    const canvas = document.getElementById('gridCanvas');
    if (!canvas) {
        console.warn('Grid animation: Canvas element with id="gridCanvas" not found');
        return;
    }

    const ctx = canvas.getContext('2d');

    let width, height;
    let nodes = [];

    // Configuration
    const config = {
        gridSpacing: 60,        // Distance between grid nodes
        nodeRadius: 3,          // Base node size
        maxEmphasisScale: 3.5,  // Maximum scale for emphasized nodes
        connectionDistance: 150, // Distance to draw connecting lines
        baseColor: '#b9aea1',   // APLN tan color
        emphasisColor: '#253b53', // APLN dark blue for emphasis
        lineOpacity: 0.15,      // Connection line opacity
        dappleSpeed: 0.02,      // Speed of dappling effect
        emphasisProbability: 0.003 // Probability per frame of starting emphasis
    };

    class GridNode {
        constructor(x, y, row, col) {
            this.x = x;
            this.y = y;
            this.row = row;
            this.col = col;
            this.baseX = x;
            this.baseY = y;

            // Animation properties
            this.scale = 1;
            this.targetScale = 1;
            this.opacity = 0.4 + Math.random() * 0.3;
            this.targetOpacity = this.opacity;
            this.glowIntensity = 0;
            this.targetGlow = 0;

            // Dappling effect
            this.dapplePhase = Math.random() * Math.PI * 2;
            this.dappleSpeed = 0.5 + Math.random() * 1.5;
            this.dappleAmount = 0.1 + Math.random() * 0.15;

            // Random emphasis timing
            this.emphasisTimer = 0;
            this.isEmphasized = false;
            this.emphasisDuration = 0;
            this.emphasisProgress = 0;

            // Random initial delay for staggered appearance
            this.appearDelay = Math.random() * 100;
            this.appeared = false;
        }

        update(frameCount) {
            // Handle appearance animation
            if (!this.appeared) {
                this.appearDelay--;
                if (this.appearDelay <= 0) {
                    this.appeared = true;
                }
                return;
            }

            // Continuous dappling effect
            this.dapplePhase += config.dappleSpeed * this.dappleSpeed;
            const dapple = Math.sin(this.dapplePhase) * this.dappleAmount;
            this.targetOpacity = 0.4 + Math.abs(dapple);

            // Random emphasis trigger
            if (!this.isEmphasized && Math.random() < config.emphasisProbability) {
                this.startEmphasis();
            }

            // Update emphasis animation
            if (this.isEmphasized) {
                this.emphasisProgress += 1;
                const progress = this.emphasisProgress / this.emphasisDuration;

                if (progress < 0.3) {
                    // Growing phase
                    const growProgress = progress / 0.3;
                    this.targetScale = 1 + (config.maxEmphasisScale - 1) * easeOutElastic(growProgress);
                    this.targetGlow = growProgress;
                    this.targetOpacity = 0.8 + 0.2 * growProgress;
                } else if (progress < 0.7) {
                    // Hold phase
                    this.targetScale = config.maxEmphasisScale;
                    this.targetGlow = 1;
                    this.targetOpacity = 1;
                } else {
                    // Fade phase
                    const fadeProgress = (progress - 0.7) / 0.3;
                    this.targetScale = config.maxEmphasisScale - (config.maxEmphasisScale - 1) * fadeProgress;
                    this.targetGlow = 1 - fadeProgress;
                    this.targetOpacity = 1 - 0.6 * fadeProgress;
                }

                if (progress >= 1) {
                    this.endEmphasis();
                }
            }

            // Smooth interpolation
            this.scale += (this.targetScale - this.scale) * 0.15;
            this.opacity += (this.targetOpacity - this.opacity) * 0.1;
            this.glowIntensity += (this.targetGlow - this.glowIntensity) * 0.2;
        }

        startEmphasis() {
            this.isEmphasized = true;
            this.emphasisDuration = 60 + Math.random() * 90; // 1-2.5 seconds at 60fps
            this.emphasisProgress = 0;
        }

        endEmphasis() {
            this.isEmphasized = false;
            this.targetScale = 1;
            this.targetGlow = 0;
        }

        draw() {
            if (!this.appeared) return;

            ctx.save();

            // Draw glow if emphasized
            if (this.glowIntensity > 0.01) {
                const glowRadius = config.nodeRadius * this.scale * 3;
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowRadius);
                gradient.addColorStop(0, `rgba(37, 59, 83, ${this.glowIntensity * 0.3})`);
                gradient.addColorStop(0.5, `rgba(37, 59, 83, ${this.glowIntensity * 0.1})`);
                gradient.addColorStop(1, 'rgba(37, 59, 83, 0)');

                ctx.fillStyle = gradient;
                ctx.fillRect(this.x - glowRadius, this.y - glowRadius, glowRadius * 2, glowRadius * 2);
            }

            // Draw node
            ctx.beginPath();
            ctx.arc(this.x, this.y, config.nodeRadius * this.scale, 0, Math.PI * 2);

            // Color blending between base and emphasis
            const color = this.isEmphasized && this.glowIntensity > 0.5
                ? config.emphasisColor
                : config.baseColor;

            ctx.fillStyle = color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();

            ctx.restore();
        }

        drawConnections(otherNodes) {
            if (!this.appeared) return;

            ctx.save();

            for (let other of otherNodes) {
                if (!other.appeared || other === this) continue;

                // Only draw connections to nearby nodes
                const dx = other.x - this.x;
                const dy = other.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.connectionDistance && distance > 0) {
                    const opacity = (1 - distance / config.connectionDistance) * config.lineOpacity;
                    const enhancedOpacity = opacity * (1 + this.glowIntensity * 2 + other.glowIntensity * 2);

                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.strokeStyle = `rgba(185, 174, 161, ${enhancedOpacity})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            ctx.restore();
        }
    }

    // Easing function for elastic effect
    function easeOutElastic(x) {
        const c4 = (2 * Math.PI) / 3;
        return x === 0
            ? 0
            : x === 1
            ? 1
            : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    }

    function createGrid() {
        nodes = [];

        const cols = Math.ceil(width / config.gridSpacing) + 2;
        const rows = Math.ceil(height / config.gridSpacing) + 2;

        // Center the grid
        const offsetX = (width - (cols - 1) * config.gridSpacing) / 2;
        const offsetY = (height - (rows - 1) * config.gridSpacing) / 2;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = offsetX + col * config.gridSpacing;
                const y = offsetY + row * config.gridSpacing;
                nodes.push(new GridNode(x, y, row, col));
            }
        }
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        createGrid();
    }

    let frameCount = 0;

    function animate() {
        ctx.clearRect(0, 0, width, height);

        frameCount++;

        // Update all nodes
        nodes.forEach(node => node.update(frameCount));

        // Draw connections first (behind nodes)
        nodes.forEach(node => node.drawConnections(nodes));

        // Draw nodes on top
        nodes.forEach(node => node.draw());

        requestAnimationFrame(animate);
    }

    function init() {
        resize();
        animate();

        window.addEventListener('resize', resize);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export config for external customization
    if (typeof window !== 'undefined') {
        window.gridAnimationConfig = config;
    }
})();
