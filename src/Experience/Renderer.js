import * as THREE from 'three'
import Experience from './Experience.js'

export default class Renderer
{
    constructor()
    {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.sceneProfile = this.experience.sceneProfile
        this.scenePortfolio = this.experience.scenePortfolio
        this.camera = this.experience.camera

        this.setInstance()
    }

    setInstance()
    {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        this.instance.toneMapping = THREE.CineonToneMapping
        this.instance.toneMappingExposure = 1.75
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.setClearColor('#211d20')
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    update()
    {    
        this.instance.setScissorTest(true)

        if(!this.sizes.isMobile)
        {
            // ----- Desktop : 2 colonnes -----
            // Partie gauche
            this.instance.setViewport(0, 0, this.sizes.width / 2, this.sizes.height)
            this.instance.setScissor(0, 0, this.sizes.width / 2, this.sizes.height)
            this.instance.render(this.sceneProfile, this.camera.instance)

            // Partie droite
            this.instance.setViewport(this.sizes.width / 2, 0, this.sizes.width / 2, this.sizes.height)
            this.instance.setScissor(this.sizes.width / 2, 0, this.sizes.width / 2, this.sizes.height)
            this.instance.render(this.scenePortfolio, this.camera.instance)
        }
        else
        {
            // ----- Mobile : 2 lignes -----
            // Partie haute
            this.instance.setViewport(0, this.sizes.height / 2, this.sizes.width, this.sizes.height / 2)
            this.instance.setScissor(0, this.sizes.height / 2, this.sizes.width, this.sizes.height / 2)
            this.instance.render(this.sceneProfile, this.camera.instance)

            // Partie basse
            this.instance.setViewport(0, 0, this.sizes.width, this.sizes.height / 2)
            this.instance.setScissor(0, 0, this.sizes.width, this.sizes.height / 2)
            this.instance.render(this.scenePortfolio, this.camera.instance)
        }

    }
}