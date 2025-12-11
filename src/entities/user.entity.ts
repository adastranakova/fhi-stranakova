export interface UserEntity {
    id: number;
    memberId: string;
    name: string;
    email: string;
    balance: number;         // Decimal(10,2)
    createdAt: Date;
    updatedAt: Date;
}

export interface UserDTO {
    memberId: string;
    name: string;
    email: string;
    balance: number;
    hasActiveRental: boolean;
}

export interface CreateUserInput {
    name: string;
    email: string;
    memberId: string;
}

export interface UpdateUserInput {
    name?: string;
    email?: string;
}