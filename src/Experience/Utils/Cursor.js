import Experience from "../Experience";
import EventEmitter from "./EventEmitter";

export default class Cursor extends EventEmitter
{
    constructor()
    {
        super()

        this.x = 0
        this.y = 0
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.isMouseOutside = false
        this.currentSection = null
        this.isFirstSection = false

        window.addEventListener('mousemove', (event) =>
        {
            this.x = event.clientX / this.sizes.width * 2 - 1
            this.y = - (event.clientY / this.sizes.height) * 2 + 1
            // console.log(this)

            if (this.isMouseOutside) 
            {
                this.isMouseOutside = false;
                // console.log('🟩 La souris est rentrée dans la fenêtre');
            }

            this.trigger('mousemove')
        })
        
        document.addEventListener('mouseout', (event) => {
            if (!event.relatedTarget && !event.toElement) {
                this.isMouseOutside = true;
                this.currentSection = null;
                // console.log('🟥 La souris est sortie de la fenêtre');
                
                this.trigger('mouseout')
            }
        });
    }

    update()
    {
        this.isFirstSection = this.sizes.isMobile ? this.y > 0 : this.x < 0
    }
}