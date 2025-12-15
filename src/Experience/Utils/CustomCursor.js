export default class CustomCursor {
    constructor() {
        // Vérifier si on est sur mobile
        if (window.innerWidth <= 768) return;

        this.halo = document.querySelector('.cursor-halo');
        this.canvas = document.getElementById('cursor-trail-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Setup canvas
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.mousePos = { x: 0, y: 0 };
        this.cursorPos = { x: 0, y: 0 };
        this.lastPos = { x: 0, y: 0 };
         
        // ⚙️ PARAMÈTRES À TWEAKER
        this.speed = 0.7; // Vitesse du halo (0.1 = lent, 0.3 = rapide)
        this.maxTrails = 20; // Longueur du trail (10 = court, 40 = long)
        this.trailFadeSpeed = 0.05; // Vitesse de disparition (0.03 = lent, 0.1 = rapide)
        this.velocityMultiplier = 0.5; // Épaisseur basée sur vitesse (0.3 = fin, 1.0 = épais)
        this.maxThickness = 10; // Épaisseur max du trail (10 = fin, 25 = épais)
        this.glowIntensity = 30; // Intensité du glow (5 = faible, 30 = fort)
        this.interpolationSteps = 8; // Fluidité (3 = moins fluide, 10 = très fluide)
        
        // Trail settings
        this.trails = [];
        
        // 🎨 Couleurs selon la section - SÉPARÉES pour halo et trail
        this.currentSection = 'left';
        
        // Couleur du HALO (cercle)
        this.haloColors = {
            left: {
                r: 255,
                g: 255,
                b: 255,
                name: 'Halo Profile' // Blanc pour le halo gauche
            },
            right: {
                r: 255,
                g: 255,
                b: 255,
                name: 'Halo Portfolio' // Blanc pour le halo droit
            }
        };
        
        // Couleur du TRAIL (traînée)
        this.trailColors = {
            left: {
                r: 233,
                g: 189,
                b: 255,
                name: 'Trail Profile' // Violet pour le trail gauche
            },
            right: {
                r: 255,
                g: 224,
                b: 110,
                name: 'Trail Portfolio' // Doré pour le trail droit
            }
        };
        
        // Couleur actuelle du halo (avec transition smooth)
        this.currentHaloColor = { ...this.haloColors.left };
        this.targetHaloColor = { ...this.haloColors.left };
        
        // Couleur actuelle du trail (avec transition smooth)
        this.currentTrailColor = { ...this.trailColors.left };
        this.targetTrailColor = { ...this.trailColors.left };
        
        this.colorTransitionSpeed = 0.1;

        this.init();
    }

    init() {
        // Suivre la position de la souris
        document.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
            
            // Détecter la section (gauche ou droite)
            const halfWidth = window.innerWidth / 2;
            const newSection = e.clientX < halfWidth ? 'left' : 'right';
            
            if (newSection !== this.currentSection) {
                this.currentSection = newSection;
                this.targetHaloColor = { ...this.haloColors[newSection] };
                this.targetTrailColor = { ...this.trailColors[newSection] };
            }
        });

        // Resize canvas
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });

        // Masquer quand la souris quitte la fenêtre
        document.addEventListener('mouseleave', () => {
            this.halo.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            this.halo.style.opacity = '1';
        });

        // Animation loop
        this.animate();
    }

    // Interpolation smooth des couleurs (halo ET trail)
    updateColors() {
        // Update halo color
        this.currentHaloColor.r += (this.targetHaloColor.r - this.currentHaloColor.r) * this.colorTransitionSpeed;
        this.currentHaloColor.g += (this.targetHaloColor.g - this.currentHaloColor.g) * this.colorTransitionSpeed;
        this.currentHaloColor.b += (this.targetHaloColor.b - this.currentHaloColor.b) * this.colorTransitionSpeed;
        
        // Update trail color
        this.currentTrailColor.r += (this.targetTrailColor.r - this.currentTrailColor.r) * this.colorTransitionSpeed;
        this.currentTrailColor.g += (this.targetTrailColor.g - this.currentTrailColor.g) * this.colorTransitionSpeed;
        this.currentTrailColor.b += (this.targetTrailColor.b - this.currentTrailColor.b) * this.colorTransitionSpeed;
    }

    drawTrail() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const dx = this.cursorPos.x - this.lastPos.x;
        const dy = this.cursorPos.y - this.lastPos.y;
        const velocity = Math.sqrt(dx * dx + dy * dy);

        if (velocity > 0.5) {
            this.trails.push({
                x: this.cursorPos.x,
                y: this.cursorPos.y,
                velocity: velocity,
                life: 1.0,
                // Stocker la couleur du TRAIL au moment de la création
                color: { ...this.currentTrailColor }
            });
        }

        if (this.trails.length > this.maxTrails) {
            this.trails.shift();
        }

        // Dessiner chaque segment avec interpolation
        for (let i = 1; i < this.trails.length; i++) {
            const trail = this.trails[i];
            const prevTrail = this.trails[i - 1];
            
            for (let step = 0; step < this.interpolationSteps; step++) {
                const t = step / this.interpolationSteps;
                
                // Interpolation linéaire
                const x1 = prevTrail.x + (trail.x - prevTrail.x) * t;
                const y1 = prevTrail.y + (trail.y - prevTrail.y) * t;
                const x2 = prevTrail.x + (trail.x - prevTrail.x) * (t + 1/this.interpolationSteps);
                const y2 = prevTrail.y + (trail.y - prevTrail.y) * (t + 1/this.interpolationSteps);
                
                // Opacité qui diminue vers l'arrière du trail
                const positionFactor = i / this.trails.length;
                const opacity = trail.life * positionFactor;
                
                // Épaisseur basée sur la vitesse
                const thickness = Math.min(trail.velocity * this.velocityMultiplier, this.maxThickness) * opacity;
                
                // Utiliser la couleur du TRAIL stockée
                const r = Math.round(trail.color.r);
                const g = Math.round(trail.color.g);
                const b = Math.round(trail.color.b);
                
                // Dessiner le mini-segment
                this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.8})`;
                this.ctx.lineWidth = thickness;
                this.ctx.lineCap = 'round';
                
                this.ctx.shadowBlur = this.glowIntensity * opacity;
                this.ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.stroke();
            }
            
            trail.life -= this.trailFadeSpeed;
            
            if (trail.life <= 0) {
                this.trails.splice(i, 1);
                i--;
            }
        }
        
        this.ctx.shadowBlur = 0;
    }

    animate() {
        // Interpolation smooth du halo
        this.cursorPos.x += (this.mousePos.x - this.cursorPos.x) * this.speed;
        this.cursorPos.y += (this.mousePos.y - this.cursorPos.y) * this.speed;

        // Update des couleurs (halo ET trail)
        this.updateColors();

        // Appliquer la position du halo
        this.halo.style.left = `${this.cursorPos.x}px`;
        this.halo.style.top = `${this.cursorPos.y}px`;
        
        // Mettre à jour la couleur du HALO (cercle)
        const hr = Math.round(this.currentHaloColor.r);
        const hg = Math.round(this.currentHaloColor.g);
        const hb = Math.round(this.currentHaloColor.b);
        
        this.halo.style.background = `radial-gradient(
            circle,
            rgba(${hr}, ${hg}, ${hb}, 1) 0%,
            rgba(${hr}, ${hg}, ${hb}, 0.8) 60%,
            rgba(${hr}, ${hg}, ${hb}, 0.5) 100%
        )`;
        
        this.halo.style.boxShadow = `
            0 0 10px rgba(${hr}, ${hg}, ${hb}, 1),
            0 0 20px rgba(${hr}, ${hg}, ${hb}, 0.8),
            0 0 30px rgba(${hr}, ${hg}, ${hb}, 0.5)
        `;

        // Dessiner le trail (avec sa propre couleur)
        this.drawTrail();

        // Mémoriser la position pour le prochain frame
        this.lastPos.x = this.cursorPos.x;
        this.lastPos.y = this.cursorPos.y;

        requestAnimationFrame(() => this.animate());
    }
}
       