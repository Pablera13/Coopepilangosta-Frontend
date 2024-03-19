import swal from "sweetalert";

export function validateAllowedPageAccess(){
    let user = JSON.parse(localStorage.getItem('user'));
    
    if (user) {
        if (user.costumer) {
            swal('No autorizado.','No tienes permiso para ver este recurso.','error')
        }
    }else{
        swal('No iniciaste sesion.','Inicia sesion para ver este recurso','error').then(function(){window.location = '/'})
        
    }
}