import swal from "sweetalert";

export function validateAllowedPageAccess(){
    let user = JSON.parse(localStorage.getItem('user'));
    
    if (user) {
        if (user.costumer) {
            
            swal('No iniciaste sesion.','Inicia sesion para ver este recurso','error').then(function(){window.location = '/'})

        }
    }else{
        swal('No iniciaste sesion.','Inicia sesion para ver este recurso','error',{timer:1000}).then(function(){window.location = '/'})
        
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