import EventEmitter from './EventEmitter.js'

export default class Sizes extends EventEmitter
{
    constructor()
    {
        super()

        // Setup
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)
        this.valueVertical = 1024
        this.isMobile = (this.width <= this.valueVertical && this.width < this.height)

        // Resize event
        window.addEventListener('resize', () =>
        {
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)
            this.isMobile = (this.width <= this.valueVertical && this.width < this.height)
          
            this.trigger('resize')

            // this.isTablet = (
            //     !this.isMobile &&
            //     this.width < this.height &&
            //     this.width < 1024            // borne supérieure tablette (optionnelle)
            // );
            // if(this.isMobile){
            //     console.log("mobile");
            // }
            // else if (this.isTablet){
            //     console.log("tablette");
            // }
            // else{
            //     console.log("ordi"); 
            // }
            
        })
    }
}