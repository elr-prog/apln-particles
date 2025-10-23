/**
 * APLN Particle Animation - Initialization
 * Your finalized settings: Distance 200 | Responsiveness 2.5 | Size 16 | 
 * Particles 9000 | Line Width 2.5 | Opacity 0.3
 */

(function() {
    // Wait for DOM to be ready
    function initAPLNParticles() {
        // Check if particles container exists
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) {
            console.warn('APLN Particles: Container #particles not found');
            return;
        }

        // Check if particleground is loaded
        if (typeof window.particleground !== 'function') {
            console.error('APLN Particles: particleground library not loaded');
            return;
        }

        // Your exact finalized settings
        const settings = {
            // Movement
            minSpeedX: 0.1,
            maxSpeedX: 0.7,
            minSpeedY: 0.1,
            maxSpeedY: 0.7,
            directionX: 'center',
            directionY: 'center',
            
            // Particles
            density: 9000,
            particleRadius: 16,
            dotColor: '#d3cfc7',
            
            // Connections - The key to your connected web!
            proximity: 200,
            lineWidth: 2.5,
            lineColor: 'rgba(185, 174, 161, 0.3)',
            curvedLines: false,
            
            // Mouse interaction - Responsive!
            parallax: true,
            parallaxMultiplier: 2.5,
            
            // Callbacks
            onInit: function() {
                console.log('APLN Particles: Initialized successfully ✓');
            }
        };

        // Initialize
        window.aplnParticles = window.particleground(particlesContainer, settings);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAPLNParticles);
    } else {
        initAPLNParticles();
    }
})();
