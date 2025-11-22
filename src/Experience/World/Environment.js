import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap'

export default class Environment
{
    constructor()
    {
        this.experience = new Experience()
        this.sceneProfile = this.experience.sceneProfile
        this.scenePortfolio = this.experience.scenePortfolio
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        this.currentSection = null        

        this.debugObject = {}

        this.intensityAmbientLight = 0.1
        this.intensityAmbientLightOff = 0.08
        this.intensityDirectionnalLight = 3.5
        this.intensityDirectionnalLightOff = 0
        // this.intensityDirectionnalLight = 0
        // this.intensityDirectionnalLightOff = 0
        this.intensityLightOff = 0.02
        this.intensityLightOn = 1

        
        this.colorProfile = this.experience.world.unlimitedTexture.bakedMaterialProfile.color;
        this.colorPortfolio = this.experience.world.unlimitedTexture.bakedMaterialPortfolio.color;
        this.colorJordan = this.experience.world.unlimitedTexture.bakedMaterialJordan.color;
        this.colorTextRL = this.experience.world.troikaText.textRLMaterial.color;

        this.isMobileEnabled = false;
        
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        // this.setLightProfile()
        // this.setLightPortfolio()
        
        // this.setEnvironmentMap()
    }

    update()
    {
        if(this.experience.sizes.isMobile)
        {
            // console.log("limobile1ht");
            if(!this.isMobileEnabled)
            {
                this.setLightMobile()
                // console.log("mobile");
                this.isMobileEnabled = true;
            }
        }
        else
        {
            // console.log("light");
            
            this.updateLights()   
        }     
    }

    mouseOut()
    {        
        if(this.experience.sizes.isMobile)
            return

        this.currentSection = null
        
        gsap.to(this.ambientLightProfile, { intensity: this.intensityAmbientLightOff, duration: 1, ease: "power2.out" })
        gsap.to(this.ambientLightPortfolio, { intensity: this.intensityAmbientLightOff, duration: 1, ease: "power2.out" })

        gsap.to(this.directionalLightProfile, { intensity: this.intensityDirectionnalLightOff, duration: 1, ease: "power2.out" })
        gsap.to(this.directionalLightPortfolio, { intensity: this.intensityDirectionnalLightOff, duration: 1, ease: "power2.out" })
    }

