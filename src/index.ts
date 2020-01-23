import {API} from './core/api'
import {Show} from "./core/show";
import {episode, VideoResolution} from "./core/episode";

export namespace HorribleScrap {
    export function getShows() {
        return API.getShows();
    }

    export function getShow(name: string): Promise<Show> {
        return API.getShows()
            .then(shows => {
                return shows.find(show => {
                    return show.title.toLowerCase() == name.toLowerCase();
                })
            })
            .then(function (show) {
                if (!show) throw new Error('No show found with this name: ' + name);
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

HorribleScrap.getEpisodes("Goblin Slayer")
    .then(function (episodes) {
        episodes.forEach(function (episode) {
            console.log(episode.formats.getValue(VideoResolution.vr_720p)?.magnet);
        })
    })
    .catch();