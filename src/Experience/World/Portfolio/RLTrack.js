import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class RLTrack
{
    constructor()
    {
        this.experience = new Experience()
        this.scenePortfolio = this.experience.scenePortfolio
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.lastAnimationChange = 0 // en millisecondes
        this.animationChangeCooldown = 3000 // 3 secondes

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

        console.log(this.resource);
        
        

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
    }

    setAnimation()
    {
        this.animation = {}

        
        this.emptyFennec = this.model.children[0].children.find(child => child.name === "EmptyFennec")
        this.emptyOctane = this.model.children[0].children.find(child => child.name === "EmptyOctane")
        
        // // Mixer
        this.animation.mixerFennec = new THREE.AnimationMixer(this.emptyFennec)
        this.animation.mixerOctane = new THREE.AnimationMixer(this.emptyOctane)
        
        // // Actions
        this.animation.actions = {}        
        
        this.animation.actions.fennecAction = this.animation.mixerFennec.clipAction(this.resource.animations[0])
        this.animation.actions.octaneAction = this.animation.mixerOctane.clipAction(this.resource.animations[1])

        this.animation.actions.fennecAction.play()
        this.animation.actions.octaneAction.play()  
        
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

        // 🎲 Génère une vitesse aléatoire
        const minSpeed = 0.88
        const maxSpeed = 3.88
        const newSpeed = Math.random() * (maxSpeed - minSpeed) + minSpeed

        // ⏩ Applique la vitesse à l'animation
        randomAction.timeScale = newSpeed
        this.currentSpeed = newSpeed

        // console.log(`Action : ${randomAction._clip.name}, Vitesse : x${newSpeed.toFixed(2)}`)    

        // const targetModel = randomAction === fAction ? this.emptyFennec : this.emptyOctane
        // this.createSpeedIndicator(targetModel, speedLabel)
    }


    update()
    {
        this.animation.mixerFennec.update(this.time.delta * 0.001)      
        this.animation.mixerOctane.update(this.time.delta * 0.001)
    }
}