export function checkCedulaFormat(cedula){
    console.log(cedula.length)
    if (cedula.length == 9) {
        return true;
    }else{
        return false;
    }
}