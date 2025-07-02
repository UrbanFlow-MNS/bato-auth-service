export class UserResponseDto {
    email: string
    firstName: string
    lastName: string
    token: string
    refreshToken: string

    constructor(email: string, firstName: string, lastName: string, token: string, refreshToken: string) {
        this.email = email
        this.firstName = firstName
        this.lastName = lastName
        this.token = token
        this.refreshToken = refreshToken
    }
}