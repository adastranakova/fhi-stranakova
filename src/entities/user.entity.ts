export interface UserEntity {
    id: number;
    memberId: string;
    name: string;
    email: string;
    balance: number;         // Decimal(10,2)
}
