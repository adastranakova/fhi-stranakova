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
    getName(name: any): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getMemberId(): string {
        return this.memberId;
    }

    getEmail(email: any): string {
        return this.email;
    }

    setEmail(email: string): void {
        this.email = email;
    }
}