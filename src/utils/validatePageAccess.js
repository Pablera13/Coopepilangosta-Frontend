import swal from "sweetalert";
import { getUserLocalStorage } from "./getLocalStorageUser";

export function validateAllowedPageAccess(){
    let user = getUserLocalStorage()
    
    if (user) {
        if (user.costumer) {
            window.location = '/forbidden'
        }
    }else{
        window.location = '/'
    }

}

export function validateLogStatus(){
    let user = getUserLocalStorage()

    if (!user) {
        window.location = '/login'
    }
}

export function validateLogForLogin(){
    let user = getUserLocalStorage()

    if (user) {
        window.location = '/userProfile'
    }
}