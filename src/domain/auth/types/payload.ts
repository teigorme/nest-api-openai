import { $Enums } from "@prisma/client";

export type Payload = {
    sub: string;
    role: $Enums.Roles;
}