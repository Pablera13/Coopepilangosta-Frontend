import { dataDecrypt } from "./data-decrypt";


export const getUserLocalStorage = () => {
    let UserItem = dataDecrypt(localStorage.getItem('user'))
    if (UserItem) {
        let userParsed = JSON.parse(UserItem);
        return userParsed
    } else {
        return null;
    }
} 