export class AuthService{
    private readonly STORAGE_KEY = 'server.token'
    private readonly SERVER_USER = 'server.user'
    private readonly ADMIN_KEY = 'server.admin'

    public userLogged(): boolean{
        return !!this.userToken()
    }

    public userToken(): string {
        return localStorage.getItem(this.STORAGE_KEY) ?? ''
    }

    public adminLogged(){
        return localStorage.getItem(this.ADMIN_KEY) ?? ''
    }

    public saveToken(token: string): void{
        localStorage.setItem(this.STORAGE_KEY, token)
    }

    public saveUser(userEmail: string): void{
        localStorage.setItem(this.SERVER_USER, JSON.stringify(userEmail))
    }

    public removeStoragedData(): void{
        localStorage.removeItem(this.STORAGE_KEY)
        localStorage.removeItem(this.SERVER_USER)
    }

    public getUser(): string {
        return localStorage.getItem(this.SERVER_USER) ?? ""
    }
}
export const authService = new AuthService()