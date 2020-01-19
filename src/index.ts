import {API} from './core/api'

export namespace HorribleScrap {
	export function getShows(){
	    return API.getShows();
    }
    
    export function getShow(name: string){
        return API.getShows()
            .then(shows => {
                return shows.find(show => {
                    console.log(show.title);
                    return show.title == name;
                })
            });
    }
}

HorribleScrap.getShow("TO BE HERO")
    .then(function(result){
        console.log(result);
    });