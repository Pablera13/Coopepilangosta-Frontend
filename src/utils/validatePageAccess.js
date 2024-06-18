import swal from "sweetalert";

export function validateAllowedPageAccess(){
    let user = JSON.parse(localStorage.getItem('user'));
    
    if (user) {
        if (user.costumer) {
            window.location = '/forbidden'
        }
    }else{
        window.location = '/'
    }

}

export function validateLogStatus(){
    let user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        window.location = '/login'
    }
}

export function validateLogForLogin(){
    let user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        window.location = '/userProfile'
    }
}