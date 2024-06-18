// data-decrypt.js
import CryptoJS from "crypto-js";
import { secretKey } from "../constants/keys";

export const dataDecrypt = (value) => {
  try {
    const bytes = CryptoJS.AES.decrypt(value, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.log("Error while trying to decrypt localstorage", error);
  }
};