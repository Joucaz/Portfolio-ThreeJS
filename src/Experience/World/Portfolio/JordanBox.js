import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class JordanBox
{
    constructor()
    {
        this.experience = new Experience()
        this.scenePortfolio = this.experience.scenePortfolio
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.isPlaying = false
        this.playDirection = -1 // 1 = forward, -1 = backward
        this.playCount = 0 // compte le nombre total d’animations jouées

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('JordanBox')
        }

        
        this.resource = this.resources.items.jordanBox

        this.setModel()
        // this.setTextures()
        this.setMaterial()
        this.setAnimation()
    }

    setModel()
    {        
        this.model = this.resource.scene
        this.experience.world.groupPortfolio.add(this.model)

        console.log(this.model);
        

        // Ajoute une référence vers "this" dans le modèle
        this.model.traverse(child => {
            child.userData.parentInstance = this;

            if(child instanceof THREE.Mesh)
            {
                if (child.material) {
                    child.material = this.experience.world.unlimitedTexture.bakedMaterialPortfolio
                    // child.material.side = THREE.DoubleSide
                }
            }
        });

        // Add object to raycast
        this.experience.objectsIntersectRight.addObject(this.model)
    }

    setTextures()
    {
        this.textures = {}

        this.textures.normal = this.resources.items.jordanNormalTexture
        this.textures.normal.flipY = false

        if(this.debug.active)
        {
            // this.debugFolder.add(this.textures.normal, 'flipY').name('testFlipYNormal').onChange(() => {
            //     this.textures.normal.needsUpdate = true
            // })
        }
    }

    setMaterial()
    {
        this.rightShoes = this.model.children[0].children[1].children.find(child => child.name === "RightShoes008")
        this.leftShoes = this.model.children[0].children[1].children.find(child => child.name === "LeftShoes008")           
        
        // console.log(this.rightShoes);
        

        // const sharedMaterial = new THREE.MeshBasicMaterial({
        //     map: this.textures.greyBlue,
        //     normalMap: this.textures.normal,
        //     metalness: 0,
        //     roughness: 0.843
        // })

        this.rightShoes.material = this.experience.world.unlimitedTexture.bakedMaterialJordan
        this.leftShoes.material = this.experience.world.unlimitedTexture.bakedMaterialJordan
    }

    setAnimation()
    {
        this.animation = {}
                
        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        console.log(this.resource.animations);        
        
        // Actions
        this.animation.actions = {}        
        
        this.animation.actions.boxAction = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.jordanAction = this.animation.mixer.clipAction(this.resource.animations[1])

        // Look when animation is finish with an event
        // this.animation.mixer.addEventListener('finished', () => {
        //     console.log("finish");
            
        //     this.isPlaying = false
        // })
        
    }

    changeTexture(currentTexture)
    {
        const textureOptions = [
            this.experience.world.unlimitedTexture.textures.colorJordanGreyBlue,
            this.experience.world.unlimitedTexture.textures.colorJordanRed,
            this.experience.world.unlimitedTexture.textures.colorJordanPurple
        ]

        // On filtre la texture actuelle
        const filtered = textureOptions.filter(tex => tex !== currentTexture);

        const randomTexture = filtered[Math.floor(Math.random() * filtered.length)];

        return randomTexture;
    }

    playAnimation()
    {
        if (this.isPlaying) return

        const actionJordan = this.animation.actions.jordanAction
        const actionBox = this.animation.actions.boxAction

        // alterne la direction à chaque appel
        this.playDirection *= -1

        // on prend la durée de la plus longue animation (par sécurité)
        const duration = Math.max(
            this.resource.animations[0].duration,
            this.resource.animations[1].duration
        )
        const durationMs = duration * 1000

        // configuration commune
        const setupAction = (action) => {
            action.timeScale = this.playDirection
            action.reset()
            action.setLoop(THREE.LoopOnce, 1)
            action.clampWhenFinished = true

            // ⚡ si on joue à l'envers, on démarre à la fin
            if (this.playDirection === -1) {
                action.time = action.getClip().duration
            } else {
                action.time = 0
            }
            action.play()
        }

        // lancement des deux animations synchronisées
        setupAction(actionJordan)
        setupAction(actionBox)

        this.isPlaying = true

        // quand les animations sont terminées
        setTimeout(() => {
            this.isPlaying = false
            this.playCount++

            // changement de texture : à la fin de la première puis toutes les 2 suivantes
            if (this.playCount === 1 || this.playCount % 2 === 1) {
                const currentMap = this.rightShoes.material.map
                const newTexture = this.changeTexture(currentMap)

                this.rightShoes.material.map = newTexture
                this.leftShoes.material.map = newTexture
                this.rightShoes.material.needsUpdate = true
                this.leftShoes.material.needsUpdate = true
            }
        }, durationMs)
    }


    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)      

        // console.log(this.resource.animations[0].duration);
        
        // Look when animation is finish
        if (this.isPlaying && this.animation.actions.jordanAction.time >= this.resource.animations[0].duration) {
            this.isPlaying = false;
        }
    }
}