import * as THREE from 'three'
import Experience from '../Experience.js'
import Environment from './Environment.js'
import BaseProfile from './Profile/BaseProfile.js'
import Reyna from './Portfolio/Reyna.js'
import BasePortfolio from './Portfolio/BasePortfolio.js'
import RLTrack from './Portfolio/RLTrack.js'
import Chamber from './Portfolio/Chamber.js'
import Breach from './Portfolio/Breach.js'
import Jordan from './Portfolio/Jordan.js'
import UnlimitedTexture from './UnlimitedTexture.js'
import TVScreen from './Portfolio/TVScreen.js'
import Ball from './Profile/Ball.js'
import Chair from './Profile/Chair.js'
import Hat from './Profile/Hat.js'
import Mouse from './Profile/Mouse.js'
import PC from './Profile/PC.js'
import Monitor from './Profile/Monitor.js'

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

            this.unlimitedTexture = new UnlimitedTexture()
            
            // Setup Profile
            this.baseProfile = new BaseProfile()

            this.ball = new Ball()
            this.chair = new Chair()
            this.hat = new Hat()
            this.mouse = new Mouse()
            this.pc = new PC()
            this.monitor = new Monitor()

            // Setup Portfolio    
            this.basePortfolio = new BasePortfolio()

            this.reyna = new Reyna()
            this.chamber = new Chamber()
            this.breach = new Breach()
            this.rlTrack = new RLTrack()
            this.jordan = new Jordan()
            this.tvScreen = new TVScreen()

            // Setup Environment
            this.environment = new Environment()
        })
    }

    update()
    {        
        // Portfolio
        if(this.reyna)
            this.reyna.update()
        if(this.chamber)
            this.chamber.update()
        if(this.breach)
            this.breach.update()
        if(this.rlTrack)
            this.rlTrack.update()
        if(this.jordan)
            this.jordan.update()
        if(this.tvScreen)
            this.tvScreen.update()

        // Profile
        if(this.ball)
            this.ball.update()
        if(this.chair)
            this.chair.update()
        if(this.hat)
            this.hat.update()
        if(this.mouse)
            this.mouse.update()
        if(this.pc)
            this.pc.update()
        if(this.monitor)
            this.monitor.update()

        if(this.environment)
            this.environment.update()
    }

    mouseOut()
    {
        if(this.environment)
            this.environment.mouseOut()
    }
}