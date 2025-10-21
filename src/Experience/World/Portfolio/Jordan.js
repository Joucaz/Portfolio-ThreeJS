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
    
        // this.model.traverse((child) =>
        // {
        //     if(child instanceof THREE.Mesh)
        //     {
        //         child.receiveShadow = true
        //         child.castShadow = true
        //     }
        // })
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

    getRandomNextTexture(currentTexture)
    {
        const textureOptions = [
            this.textures.red,
            this.textures.purple,
            this.textures.greyBlue
        ];

        // on évite de retomber sur la même texture
        const filtered = textureOptions.filter(tex => tex !== currentTexture);
        const randomTexture = filtered[Math.floor(Math.random() * filtered.length)];

        return randomTexture;
    }

    setMaterial()
    {
        this.rightShoes = this.model.children[0].children[1].children.find(child => child.name === "RightShoes")
        this.leftShoes = this.model.children[0].children[1].children.find(child => child.name === "LeftShoes")

        const sharedMaterial = new THREE.MeshStandardMaterial({
            map: this.textures.red,
            normalMap: this.textures.normal,
            metalness: 0,
            roughness: 0.843
        })

        // 🧩 Transition shader
        sharedMaterial.onBeforeCompile = (shader) => {
            shader.uniforms.texA = { value: this.textures.greyBlue }
            shader.uniforms.texB = { value: this.textures.red }
            shader.uniforms.progress = { value: 0 }

            // Déclare bien les UV pour éviter les erreurs
            shader.vertexShader = shader.vertexShader.replace(
                '#include <uv_pars_vertex>',
                `
                #include <uv_pars_vertex>
                varying vec2 vUvCustom;
                `
            )

            shader.vertexShader = shader.vertexShader.replace(
                '#include <uv_vertex>',
                `
                #include <uv_vertex>
                vUvCustom = uv;
                `
            )

            // ⚡ Remplace la section texture du fragment shader
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <map_pars_fragment>',
                `
                #include <map_pars_fragment>
                uniform sampler2D texA;
                uniform sampler2D texB;
                uniform float progress;
                varying vec2 vUvCustom;
                `
            )

            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <map_fragment>',
                `
                #ifdef USE_MAP
                    vec4 texelA = texture2D(texA, vUvCustom);
                    vec4 texelB = texture2D(texB, vUvCustom);
                    vec4 mixedTex = mix(texelA, texelB, progress);
                    diffuseColor *= mixedTex;
                #endif
                `
            )

            sharedMaterial.userData.shader = shader
            this.shader = shader
        }

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
        if (this.isPlaying) return

        const action = this.animation.actions.jordanAction
        action.reset()
        action.setLoop(THREE.LoopOnce, 1)
        action.clampWhenFinished = true
        this.isPlaying = true
        action.play()

        const shader = this.rightShoes.material.userData.shader
        if (!shader) return

        const currentTex = shader.uniforms.texA.value
        const nextTex = this.getRandomNextTexture(currentTex)
        shader.uniforms.texB.value = nextTex
    }


    update()
    {
        // Update mixer
        this.animation.mixer.update(this.time.delta * 0.001)

        if (!this.isPlaying) return

        const action = this.animation.actions.jordanAction
        const animTime = action.time
        const animDuration = this.resource.animations[0].duration

        const shader = this.rightShoes.material.userData.shader
        if (!shader) return

        // Transition window : 25% → 75% de l'animation
        const startTime = animDuration * 0.25
        const endTime = animDuration * 0.75
        const transitionDuration = endTime - startTime

        if (animTime >= startTime && animTime <= endTime)
        {
            // Progression de 0 → 1 sur cette fenêtre
            const progress = (animTime - startTime) / transitionDuration
            shader.uniforms.progress.value = progress
        }
        else if (animTime < startTime)
        {
            shader.uniforms.progress.value = 0
        }
        else if (animTime > endTime)
        {
            shader.uniforms.progress.value = 1
            // Une fois terminé → la texture B devient A
            if (!this.transitionDone)
            {
                shader.uniforms.texA.value = shader.uniforms.texB.value
                shader.uniforms.progress.value = 0
                this.transitionDone = true
            }
        }

        // Check fin animation
        if (animTime >= animDuration)
        {
            this.isPlaying = false
            this.transitionDone = false
        }
    }


}