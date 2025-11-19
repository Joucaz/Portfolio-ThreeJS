import * as THREE from 'three'
import Experience from './Experience.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';

export default class Renderer
{
    constructor()
    {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.cursor = this.experience.cursor
        this.sceneProfile = this.experience.sceneProfile
        this.scenePortfolio = this.experience.scenePortfolio
        this.camera = this.experience.camera
        this.enablePostProcessing = true
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.rendererFolder = this.debug.ui.addFolder('Renderer')
        
            this.postProcessingFolder = this.rendererFolder.addFolder('Post Processing');

            this.outlineFolder = this.postProcessingFolder.addFolder('Outline');
        }

        this.setInstance()
        this.setPostProcessing()
        this.setDebug()

        this.selectedObjects = [];

    }

    setPostProcessing()
    {
        if(!this.enablePostProcessing)
            return
        // Post-processing
        this.composerProfile = new EffectComposer(this.instance);
        this.composerProfile.setSize(this.sizes.width, this.sizes.height)
        this.composerProfile.setPixelRatio(this.sizes.pixelRatio)
        this.composerPortfolio = new EffectComposer(this.instance);
        this.composerProfile.setSize(this.sizes.width, this.sizes.height)
        this.composerProfile.setPixelRatio(this.sizes.pixelRatio)

        this.renderPassProfile = new RenderPass(this.sceneProfile, this.camera.instance);
        this.renderPassPortfolio = new RenderPass(this.scenePortfolio, this.camera.instance);
        this.composerProfile.addPass(this.renderPassProfile);
        this.composerPortfolio.addPass(this.renderPassPortfolio);

        this.outlinePassProfile = new OutlinePass(
            new THREE.Vector2(this.sizes.width, this.sizes.height),
            this.sceneProfile,
            this.camera.instance
        );
        this.outlinePassPortfolio = new OutlinePass(
            new THREE.Vector2(this.sizes.width, this.sizes.height),
            this.scenePortfolio,
            this.camera.instance
        );

        [this.outlinePassProfile, this.outlinePassPortfolio].forEach(op => {
            op.visibleEdgeColor.set('#ffffff');
            op.hiddenEdgeColor.set('#190a05');
            op.edgeStrength = 3.0;
            op.edgeGlow = 0.5;
            op.edgeThickness = 2.0;
            op.pulsePeriod = 0;
        });

        this.composerProfile.addPass(this.outlinePassProfile);
        this.composerPortfolio.addPass(this.outlinePassPortfolio);

        // this.outputPassProfile = new OutputPass();
        // this.outputPassPortfolio = new OutputPass();
        // this.composerProfile.addPass(this.outputPassProfile);
        // this.composerPortfolio.addPass(this.outputPassPortfolio);


        // this.effectFXAAProfile = new ShaderPass(FXAAShader);
        // this.effectFXAAPortfolio = new ShaderPass(FXAAShader);
        // this.effectFXAAProfile.uniforms['resolution'].value.set(1 / this.sizes.width, 1 / this.sizes.height);
        // this.effectFXAAPortfolio.uniforms['resolution'].value.set(1 / this.sizes.width, 1 / this.sizes.height);
        // this.composerProfile.addPass(this.effectFXAAProfile);
        // this.composerPortfolio.addPass(this.effectFXAAPortfolio);
    }

    setDebug()
    {
        if (this.debug.active) {

            if(this.enablePostProcessing)
            {
                const params = {
                    edgeStrength: this.outlinePassProfile.edgeStrength,
                    edgeGlow: this.outlinePassProfile.edgeGlow,
                    edgeThickness: this.outlinePassProfile.edgeThickness,
                    pulsePeriod: this.outlinePassProfile.pulsePeriod,
                    usePatternTexture: this.outlinePassProfile.usePatternTexture,
                };

                const applyToBoth = (callback) => {
                    callback(this.outlinePassProfile);
                    callback(this.outlinePassPortfolio);
                };

                this.outlineFolder.add(params, 'edgeStrength', 0.01, 10).onChange((value) => {
                    applyToBoth((p) => (p.edgeStrength = Number(value)));
                });

                this.outlineFolder.add(params, 'edgeGlow', 0.0, 1.0).onChange((value) => {
                    applyToBoth((p) => (p.edgeGlow = Number(value)));
                });

                this.outlineFolder.add(params, 'edgeThickness', 1, 4).onChange((value) => {
                    applyToBoth((p) => (p.edgeThickness = Number(value)));
                });

                this.outlineFolder.add(params, 'pulsePeriod', 0.0, 5.0).onChange((value) => {
                    applyToBoth((p) => (p.pulsePeriod = Number(value)));
                });

                this.outlineFolder.add(params, 'usePatternTexture').onChange((value) => {
                    applyToBoth((p) => (p.usePatternTexture = value));
                });
            }

            const toneMappingOptions = {
                NoToneMapping: THREE.NoToneMapping,
                LinearToneMapping: THREE.LinearToneMapping,
                ReinhardToneMapping: THREE.ReinhardToneMapping,
                CineonToneMapping: THREE.CineonToneMapping,
                ACESFilmicToneMapping: THREE.ACESFilmicToneMapping
            };

            // On suppose que this.instance est ton renderer
            this.rendererFolder.add(this.instance, 'toneMapping', toneMappingOptions)
                .name('Tone Mapping')
                .onChange(() => {
                    this.instance.toneMapping = parseInt(this.instance.toneMapping);
                    this.instance.needsUpdate = true; // parfois nécessaire pour que ça prenne effet
                });

            // Exposure (luminosité globale)
            this.rendererFolder.add(this.instance, 'toneMappingExposure', 0, 5, 0.01)
                .name('Exposure');

            // Output encoding
            const encodingOptions = {
                LinearEncoding: THREE.LinearEncoding,
                sRGBEncoding: THREE.sRGBEncoding
            };

            this.rendererFolder.add(this.instance, 'outputEncoding', encodingOptions)
                .name('Output Encoding')
                .onChange(() => {
                    this.instance.outputEncoding = parseInt(this.instance.outputEncoding);
                });
        }
    }

    addSelectedObject( object ) 
    {
		this.selectedObjects.push( object )
	}

    removeSelectedObject()
    {
        this.selectedObjects.pop()
    }

    enableOutline()
    {
        if(this.cursor.isFirstSection)
        {
            this.outlinePassProfile.selectedObjects = this.selectedObjects;
        }
        else
        {
            this.outlinePassPortfolio.selectedObjects = this.selectedObjects;
        }
        
    }

    setInstance()
    {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: false,
            powerPreference: 'high-performance'
        })
        this.instance.toneMapping = THREE.NoToneMapping
        this.instance.toneMappingExposure = 1.75
        // this.instance.shadowMap.enabled = true
        // this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.setClearColor('#211d20')
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
        this.instance.autoUpdate = false

        // this.sceneProfile.overrideMaterial = new THREE.MeshBasicMaterial({ color: "green" });
    }

    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)

        // ⚙️ Chaque composer ne couvre qu'une moitié d'écran
        const halfWidth = this.sizes.isMobile ? this.sizes.width : this.sizes.width / 2
        const halfHeight = this.sizes.isMobile ? this.sizes.height / 2 : this.sizes.height

        // Resize des composers
        this.composerProfile.setSize(halfWidth, halfHeight)
        this.composerProfile.setPixelRatio(this.sizes.pixelRatio)
        this.composerPortfolio.setSize(halfWidth, halfHeight)
        this.composerPortfolio.setPixelRatio(this.sizes.pixelRatio)

        // Resize des OutlinePass
        if (this.outlinePassProfile && this.outlinePassPortfolio) {
            this.outlinePassProfile.setSize(halfWidth, halfHeight)
            this.outlinePassPortfolio.setSize(halfWidth, halfHeight)
        }

        // FXAA (résolution inverse)
        // if (this.effectFXAAProfile && this.effectFXAAPortfolio) {
        //     this.effectFXAAProfile.uniforms['resolution'].value.set(1 / halfWidth, 1 / halfHeight)
        //     this.effectFXAAPortfolio.uniforms['resolution'].value.set(1 / halfWidth, 1 / halfHeight)
        // }
    }

    update()
    {    
        // console.log(this.selectedObjects)
        // console.log(this.instance.info)
        this.instance.setScissorTest(true)

        if(!this.sizes.isMobile)
        {
            // ----- Desktop : 2 colonnes -----
            // Partie gauche
            this.instance.setViewport(0, 0, this.sizes.width / 2, this.sizes.height)
            this.instance.setScissor(0, 0, this.sizes.width / 2, this.sizes.height)
            if(this.cursor.isFirstSection)
            {
                this.composerProfile.render()
            }
            else{
                this.instance.render(this.sceneProfile, this.camera.instance)
            }
            // this.instance.render(this.sceneProfile, this.camera.instance)
            // this.composerProfile.render()

            // Partie droite
            this.instance.setViewport(this.sizes.width / 2, 0, this.sizes.width / 2, this.sizes.height)
            this.instance.setScissor(this.sizes.width / 2, 0, this.sizes.width / 2, this.sizes.height)

            if(this.cursor.isFirstSection)
            {
                this.camera.instance.layers.set(0);
                this.camera.instance.layers.enable(1);
                this.instance.render(this.scenePortfolio, this.camera.instance)
            }
            else
            {
            
                // this.experience.world.troikaText.groupText.traverse(c => c.layers.set(1));

                this.camera.instance.layers.set(0); 
                this.composerPortfolio.render();
                this.instance.autoClear = false;         

                this.camera.instance.layers.set(1); 
                this.instance.render(this.scenePortfolio, this.camera.instance)
                this.camera.instance.layers.set(0);

                    
            }

            // this.instance.render(this.scenePortfolio, this.camera.instance)
            // this.composerPortfolio.render()
        }
        else
        {
            // ----- Mobile : 2 lignes -----
            // Partie haute
            this.instance.setViewport(0, this.sizes.height / 2, this.sizes.width, this.sizes.height / 2)
            this.instance.setScissor(0, this.sizes.height / 2, this.sizes.width, this.sizes.height / 2)
            // this.instance.render(this.sceneProfile, this.camera.instance)
            this.composerProfile.render()

            // Partie basse
            this.instance.setViewport(0, 0, this.sizes.width, this.sizes.height / 2)
            this.instance.setScissor(0, 0, this.sizes.width, this.sizes.height / 2)
            // this.instance.render(this.scenePortfolio, this.camera.instance)
            this.composerPortfolio.render()
        }
        
        if(this.enablePostProcessing)
        {
            this.enableOutline()
        }

    }
}