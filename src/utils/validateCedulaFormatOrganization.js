export function checkCedulaFormat(cedula) {
    const regex = /^\d{1}-\d{3}-\d{6}$/;

    if (regex.test(cedula)) {
        return true;
    } else {
        return false;
    }
}
