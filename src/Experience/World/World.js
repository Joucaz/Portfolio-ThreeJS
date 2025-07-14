import * as THREE from 'three'
import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Fox from './Fox.js'
import BaseProfile from './Profile/BaseProfile.js'

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
        // const cube = new THREE.Mesh(
        //     new THREE.BoxGeometry(1, 1, 1),
        //     new THREE.MeshStandardMaterial({
        //         color: '#ffffff',
        //         metalness: 0,
        //         roughness: 0.5
        //     })
        // )
        // cube.castShadow = true
        // // floor.rotation.x = - Math.PI * 0.5
        // this.sceneProfile.add(cube)
        // this.experience.objectsIntersectLeft.addObject(cube)

        // const floor = new THREE.Mesh(
        //     new THREE.PlaneGeometry(50, 50),
        //     new THREE.MeshStandardMaterial({
        //         color: '#444444',
        //         metalness: 0,
        //         roughness: 0.5
        //     })
        // )
        // floor.receiveShadow = true
        // floor.rotation.x = - Math.PI * 0.5
        // this.sceneProfile.add(floor)

        // const floor2 = floor.clone()
        // this.scenePortfolio.add(floor2)

        this.environment = new Environment()

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            // this.floor = new Floor()
            
            // Setup Group
            this.sceneProfile.add(this.groupProfile)
            this.groupProfile.position.z = 2
            this.groupProfile.position.y = -1
            this.groupProfile.scale.setScalar(2)

            this.scenePortfolio.add(this.groupPortfolio)
            this.groupPortfolio.position.z = 2
            this.groupPortfolio.position.y = -1
            this.groupPortfolio.scale.setScalar(2)
            
            // Setup Profile
            this.baseProfile = new BaseProfile()

            // Setup Portfolio        

            // Setup Environment
            this.environment = new Environment()
        })
    }

    update()
    {
        this.environment.update()
        // if(this.fox)
        //     this.fox.update()
    }

    mouseOut()
    {
        this.environment.mouseOut()
    }
}