export default class Logger {
    static log(s: string) {
        console.log(s)
    }

    static error(s: any) {
        console.error(s)
    }

    static dev(s: string) {
        if (process.env.REACT_APP_IS_DEBUG) {
            
        }
    }
}
