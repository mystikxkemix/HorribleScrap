import HTMLElementData from "beautiful-dom/dist/htmlelement";
import * as Collections from 'typescript-collections';

export class episode {
    private readonly _id: number = -1;
    private _formats: Collections.Dictionary<VideoResolution, DownloadLinks> = new Collections.Dictionary<VideoResolution, DownloadLinks>();
    
    constructor(raw: HTMLElementData) {
       this._id = Tool.getId(raw);
       
       this.addToFormats(VideoResolution.vr_480p, raw);
       this.addToFormats(VideoResolution.vr_720p, raw);
       this.addToFormats(VideoResolution.vr_1080p, raw);
    }
    
    get id(): number{
        return this._id;
    }

    get formats(): Collections.Dictionary<VideoResolution, DownloadLinks>{
        return this._formats;
    }
    
    addToFormats (videoResolution: VideoResolution, raw: HTMLElementData){
        this._formats.setValue(videoResolution,
            Tool.getDownloadLinks(videoResolution, raw));
    }
}

type DownloadLinks = {
    magnet:  string;
    torrent: string;
    
}

export enum VideoResolution {
    vr_480p   =   "link-480p",
    vr_720p   =   "link-720p",
    vr_1080p  =   "link-1080p"
}


namespace Tool {
    export function getId(raw: HTMLElementData) : number{
        return Number(raw.getAttribute('id'));
    }
    
    export function getDownloadLinks(vr: VideoResolution, raw: HTMLElementData): DownloadLinks {
        let resolutionElement = raw.getElementsByClassName(vr.toString())[0];
        
        return {
            magnet : getMagnetLink(resolutionElement),
            torrent : getTorrentLink(resolutionElement)
        };
    }
    
    function getMagnetLink(resolutionElement: HTMLElementData): string {
        return extractURL(resolutionElement, 'hs-magnet-link');
    }
    
    function getTorrentLink(resolutionElement: HTMLElementData): string {
        return extractURL(resolutionElement, 'hs-torrent-link');
    }
    
    function extractURL(element: HTMLElementData, key: string): string {
        if(!element || !key) return "";
        
        let subElement = element.getElementsByClassName(key)[0];
        if(!subElement) return "";
        
        let link = subElement.getElementsByTagName('a')[0];
        if(!link) return "";
        
        return link.getAttribute('href') || "";
    }
}