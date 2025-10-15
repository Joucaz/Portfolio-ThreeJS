import * as THREE from 'three'
import Experience from "../Experience";
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';

export default class PostProcessing
{
    constructor()
    {        
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.camera = this.experience.camera.instance
        this.sceneProfile = this.experience.sceneProfile
        this.scenePortfolio = this.experience.scenePortfolio
        this.renderer = this.experience.renderer.instance

        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Post processing')
        }

        this.setComposer()

    }

    setComposer()
    {
        // === POST PROCESS INITIALISATION ===
        this.composerProfile = new EffectComposer(this.renderer)
        // HDR render targets
        this.composerProfile.renderTarget1.texture.type = THREE.HalfFloatType
        this.composerProfile.renderTarget2.texture.type = THREE.HalfFloatType
        this.composerPortfolio = new EffectComposer(this.renderer)

        // === PASSES ===
        const renderPassProfile = new RenderPass(this.sceneProfile, this.camera)
        const renderPassPortfolio = new RenderPass(this.scenePortfolio, this.camera)
        this.composerProfile.addPass(renderPassProfile)
        this.composerPortfolio.addPass(renderPassPortfolio)

        
        // === OUTLINE PASS ===
        this.outlinePassProfile = new OutlinePass(
            new THREE.Vector2(this.sizes.width, this.sizes.height),
            this.sceneProfile,
            this.camera
        )
        this.outlinePassProfile.edgeStrength = 3.0
        this.outlinePassProfile.edgeThickness = 5.0
        this.outlinePassProfile.visibleEdgeColor.set('#ff0000')
        this.outlinePassProfile.hiddenEdgeColor.set('#ff0000')

        this.outlinePassPortfolio = new OutlinePass(
            new THREE.Vector2(this.sizes.width, this.sizes.height),
            this.scenePortfolio,
            this.camera
        )
        this.outlinePassPortfolio.edgeStrength = 3.0
        this.outlinePassPortfolio.edgeThickness = 5.0
        this.outlinePassPortfolio.visibleEdgeColor.set('#ff0000')
        this.outlinePassPortfolio.hiddenEdgeColor.set('#ff0000')

        this.composerProfile.addPass(this.outlinePassProfile)
        this.composerPortfolio.addPass(this.outlinePassPortfolio)

        if(this.debug.active)
        {
            this.debugFolder
                .add(this.outlinePassProfile, 'edgeStrength')
                .name('edgeStrength')
                .min(0)
                .max(15)
                .step(1)
            
            this.debugFolder
                .add(this.outlinePassProfile, 'edgeThickness')
                .name('edgeThickness')
                .min(0)
                .max(15)
                .step(1)

        }
        // this.composerPortfolio.addPass(this.outlinePass)
    }

    setOutlinedObjects(objects = [])
    {
        // objects : tableau de meshes THREE
        this.outlinePassProfile.selectedObjects = objects
    }
    
    resize()
    {
        this.composerProfile.setSize(this.sizes.width, this.sizes.height)
        this.composerPortfolio.setSize(this.sizes.width, this.sizes.height)
    }

    update()
    {
         // Important : disable auto clear pour gérer split-screen
        this.renderer.autoClear = false
        this.renderer.clear()
        this.renderer.setScissorTest(true)

        if (!this.sizes.isMobile) {
            // Partie gauche : sceneProfile
            this.renderer.setViewport(0, 0, this.sizes.width / 2, this.sizes.height)
            this.renderer.setScissor(0, 0, this.sizes.width / 2, this.sizes.height)
            this.composerProfile.render()

            // Partie droite : scenePortfolio
            this.renderer.setViewport(this.sizes.width / 2, 0, this.sizes.width / 2, this.sizes.height)
            this.renderer.setScissor(this.sizes.width / 2, 0, this.sizes.width / 2, this.sizes.height)
            this.composerPortfolio.render()
        } else {
            // Partie haute : sceneProfile
            this.renderer.setViewport(0, this.sizes.height / 2, this.sizes.width, this.sizes.height / 2)
            this.renderer.setScissor(0, this.sizes.height / 2, this.sizes.width, this.sizes.height / 2)
            this.composerProfile.render()

            // Partie basse : scenePortfolio
            this.renderer.setViewport(0, 0, this.sizes.width, this.sizes.height / 2)
            this.renderer.setScissor(0, 0, this.sizes.width, this.sizes.height / 2)
            this.composerPortfolio.render()
        }
    }
}