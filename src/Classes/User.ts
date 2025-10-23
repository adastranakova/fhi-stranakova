// pouzivatel - mame jeho meno, mail a id
export class User {
    private name: string;
    private email: string;
    private id: string;

    constructor(name: string, email: string, id: string) {
        this.name = name;
        this.email = email;
        this.id = id;
    }

    //funkcie
    getName(): string {
        return this.name;
    }
}