    updateLights()
    {        
        if(this.experience.cursor.isMouseOutside)
            return

        const isFirst = this.experience.cursor.isFirstSection
        
        if (isFirst !== this.currentSection) 
        {
    
            this.currentSection = isFirst

            // let intensity = { value: isFirst ? this.intensityLightOff : this.intensityLightOn }
            // console.log(intensity);
            

            // gsap.to(intensity, { value: isFirst ? 1 : 0.04, 
            //     duration: 1, 
            //     ease: "power2.out", 
            //     onUpdate: () => { 
            //         this.colorProfile.setScalar(intensity.value); 
            //         this.colorPortfolio.setScalar(1 - intensity.value + 0.03); 
            //         // this.colorJordan.setScalar(1 - intensity.value + 0.03); 
            //         // const c = 1 - intensity.value + 0.03
            //         // this.colorTextRL.setRGB(c, c, c)
            //     }
            // })

            const targetProfile = isFirst ? this.intensityLightOn : this.intensityLightOff;
            const targetPortfolio = isFirst ? this.intensityLightOff : this.intensityLightOn;

            console.log("Target profile:", targetProfile);
            console.log("Target portfolio:", targetPortfolio);

            const startingProfile = this.intensityLightOn - targetProfile + this.intensityLightOff;      // ou selon ton offset
            const startingPortfolio = this.intensityLightOn - targetPortfolio + this.intensityLightOff;

            console.log("Starting profile value:", startingProfile);
            console.log("Starting portfolio value:", startingPortfolio);

            console.log(this.colorProfile);
            
            
            const anim = {
                profile: startingProfile,
                portfolio: startingPortfolio
            };

            gsap.to(anim, {
                profile: targetProfile,
                portfolio: targetPortfolio,
                duration: 1,
                ease: "power2.out",
                onUpdate: () => {
                    this.colorProfile.setScalar(anim.profile);
                    this.colorPortfolio.setScalar(anim.portfolio);
                    this.colorJordan.setScalar(anim.portfolio);
                    this.colorTextRL.setScalar(anim.portfolio);
                }
            });




            // if (isFirst) 
            // {
                // gsap.to(this.experience.world.unlimitedTexture.bakedMaterialProfile.color, { setScalar: 1, duration: 1, ease: "power2.out" })
                // gsap.to(this.experience.world.unlimitedTexture.bakedMaterialPortfolio.color, { setScalar: 0.03, duration: 1, ease: "power2.out" })

                // gsap.to(this.ambientLightProfile, { intensity: this.intensityAmbientLight, duration: 1, ease: "power2.out" })
                // gsap.to(this.ambientLightPortfolio, { intensity: this.intensityAmbientLightOff, duration: 1, ease: "power2.out" })

                // gsap.to(this.directionalLightProfile, { intensity: this.intensityDirectionnalLight, duration: 1, ease: "power2.out" })
                // gsap.to(this.directionalLightPortfolio, { intensity: this.intensityDirectionnalLightOff, duration: 1, ease: "power2.out" })
            // } 
            // else 
            // {
                
                // gsap.to(this.experience.world.unlimitedTexture.bakedMaterialProfile.color, { setScalar: 0.03, duration: 1, ease: "power2.out" })
                // gsap.to(this.experience.world.unlimitedTexture.bakedMaterialPortfolio.color, { setScalar: 1, duration: 1, ease: "power2.out" })

                // gsap.to(this.ambientLightProfile, { intensity: this.intensityAmbientLightOff, duration: 1, ease: "power2.out" })
                // gsap.to(this.ambientLightPortfolio, { intensity: this.intensityAmbientLight, duration: 1, ease: "power2.out" })

                // gsap.to(this.directionalLightProfile, { intensity: this.intensityDirectionnalLightOff, duration: 1, ease: "power2.out" })
                // gsap.to(this.directionalLightPortfolio, { intensity: this.intensityDirectionnalLight, duration: 1, ease: "power2.out" })
            // }
        } 
        
        
    }

    setLightProfile()
    {
        // Ambient Light (0xffffff, 0.2)
        this.ambientLightProfile = new THREE.AmbientLight(0xffffff, this.intensityAmbientLightOff)
        // this.sceneProfile.add(this.ambientLightProfile)

        // Directional Light (0xffffff, 3)
        this.directionalLightProfile = new THREE.DirectionalLight(0xffffff, this.intensityDirectionnalLightOff)
        // this.directionalLightProfile.castShadow = true
        // this.directionalLightProfile.shadow.mapSize.set(1024, 1024)
        // this.directionalLightProfile.shadow.camera.far = 15
        // this.directionalLightProfile.shadow.camera.left = - 7
        // this.directionalLightProfile.shadow.camera.top = 7
        // this.directionalLightProfile.shadow.camera.right = 7
        // this.directionalLightProfile.shadow.camera.bottom = - 7
        this.directionalLightProfile.position.set(5, 5, 5)
        // this.sceneProfile.add(this.directionalLightProfile)

        if(this.debug.active)
        {
            // Toggle visibility
            const paramLightsProfile = { enabledDirectionnalProfile: this.directionalLightProfile.visible,
                                        enabledAmbientProfile: this.ambientLightProfile.visible };
            this.debugFolder
                .add(paramLightsProfile, 'enabledDirectionnalProfile')
                .name('Enable Directional Light Profile')
                .onChange(value => {
                    this.directionalLightProfile.visible = value;
                });
            this.debugFolder
                .add(paramLightsProfile, 'enabledAmbientProfile')
                .name('Enable Ambient Light Profile')
                .onChange(value => {
                    this.ambientLightProfile.visible = value;
                });
            this.debugFolder
                .add(this.ambientLightProfile, 'intensity')
                .name('ambient profile intensity')
                .min(0)
                .max(4)
                .setValue(this.intensityAmbientLight)
                .step(0.1)
            this.debugFolder
                .add(this.directionalLightProfile, 'intensity')
                .name('directional profile intensity')
                .min(0)
                .max(5)
                .setValue(this.intensityDirectionnalLight)
                .step(0.1)     
                   
        }
    }

