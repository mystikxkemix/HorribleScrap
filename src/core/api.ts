import request from 'request';
import BeautifulDom from 'beautiful-dom';
import {Show} from "./show";
import HTMLElementData from "beautiful-dom/dist/htmlelement";
import {episode} from "./episode";

const base_url = "https://horriblesubs.info";

export namespace API {
    import matchEpisode = Tool.matchEpisode;

    export function getShows(): Promise<Show[]> {
        return new Promise<Show[]>(
            function (resolve, reject) {
                request(base_url + '/shows/', function (error, response, body) {
                    if (error) return reject(error);

                    let rawShows = body.toString().split('\n').filter(Tool.matchShow);
                    let shows = rawShows.map(Tool.convertToEpisode)
                        .filter(function (e: undefined | Show) {
                            return e != null;
                        });

                    return resolve(shows);
                })
            });
    }

    export function getShowId(route: string): Promise<number> {
        return new Promise<number>(function (resolve, reject) {
            request(base_url + route, function (error, response, body) {
                if (error) return reject(error);
                let idString = Tool.getShowId(body);
                if (!idString) return reject('No id found on the page.');
                let id = Number(idString);
                if (isNaN(id)) return reject('Cannot convert number: ' + idString);
                return resolve(id);
            });
        });
    }

    export function getEpisodes(id: number): Promise<episode[]> {
        return InternalAPI.GetAllEpisodes(id);
    }
}

namespace Tool {

    export function matchShow(line: string): boolean {
        return line.indexOf("<div class=\"ind-show\"><a") >= 0;
    }

    export function matchEpisode(line: string): boolean {
        return line.indexOf("") >= 0;
    }

    export function getShowId(content: string): undefined | string {
        let match = content.match(/var hs_showid = (.*);/);
        if (!match) return;
        return match[1];
    }

    export function convertToEpisode(line: string): undefined | Show {
        let title = getTitle(line);
        let route = getRoute(line);
        if (!title || !route) return;
        return new Show(title, route);
    }

    function getTitle(line: string): undefined | string {
        let match = line.match(/title="(.*)">/);

        if (!match) return;

        return match[1];
    }

    function getRoute(line: string): undefined | string {
        let match = line.match(/href="(.*)" /);

        if (!match) return;

        return match[1];
    }
}

namespace InternalAPI {
    export function GetAllEpisodes(id: number, nextId: number = 0, allElements: HTMLElementData[] = []): Promise<episode[]> {
        return new Promise<episode[]>(function (resolve, reject) {
            let url = base_url + '/api.php?method=getshows&type=show&showid=' + id + "&nextid=" + nextId;
            request(url,
                function (error, response, body) {
                    let root = new BeautifulDom(body);
                    allElements = allElements.concat(root.getElementsByClassName('rls-info-container'));

                    allElements.sort(function (a, b) {
                        if (Number(a.getAttribute('id')) > Number(b.getAttribute('id')))
                            return -1;

                        if (Number(a.getAttribute('id')) < Number(b.getAttribute('id')))
                            return 1;

                        return 0;
                    });

                    if (Number(allElements[allElements.length - 1].getAttribute('id')) > 1)
                        return resolve(InternalAPI.GetAllEpisodes(id, nextId + 1, allElements));

                    // array.forEach(function(e){
                    //     console.log(e.getElementsByClassName('link-720p')[0]
                    //         .getElementsByClassName('hs-magnet-link')[0]
                    //         .getElementsByTagName('a')[0]
                    //         .getAttribute('href'));
                    // });

                    resolve(allElements.map(function (html) {
                        return new episode(html);
                    }));

                }
            );

        });
    }
}