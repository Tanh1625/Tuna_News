import {jwtDecode} from 'jwt-decode';

export default function getUserFromToken(token) {
  if (!token) return null;
  try {
    const user = jwtDecode(token);
    console.log("User:----->", user);
    return user;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

export const isTokenExpired = (token) => { 
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // in seconds
    console.log("exp: ", decoded.exp)
    console.log("currentTime: ", currentTime)
    console.log("return: ", decoded.exp < currentTime)
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return true;
  }
}