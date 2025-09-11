import bcrypt from 'bcryptjs';


export const hashPassword = async (plain: string) => {
const saltRounds = 10;
const salt = await bcrypt.genSalt(saltRounds);
return bcrypt.hash(plain, salt);
};


export const verifyPassword = async (plain: string, hashed: string) => {
return bcrypt.compare(plain, hashed);
};