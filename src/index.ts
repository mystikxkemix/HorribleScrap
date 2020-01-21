import {API} from './core/api'
import {Show} from "./core/show";
import {episode} from "./core/episode";

export namespace HorribleScrap {
	export function getShows(){
	    return API.getShows();
    }
    
    export function getShow(name: string): Promise<Show> {
        return API.getShows()
            .then(shows => {
                return shows.find(show => {
                    return show.title == name;
                })
            })
            .then(function(show){
                if(!show) throw new Error('No show found with this name: ' + name);
                return show.loadDetails();
            });
    }
    
    export function getEpisodes(name: string): Promise<episode[]> {
	    return HorribleScrap.getShow(name)
            .then(show => {
                return show.loadEpisodes();
            })
            .then(show => {
                
                return show.episodes;
            });
    }
    
}

HorribleScrap.getEpisodes("Black Clover")
    .then(function(result){
        console.log(result);
    })
    .catch();