    setLightPortfolio()
    {

        this.ambientLightPortfolio = new THREE.AmbientLight(0xffffff, this.intensityAmbientLightOff)
        // this.scenePortfolio.add(this.ambientLightPortfolio)

        this.directionalLightPortfolio = new THREE.DirectionalLight(0xffffff, this.intensityDirectionnalLightOff)
        // this.directionalLightPortfolio.castShadow = true
        // this.directionalLightPortfolio.shadow.mapSize.set(1024, 1024)
        // this.directionalLightPortfolio.shadow.camera.far = 15
        // this.directionalLightPortfolio.shadow.camera.left = -7
        // this.directionalLightPortfolio.shadow.camera.top = 7
        // this.directionalLightPortfolio.shadow.camera.right = 7
        // this.directionalLightPortfolio.shadow.camera.bottom = -7
        this.directionalLightPortfolio.position.set(1, 3, 1)
        // this.scenePortfolio.add(this.directionalLightPortfolio)

        // Debug
        if(this.debug.active)
        {
            // Toggle visibility
            const paramLightsPortfolio = { enabledDirectionnalPortfolio: this.directionalLightPortfolio.visible,
                                        enabledAmbientPortfolio: this.ambientLightPortfolio.visible };
            this.debugFolder
                .add(paramLightsPortfolio, 'enabledDirectionnalPortfolio')
                .name('Enable Directional Light Portfolio')
                .onChange(value => {
                    this.directionalLightPortfolio.visible = value;
                });
            this.debugFolder
                .add(paramLightsPortfolio, 'enabledAmbientPortfolio')
                .name('Enable Ambient Light Portfolio')
                .onChange(value => {
                    this.ambientLightPortfolio.visible = value;
                });
            this.debugFolder
                .add(this.ambientLightPortfolio, 'intensity')
                .name('ambientLightPortfolio')
                .min(0)
                .max(10)
                .setValue(this.intensityAmbientLightOff)
                .step(0.1)
            
            this.debugFolder
                .add(this.directionalLightPortfolio, 'intensity')
                .name('directionalLightPortfolio')
                .min(0)
                .max(10)
                .setValue(this.intensityDirectionnalLightOff)
                .step(0.1)            
        }

        // const helper = new THREE.DirectionalLightHelper( this.directionalLightPortfolio, 5 );
        // this.scenePortfolio.add( helper );

    }

    setLightMobile()
    {   
        const starting = this.intensityLightOff; // valeur actuelle
        const target = this.intensityLightOn; // valeur cible

        // Objet animé
        const anim = { value: starting };

        // Animation GSAP
        gsap.to(anim, {
            value: target,
            duration: 1,
            ease: "power2.out",
            onUpdate: () => {
                this.colorProfile.setScalar(anim.value);
                this.colorPortfolio.setScalar(anim.value);
                this.colorJordan.setScalar(anim.value);
                this.colorTextRL.setScalar(anim.value);
            }
        });


        // gsap.to(this.ambientLightProfile, { intensity: this.intensityAmbientLight, duration: 1, ease: "power2.out" })
        // gsap.to(this.ambientLightPortfolio, { intensity: this.intensityAmbientLight, duration: 1, ease: "power2.out" })

        // gsap.to(this.directionalLightProfile, { intensity: this.intensityDirectionnalLight, duration: 1, ease: "power2.out" })
        // gsap.to(this.directionalLightPortfolio, { intensity: this.intensityDirectionnalLight, duration: 1, ease: "power2.out" })
    }

    setEnvironmentMap()
    {
        this.environmentMap = {}
        this.environmentMap.intensity = 0.4
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace
        
        this.scene.environment = this.environmentMap.texture

        this.environmentMap.updateMaterials = () =>
        {
            this.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }
        this.environmentMap.updateMaterials()

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.environmentMap, 'intensity')
                .name('envMapIntensity')
                .min(0)
                .max(4)
                .step(0.001)
                .onChange(this.environmentMap.updateMaterials)
        }
    }
}