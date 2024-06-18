export function checkPhoneFormat(cedula){
    console.log(cedula.length)
    if (cedula.length == 8) {
        return true;
    }else{
        return false;
    }
}