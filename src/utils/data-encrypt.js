import CryptoJS from "crypto-js";
import { secretKey } from "../constants/keys";

export const dataEncrpt = (value) => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(value), secretKey).toString();
  } catch (error) {
    console.log("Error while tryng to encrypt local storage data", error);
  }
};