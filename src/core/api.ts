import request from 'request';
import {Show} from "./show";

const base_url =  "https://horriblesubs.info";

export namespace API {
    export function getShows(): Promise<Show[]> {
        return new Promise<Show[]>(function(resolve, reject){
            request(base_url + '/shows/', function (error, response, body) {
                if(error) return reject(error);
                
                let rawShows = body.toString().split('\n').filter(Tool.matchShow);
                let shows = rawShows.map(Tool.convertToEpisode)
                    .filter(function (e: undefined | Show) {
                        return e != null;
                    });
                
                console.log(shows);
                return resolve(shows);
            })
        });
    }
    
}

namespace Tool {

    export function matchShow(line: string): boolean{
        return line.indexOf("<div class=\"ind-show\"><a") >= 0;
    }
    
    export function convertToEpisode(line: string) : undefined | Show {
        let title = getTitle(line);
        let route = getRoute(line);
        if(!title || !route) return;
        return new Show(title, route);
    }
    
    function getTitle(line: string): undefined | string {
        let match = line.match(/title="(.*)">/);
        
        if(!match) return;
        
        return match[1];
    }

    function getRoute(line: string): undefined | string {
        let match = line.match(/href="(.*)" /);

        if(!match) return;

        return match[1];
    }
}