export const allowedKeys = 
[
"Backspace", 
"ArrowLeft", 
"ArrowRight", 
"Home", 
"End", 
"Tab", 
"Shift", 
"Control", 
"Alt", 
"Delete", 
"Enter", 
"Escape",
" "
];

export function LettersOnly(e) {
    if (!allowedKeys.includes(e.key)) {
        if (!/^[a-zA-ZÑñ]*$/.test(e.key)) {
            e.preventDefault();
        }}}

export function NumbersOnly(e) {
    if (!allowedKeys.includes(e.key)) {
        if (!/^\d$/.test(e.key)) {
            e.preventDefault();
        }}}
