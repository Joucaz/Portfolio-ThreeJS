import * as THREE from 'three'
import Experience from '../Experience.js'
import Environment from './Environment.js'
import BaseProfile from './Profile/BaseProfile.js'
import Reyna from './Portfolio/Reyna.js'
import BasePortfolio from './Portfolio/BasePortfolio.js'
import TV from './Portfolio/TV.js'
import ReynaEchelle from './Portfolio/TV.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.sceneProfile = this.experience.sceneProfile
        this.scenePortfolio = this.experience.scenePortfolio
        this.resources = this.experience.resources
        this.groupProfile = new THREE.Group()
        this.groupPortfolio = new THREE.Group()

        /**
         * Floor
         */
        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({
                color: '#ffffff',
                metalness: 0,
                roughness: 0.5
            })
        )
        cube.castShadow = true
        // floor.rotation.x = - Math.PI * 0.5
        this.sceneProfile.add(cube)
        this.experience.objectsIntersectLeft.addObject(cube)

        // this.environment = new Environment()

        // Wait for resources
        this.resources.on('ready', () =>
        {
            console.log("ready");
            
            // Setup
            // this.floor = new Floor()
            
            // Setup Group
            this.sceneProfile.add(this.groupProfile)
            // this.groupProfile.position.z = 2
            // this.groupProfile.position.y = -1
            // this.groupProfile.scale.setScalar(2)

            this.scenePortfolio.add(this.groupPortfolio)
            // this.groupPortfolio.position.z = 2
            // this.groupPortfolio.position.y = -1
            // this.groupPortfolio.scale.setScalar(2)
            
            // Setup Profile
            this.baseProfile = new BaseProfile()

            // Setup Portfolio    
            this.basePortfolio = new BasePortfolio()

            this.reyna = new Reyna()
            this.reynaEchelle = new ReynaEchelle()

            // Setup Environment
            this.environment = new Environment()
        })
    }

    update()
    {        
        if(this.reyna)
            this.reyna.update()
        if(this.environment)
            this.environment.update()
    }

    mouseOut()
    {
        // this.environment.mouseOut()
    }
}