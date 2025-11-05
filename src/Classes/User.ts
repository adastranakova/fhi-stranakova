// pouzivatel - mame jeho meno, mail a id
export class User {
    private name: string;
    private email: string;
    private memberId: string;

    constructor(name: string, email: string, id: string) {
        this.name = name;
        this.email = email;
        this.memberId = id;
    }

    //funkcie
    getName(): string {
        return this.name;
    }

    getMemberId(): string {
        return this.memberId;
    }

    getEmail(): string {
        return this.email;
    }
}