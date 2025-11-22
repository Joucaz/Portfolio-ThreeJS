import * as THREE from 'three'
import Experience from '../../Experience.js'
import { mod } from 'three/tsl'

export default class RLTrack
{
    constructor()
    {
        this.experience = new Experience()
        this.scenePortfolio = this.experience.scenePortfolio
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.troikaText = this.experience.world.troikaText

        this.loopFalse = true

        this.lastAnimationChange = -this.animationChangeCooldown; // en millisecondes
        this.animationChangeCooldown = 1500 // 3 secondes

        this.fennecCounter = 0
        this.octaneCounter = 0

        // 🎲 Génère une vitesse aléatoire
        this.minSpeed = 1
        this.maxSpeed = 3

        this.baseSpeed = 108
        this.fennecSpeed = this.baseSpeed
        this.octaneSpeed = this.baseSpeed

        this.activeHalo = null;
        this.lastSpeedFennec = this.baseSpeed;
        this.lastSpeedOctane = this.baseSpeed;

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('RLTrack')
        }

        
        this.resource = this.resources.items.rlTrack

        this.setModel()
        this.setAnimation()
    }

    setModel()
    {        
        this.model = this.resource.scene
        this.experience.world.groupPortfolio.add(this.model) 

        // Ajoute une référence vers "this" dans le modèle
        this.model.traverse(child => {

            child.userData.parentInstance = this;

            if(child instanceof THREE.Mesh)
            {
                if (child.material) {
                    child.material = this.experience.world.unlimitedTexture.bakedMaterialPortfolio
                }
            }
            
        });

        // Add object to raycast
        this.experience.objectsIntersectRight.addObject(this.model)
    
        // this.model.traverse((child) =>
        // {
        //     if(child instanceof THREE.Mesh)
        //     {
        //         child.castShadow = true
        //     }
        // })

        // this.experience.renderer.addSelectedObject(this.model)

    }

    setAnimation() {
        this.animation = {}

        this.emptyFennec = this.model.children[0].children.find(child => child.name === "EmptyFennec008")
        this.emptyOctane = this.model.children[0].children.find(child => child.name === "EmptyOctane008")
        // this.emptyFennec = this.experience.world.rlFennec.emptyFennec
        // this.emptyOctane = this.experience.world.rlOctane.emptyOctane
        

        // Mixers
        this.animation.mixerFennec = new THREE.AnimationMixer(this.emptyFennec)
        this.animation.mixerOctane = new THREE.AnimationMixer(this.emptyOctane)
        // Actions
        this.animation.actions = {}        
        this.animation.actions.fennecAction = this.animation.mixerFennec.clipAction(this.resource.animations[0])
        this.animation.actions.octaneAction = this.animation.mixerOctane.clipAction(this.resource.animations[1])
        // this.animation.actions.fennecAction = this.animation.mixerFennec.clipAction(this.experience.world.rlFennec.resource.animations[0])
        // this.animation.actions.octaneAction = this.animation.mixerOctane.clipAction(this.experience.world.rlOctane.resource.animations[0])
        

        // Boucles infinies
        this.animation.actions.fennecAction.setLoop(THREE.LoopRepeat, Infinity)
        this.animation.actions.octaneAction.setLoop(THREE.LoopRepeat, Infinity)

        this.animation.actions.fennecAction.clampWhenFinished = true
        this.animation.actions.octaneAction.clampWhenFinished = true

        this.animation.actions.fennecAction.timeScale = this.minSpeed
        this.animation.actions.octaneAction.timeScale = this.minSpeed

        // Jouer les animations
        this.animation.actions.fennecAction.play()
        this.animation.actions.octaneAction.play()

        // Événements "loop" pour incrémenter les compteurs
        this.animation.mixerFennec.addEventListener('loop', (e) => {
            if (e.action === this.animation.actions.fennecAction) {
                this.fennecCounter++
                this.troikaText.updateText('lapFennec', `${this.fennecCounter}`)
                console.log(`Fennec loop finished: ${this.fennecCounter}`)
            }
        })

        this.animation.mixerOctane.addEventListener('loop', (e) => {
            if (e.action === this.animation.actions.octaneAction) {
                this.octaneCounter++
                this.troikaText.updateText('lapOctane', `${this.octaneCounter}`)
                console.log(`Octane loop finished: ${this.octaneCounter}`)
            }
        })
    }


    // createSpeedIndicator(car, speed, isRightScene = true) {
    //     const speedLabel = `${speed}`

    //     // Crée un div pour le texte
    //     const div = document.createElement('div')
    //     div.className = 'speed-indicator'
    //     div.innerText = speedLabel
    //     document.body.appendChild(div)

    //     // Crée un pivot au-dessus de la voiture si pas déjà créé
    //     if (!car.userData.textPivot) {
    //         const pivot = new THREE.Object3D()
    //         pivot.position.set(0, 1.2, 0) // hauteur constante au-dessus de la voiture
    //         pivot.rotation.set(0, 0, 0)   // ignore la rotation locale
    //         car.add(pivot)
    //         car.userData.textPivot = pivot
    //     }

    //     const pivot = car.userData.textPivot
    //     const startTime = performance.now()
    //     const duration = 2000 // 2 secondes

    //     const update = () => {
    //         const elapsed = performance.now() - startTime
    //         const progress = elapsed / duration

    //         // Maintient la hauteur constante pour le pivot
    //         // pivot.position.y = 1.2

    //         // Récupère la position 3D du pivot
    //         const vector = new THREE.Vector3()
    //         pivot.getWorldPosition(vector)
    //         vector.project(this.experience.camera.instance) // projette dans la caméra

    //         // Transforme en coordonnées écran
    //         let x = (vector.x * 0.5 + 0.5) * (isRightScene ? this.experience.sizes.width / 2 : this.experience.sizes.width / 2)
    //         if (isRightScene) x += this.experience.sizes.width / 2 // décale pour scène de droite
    //         const y = (-vector.y * 0.5 + 0.5) * this.experience.sizes.height

    //         // Applique la position + effet flottant
    //         div.style.transform = `translate(-50%, -50%) translate(${x}px, ${y - progress * 30}px)`
    //         div.style.opacity = `${1 - progress}`

    //         if (progress < 1) requestAnimationFrame(update)
    //         else div.remove()
    //     }

    //     update()
    // }


    // createSpeedIndicator(car, speed, offset = { x: 2, y: 2, z: 2 }) {
    //     const text = `${speed}`

    //     const size = 1024
    //     const canvas = document.createElement('canvas')
    //     const ctx = canvas.getContext('2d')
    //     canvas.width = canvas.height = size

    //     ctx.clearRect(0, 0, size, size)
    //     ctx.font = 'bold 150px Arial'
    //     ctx.fillStyle = 'white'
    //     ctx.textAlign = 'center'
    //     ctx.textBaseline = 'middle'
    //     ctx.shadowColor = 'rgba(0,0,0,0.5)'
    //     ctx.shadowBlur = 20
    //     ctx.fillText(text, size / 2, size / 2)

    //     const texture = new THREE.CanvasTexture(canvas)
    //     texture.minFilter = THREE.LinearFilter
    //     texture.magFilter = THREE.LinearFilter
    //     texture.needsUpdate = true

    //     const material = new THREE.SpriteMaterial({
    //         map: texture,
    //         transparent: true,
    //         opacity: 1
    //     })

    //     const sprite = new THREE.Sprite(material)
    //     sprite.scale.set(8, 8, 8)

    //     // ⚡ Position locale selon offset
    //     sprite.position.set(offset.x, offset.y, offset.z)
    //     car.add(sprite)

    //     const startTime = performance.now()
    //     const duration = 2000

    //     const fade = () => {
    //         const elapsed = performance.now() - startTime
    //         const progress = elapsed / duration

    //         sprite.material.opacity = 1 - progress

    //         // Flotte légèrement vers le haut
    //         sprite.position.y = offset.y + progress * 0.3

    //         if (progress < 1) {
    //             requestAnimationFrame(fade)
    //         } else {
    //             car.remove(sprite)
    //             sprite.material.map.dispose()
    //             sprite.material.dispose()
    //         }
    //     }

    //     fade()
    // }

   

    playAnimation()
    {
        if (this.time.elapsed - this.lastAnimationChange < this.animationChangeCooldown)
            return

        this.lastAnimationChange = this.time.elapsed

        const fAction = this.animation.actions.fennecAction
        const oAction = this.animation.actions.octaneAction

        const actions = [fAction, oAction]
        const randomAction = actions[Math.floor(Math.random() * actions.length)]

        const newSpeed = Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed

        console.log(newSpeed);
        

        // ⏩ Applique la vitesse à l'animation
        randomAction.timeScale = newSpeed
        this.currentSpeed = newSpeed

        // 🔹 Conversion en km/h pour cette voiture
        const newSpeedKmH = newSpeed * this.baseSpeed

        if (randomAction === fAction) {

            const oldSpeed = this.lastSpeedFennec;
            const isUp = newSpeedKmH > oldSpeed;

            this.lastSpeedFennec = newSpeedKmH;

            this.fennecSpeed = newSpeedKmH.toFixed(0)

            this.createHalo(this.emptyFennec.children[0], isUp);

            this.troikaText.updateText('speedFennec', `${this.fennecSpeed}`)
            console.log(`Fennec speed updated: ${this.fennecSpeed} km/h`)

        } else {
            const oldSpeed = this.lastSpeedOctane;
            const isUp = newSpeedKmH > oldSpeed;

            this.lastSpeedOctane = newSpeedKmH;
            
            this.octaneSpeed = newSpeedKmH.toFixed(0)
            
            this.createHalo(this.emptyOctane.children[0], isUp);

            this.troikaText.updateText('speedOctane', `${this.octaneSpeed}`)
            console.log(`Octane speed updated: ${this.octaneSpeed} km/h`)
        }

        // console.log(`Action : ${randomAction._clip.name}, Vitesse : x${newSpeed.toFixed(2)}`)    

        // const targetModel = randomAction === fAction ? this.emptyFennec : this.emptyOctane
        // this.createSpeedIndicator(targetModel, speedLabel)
    }

     createHalo(carMesh, isSpeedUp) {
        // Si un halo existe déjà → on le supprime
        if (this.activeHalo) {
            this.activeHalo.parent.remove(this.activeHalo);
            this.activeHalo.material.dispose();
            this.activeHalo.geometry.dispose();
            this.activeHalo = null;
        }

        // Choix couleur selon montée / descente de vitesse
        const color = isSpeedUp ? 0x2EF527 : 0xFF0A0A; // vert / rouge

        const ringGeom = new THREE.RingGeometry(0.8, 0.95, 32);
        const ringMat = new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 1
        });

        const halo = new THREE.Mesh(ringGeom, ringMat);
        halo.rotation.x = -Math.PI / 2;
        carMesh.add(halo);

        halo.userData = {
            elapsed: 0,
            duration: this.animationChangeCooldown, // halo reste jusqu'au cooldown
            pulseSpeed: 0.01
        };

        this.activeHalo = halo;
    }

    update()
    {
        this.animation.mixerFennec.update(this.time.delta * 0.001)      
        this.animation.mixerOctane.update(this.time.delta * 0.001)

        if (this.activeHalo) {
            const h = this.activeHalo;
            h.userData.elapsed += this.time.delta;
            
            // Pulse du scale
            const t = h.userData.elapsed * h.userData.pulseSpeed;
            const scale = 1 + 0.08 * Math.sin(t);
            h.scale.set(scale, scale, scale);

            const minOpacity = 0.3;
            const maxOpacity = 1;
            h.material.opacity = minOpacity + (maxOpacity - minOpacity) * (0.5 + 0.5 * Math.sin(t));


            // Fade progressif
            // h.material.opacity = 0.8 * (1 - h.userData.elapsed / h.userData.duration);

            if (h.userData.elapsed >= h.userData.duration) {
                console.log("destroy");
                
                h.parent.remove(h);
                h.material.dispose();
                h.geometry.dispose();
                this.activeHalo = null;
            }
        }
    }
}