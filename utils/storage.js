export function getItem(key) {
  let value = localStorage.getItem(key);
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}
export function setItem(key, value) {
  return localStorage.setItem(key, JSON.stringify(value));
}
export function removeItem(key) {
  return localStorage.removeItem(key);
}
