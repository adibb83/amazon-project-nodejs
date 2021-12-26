export function checkValidId(id: string): boolean {
  if (!!!id || id.length !== 36) {
    return false;
  }
  return true;
}

export function checkValidName(name: string, length: number): boolean {
  if (!!!name || name.length < length) {
    return false;
  }
  return true;
}
