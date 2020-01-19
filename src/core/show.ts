export class Show {
    public title: string;
    constructor(title: string, private route: string){
        this.title = title;
    }

    get getTitle() {
        return this.title;
    }
}
