import * as bcrypt from 'bcrypt';

export async function toHashPassword(password: string): Promise<string> {
    const saltOrRounds = Math.random();
    return await bcrypt.hash(password, saltOrRounds);
}


export async function toVerifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
}
