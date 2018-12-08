//VALIDATION
export const validate = (element)=>{
    let error = [true, '']

    if(element.validation.email){
        const valid = /\S+@\S+\.\S+/.test(element.value);
        const message = !valid? 'введите почту' : ''
        error =!valid ? [valid, message] : error; 
    }

    if(element.validation.required) {
        const valid = element.value.trim() !== ''
        const message = !valid ? 'это обязательное поле' : '';
        error = !valid ? [valid, message] : error; 
    }

    return error
}

//ID MATCH UP VALIDATION 
export const idValidation = (list, data)=>{
    let valid = true
    for(let i = 0; i < list.length; i++){
        if(data.id == list[i].id){
          valid = false
        }
        }
        return valid
}

//HEADERS
const token = localStorage.getItem('token');
const email = 'unknown@unknown'
export const headers = {headers:{'X-USER-TOKEN': token, 'X-USER-EMAIL': email}}
    

