import * as THREE from 'three'
import Experience from '../../Experience.js'

export default class Jordan
{
    constructor()
    {
        this.experience = new Experience()
        this.scenePortfolio = this.experience.scenePortfolio
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.isPlaying = false;

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Jordan')
        }

        
        this.resource = this.resources.items.jordan

        this.setModel()
        this.setTextures()
        this.setMaterial()
        this.setAnimation()
    }

    setModel()
    {        
        this.model = this.resource.scene
        this.experience.world.groupPortfolio.add(this.model)

        // Ajoute une référence vers "this" dans le modèle
        this.model.traverse(child => {
            child.userData.parentInstance = this;
        });

        // Add object to raycast
        this.experience.objectsIntersectRight.addObject(this.model)
    
        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.receiveShadow = true
                child.castShadow = true
            }
        })
    }

    setTextures()
    {
        this.textures = {}

        this.textures.greyBlue = this.resources.items.jordanGreyBlueTexture
        this.textures.greyBlue.flipY = false  
        this.textures.greyBlue.colorSpace = THREE.SRGBColorSpace

        this.textures.red = this.resources.items.jordanRedTexture
        this.textures.red.flipY = false
        this.textures.red.colorSpace = THREE.SRGBColorSpace

        this.textures.purple = this.resources.items.jordanPurpleTexture
        this.textures.purple.flipY = false
        this.textures.purple.colorSpace = THREE.SRGBColorSpace

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
        this.rightShoes = this.model.children[0].children[1].children.find(child => child.name === "RightShoes")
        this.leftShoes = this.model.children[0].children[1].children.find(child => child.name === "LeftShoes")      

        const sharedMaterial= new THREE.MeshStandardMaterial({
            map: this.changeTexture(),
            normalMap: this.textures.normal,
            metalness: 0,
            roughness: 0.843
        })

        this.rightShoes.material = sharedMaterial
        this.leftShoes.material = sharedMaterial

    }

    setAnimation()
    {
        this.animation = {}
                
        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        
        // Actions
        this.animation.actions = {}        
        
        this.animation.actions.jordanAction = this.animation.mixer.clipAction(this.resource.animations[0])

        // Look when animation is finish with an event
        // this.animation.mixer.addEventListener('finished', () => {
        //     console.log("finish");
            
        //     this.isPlaying = false
        // })
        
    }

    changeTexture(currentTexture)
    {
        const textureOptions = [
            this.textures.red,
            this.textures.purple,
            this.textures.greyBlue
        ]

        // On filtre la texture actuelle
        const filtered = textureOptions.filter(tex => tex !== currentTexture);

        const randomTexture = filtered[Math.floor(Math.random() * filtered.length)];

        return randomTexture;
    }

    playAnimation()
    {
        if (this.isPlaying) return;

        const action = this.animation.actions.jordanAction;

        action.reset();                         // ← remet à la frame 0
        action.setLoop(THREE.LoopOnce, 1);      // ← joue une seule fois
        action.clampWhenFinished = true;        // ← reste sur la dernière frame
        this.isPlaying = true;
        action.play();   

        console.log(action);

        const halfActionDuration = this.resource.animations[0].duration / 2 * 1000
        

        setTimeout(() => {
            const currentMap = this.rightShoes.material.map;
            const newTexture = this.changeTexture(currentMap);

            this.rightShoes.material.map = newTexture;
            this.leftShoes.material.map = newTexture;
            newTexture.needsUpdate = true;
        }, halfActionDuration);
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