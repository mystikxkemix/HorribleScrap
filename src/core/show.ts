import {API} from './api';
import {episode} from "./episode";

export class Show {
    public title: string;
    private id: number = -1;
    public episodes: Array<episode>;
    
    constructor(title: string, private route: string){
        this.title = title;
        this.episodes = new Array<episode>();
    }
    
    get getTitle() {
        return this.title;
    }

    loadDetails() : Promise<Show> {
        return API.getShowId(this.route)
            .then(id => {
                this.id = id;
                return this;
            })
    }
    
    loadEpisodes(): Promise<Show> {
        let self = this;
        return API.getEpisodes(this.id)
            .then(function(result){
                
                return self;
            })
    }

}
