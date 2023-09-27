import * as bcrypt from 'bcrypt';

export const hashData = async (data: string): Promise<string> => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(data, salt);
};

export const verifyHash = async (
  hash: string,
  plain: string,
): Promise<boolean> => {
  return await bcrypt.compare(plain, hash);
};
