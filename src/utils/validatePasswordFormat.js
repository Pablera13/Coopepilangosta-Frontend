export function checkPasswordFormat(password){
    console.log(password.length)
    if (password.length >= 8) {
        return true;
    }else{
        return false;
    }
}