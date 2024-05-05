import encodedKey from '../key.json';

export function decrypt(
  password: string,
  keyArr: Uint8Array = encodedKey as unknown as Uint8Array,
) {
  if (!password.length) return '';

  const paddedPassword = padPassword(password, keyArr.length);
  const passwordArr = new TextEncoder().encode(paddedPassword);

  return new TextDecoder().decode(
    new Uint8Array(keyArr.map((byte, idx) => byte - passwordArr[idx])),
  );
}

export function padPassword(password: string, len: number) {
  if (len > password.length) {
    while (password.length < len) {
      password += password;
    }
  }
  return password.slice(0, len);
}
