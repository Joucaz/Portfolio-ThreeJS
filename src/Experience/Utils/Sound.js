import * as THREE from 'three'
import Experience from "../Experience";

export default class Sound
{
    constructor()
    {
        this.experience = new Experience()         
        this.debug = this.experience.debug

        this.music = new Audio('/sounds/MusicJCValo.mp3')
        this.music.volume = 0.2
        this.music.play()
        
         // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Outlines')
        }
    }
}