export class AuthService{
    private readonly STORAGE_KEY = 'server.token'
    private readonly SERVER_USER = 'server.user'
    private readonly ADMIN_KEY = 'server.admin'
    private readonly USER_ID = 'server.userid'

    public userLogged(): boolean{
        return !!this.userToken()
    }

    public userToken(): string {
        return localStorage.getItem(this.STORAGE_KEY) ?? ''
    }

    public adminLogged(){
        return !!localStorage.getItem(this.ADMIN_KEY)
    }

    public saveAdmin(isAdmin: boolean): void {
    if (isAdmin) {
        localStorage.setItem(this.ADMIN_KEY, 'true')
    } else {
        localStorage.removeItem(this.ADMIN_KEY)
    }
    }

    public saveToken(token: string): void{
        localStorage.setItem(this.STORAGE_KEY, token)
    }

    public saveUser(username: string): void{
        localStorage.setItem(this.SERVER_USER, username)
    }

    public removeStoragedData(): void{
        localStorage.removeItem(this.STORAGE_KEY)
        localStorage.removeItem(this.SERVER_USER)
    }

    public getUser(): string {
        return localStorage.getItem(this.SERVER_USER) ?? ""
    }

    public saveUserId(id: number): void {
    localStorage.setItem(this.USER_ID, String(id))
    }

    public getUserId(): number {
    return Number(localStorage.getItem(this.USER_ID))
    }
}
export const authService = new AuthService()