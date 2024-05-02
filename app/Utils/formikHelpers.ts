export const filterFormikHelpers =<T extends object>(errors: T ,  touched:{[key:string]: boolean} ,values: T) =>{
    const touchedKeys = Object.entries(touched).map(([key,value])=>{
        return (key) ?? value
      });
    
      const finalErrors: string[] = []
    
      Object.entries(errors).forEach(([key,value])=>{
        if(touchedKeys.includes(key) && values) finalErrors.push(value)
      });
    
      const formErrors: string[] = finalErrors

      return finalErrors;
};