import {API} from './core/api'
import {Show} from "./core/show";
import {episode, VideoResolution} from "./core/episode";
import ora from 'ora';

const spinner = ora();

namespace HorribleScrapInternal {
    export function getShows() {
        spinner.start();
        spinner.text = "Loading shows..."
        return API.getShows()
            .then(function(shows){
                spinner.succeed('Shows loaded!');
                return shows;
            });
    }

    export function getShow(name: string): Promise<Show> {
        spinner.start();
        spinner.text = "Loading show: " + name;
        return HorribleScrapInternal.getShows()
            .then(shows => {
                return shows.find(show => {
                    return show.title.toLowerCase() === name.toLowerCase();
                })
            })
            .then(function (show) {
                if (!show){
                    spinner.fail('No show found with this name: ' + name);
                    throw new Error('No show found with this name: ' + name);
                }

                spinner.succeed('Found show ' + name + '. Loading details');
                spinner.start();
                spinner.text = "";
                return show.loadDetails()
                    .then(function(show){
                        spinner.succeed('Details loaded');
                        return show;
                    })
                    .catch(function(err){
                        spinner.fail(err);
                        console.log(err);
                        throw err;
                    });
            });
    }

    export function getEpisodes(name: string): Promise<episode[]> {
        return HorribleScrapInternal.getShow(name)
            .then(show => {
                spinner.start();
                spinner.text = "Loading episodes";
                return show.loadEpisodes();
            })
            .then(show => {
                spinner.succeed('Episodes loaded.');
                return show.episodes;
            })
            .catch(err => {
                spinner.fail(err);
                throw err;
            });
    }
}

export namespace HorribleScrap{
    export async function getEpisodes(show: string, output: string){
        return HorribleScrapInternal.getEpisodes(show)
            .then(function (episodes) {
                let magnets: string[] = [];
                episodes.forEach(function (episode) {
                    let resolution = episode.formats.getValue(VideoResolution.vr_720p);
                    if(resolution)
                        magnets.push(resolution.magnet);
                })

                return magnets;
            })
            .then(function(magnets){
                console.log('-------------------')
                magnets.forEach(function(magnet) {
                    console.log(magnet)
                })
                console.log('-------------------')
            });
    }
}
