export class UserSignInCredentials {
    email: string
    password: string
    deviceId: string

    constructor(email: string, password: string, deviceId: string) {
        this.email = email
        this.password = password
        this.deviceId = deviceId
    }
}