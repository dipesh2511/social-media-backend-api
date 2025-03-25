export const tc = async(Promise,errorExt = {}) =>{
    try {
        const data = await Promise;
        return  [null,data];
    } catch (error) {
        Object.assign(error,errorExt);
        return [error,null];
    }
}