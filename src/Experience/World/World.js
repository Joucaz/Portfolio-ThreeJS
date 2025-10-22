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

        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('World')
        }

        // Wait for resources
        this.resources.on('ready', () =>
        {            
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

            this.arrayAnimationProfile = [this.ball, this.chair, this.hat, this.mouse, this.pc]

            // Setup Portfolio    
            this.basePortfolio = new BasePortfolio()

            this.reyna = new Reyna()
            this.chamber = new Chamber()
            this.breach = new Breach()
            this.rlTrack = new RLTrack()
            this.jordan = new Jordan()
            this.tvScreen = new TVScreen()

            this.arrayAnimationPortfolio = [this.reyna, this.chamber, this.breach, this.rlTrack, this.jordan]

            // Setup Environment
            this.environment = new Environment()
        })

        if(this.debug.active)
        {
            // this.debugFolder
            //     .add(this.instance, 'fov')
            //     .name('FOV')
            //     .min(0)
            //     .max(150)
            //     .step(1)
            //     .onChange((value) => {
            //         this.instance.fov = value; // on met à jour le FOV
            //         this.instance.updateProjectionMatrix(); // obligatoire pour appliquer le changement
            //     });
            
            const scaleParams = { scale: 1 };

            this.debugFolder
                .add(scaleParams, 'scale')
                .name('Scene Scale')
                .min(0.1)
                .max(10)
                .step(0.01)
                .onChange((value) => {
                    // Applique la même échelle sur les 3 axes
                    this.groupProfile.scale.set(value, value, value);
                    this.groupPortfolio.scale.set(value, value, value);
                });
        }

        this.currentAnimationProfile = null
        this.currentAnimationPortfolio = null

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

        
        if(this.experience.sizes.isMobile)
        {
            if(this.currentAnimationProfile == null || !this.currentAnimationProfile.isPlaying)
            {
                this.playRandomProfileAnimation()
            }
            if(this.currentAnimationPortfolio == null || !this.currentAnimationPortfolio.isPlaying)
            {
                this.playRandomPortfolioAnimation()
            }
            
        }
    }

    playRandomProfileAnimation()
    {
        if(this.arrayAnimationProfile == null)
            return
        
        const randomIndex = Math.floor(Math.random() * this.arrayAnimationProfile.length);
        this.currentAnimationProfile = this.arrayAnimationProfile[randomIndex];

        this.currentAnimationProfile.playAnimation()
        
    }

    playRandomPortfolioAnimation()
    {
        if(this.arrayAnimationPortfolio == null)
            return
        
        const randomIndex = Math.floor(Math.random() * this.arrayAnimationPortfolio.length);
        this.currentAnimationPortfolio = this.arrayAnimationPortfolio[randomIndex];

        this.currentAnimationPortfolio.playAnimation()
        
    }

    mouseOut()
    {
        if(this.environment)
            this.environment.mouseOut()
    }
}