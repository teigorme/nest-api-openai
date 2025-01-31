import { $Enums } from "@prisma/client";

export type User = {
    fullName: string;
    phoneNumber: string;
    email: string;
    id: string;
    role: $Enums.Roles;
    createdAt: Date;
    updatedAt: Date;
}