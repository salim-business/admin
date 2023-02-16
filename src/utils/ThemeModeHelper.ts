export class ThemeModeHelper {
    loadTheme(isDarkMode: boolean): Promise<void> {
        // const vars = isDarkMode ? darkVars : lightVars
        // return (window as any).less.modifyVars(vars)
        return Promise.resolve()
    }
}

const instance = new ThemeModeHelper()
export default instance
