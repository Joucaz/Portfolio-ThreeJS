import * as THREE from 'three'
import Experience from "../Experience";
import EventEmitter from "./EventEmitter";

export default class Input extends EventEmitter {
    constructor() {
        super();
        this.experience = new Experience();

        const glassCard = document.querySelector('.glass-card');
        const infoBtn = glassCard.querySelector('.info-btn');
        const cardFull = glassCard.querySelector('.card-full');
        this.isMuted = false
        // const buttonVolume = this.isMuted ? document.querySelector('.btn-volume-mute') : document.querySelector('.btn-volume-up');
        const buttonVolumeOn = document.querySelector('.btn-volume-up')
        const buttonVolumeOff = document.querySelector('.btn-volume-off')
        const buttonVolumeOnMobile = document.querySelector('.btn-volume-up-mobile')
        const buttonVolumeOffMobile = document.querySelector('.btn-volume-off-mobile')
        const buttonClose = document.querySelector('.btn-close');

        this.isInfosOpen = false;

        const actions = {
            'ArrowRight': () => window.location.href = '/portfolio',
            'ArrowLeft': () => window.location.href = '/profile/en',
            'KeyR': () => this.experience.world.reyna.playAnimation(),
            'KeyB': () => this.experience.world.breach.playAnimation(),
            'KeyC': () => this.experience.world.chamber.playAnimation(),
            'KeyL': () => this.experience.world.rlTrack.playAnimation(),
            'KeyJ': () => this.experience.world.jordan.playAnimation(),
            'KeyV': () => this.experience.world.ball.playAnimation(),
            'KeyM': () => this.experience.world.mouse.playAnimation(),
            'KeyP': () => this.experience.world.pc.playAnimation(),
            'KeyS': () => this.experience.world.chair.playAnimation(),
            'KeyH': () => this.experience.world.hat.playAnimation(),
            'KeyI': () => {
                if(this.isInfosOpen)
                {
                    cardFull.classList.remove('show');
                    infoBtn.classList.remove('hide'); 
                    this.isInfosOpen = !this.isInfosOpen
                }
                else
                {
                    cardFull.classList.add('show');
                    infoBtn.classList.add('hide'); 
                    this.isInfosOpen = !this.isInfosOpen
                }
            },
            'KeyX': () => {
                cardFull.classList.remove('show');
                infoBtn.classList.remove('hide'); 
                this.isInfosOpen = false
            },
        };

        document.addEventListener('keydown', (event) => {
            if (actions[event.code]) actions[event.code]();
        });

        buttonClose.addEventListener('click', () => {
            cardFull.classList.remove('show');
            infoBtn.classList.remove('hide'); 
            this.isInfosOpen = false
        });

        if(!this.experience.sizes.isMobile){
            buttonVolumeOn.addEventListener('click', () => {
                this.experience.music.music.pause()
                buttonVolumeOn.style.display = 'none'
                buttonVolumeOff.style.display = 'block'
            });

            buttonVolumeOff.addEventListener('click', () => {
                this.experience.music.music.currentTime = 0; 
                this.experience.music.music.play();  
                buttonVolumeOn.style.display = 'block'
                buttonVolumeOff.style.display = 'none'
            });
        }
        else{
            buttonVolumeOnMobile.addEventListener('click', () => {
                this.experience.music.music.pause()
                buttonVolumeOnMobile.style.display = 'none'
                buttonVolumeOffMobile.style.display = 'block'
            });

            buttonVolumeOffMobile.addEventListener('click', () => {
                this.experience.music.music.currentTime = 0; 
                this.experience.music.music.play();  
                buttonVolumeOnMobile.style.display = 'block'
                buttonVolumeOffMobile.style.display = 'none'
            });
        }
        
        if(this.experience.sizes.isMobile){
            document.querySelector('canvas.webgl').addEventListener('click', () => {
                if(this.experience.cursor.isFirstSection)
                {
                    window.location.href = '/profile/en'
                }
                else
                {
                    window.location.href = '/portfolio'
                }
            });
        }
    }
}