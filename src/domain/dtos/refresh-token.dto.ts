export class RefreshTokenDto {
    deviceId: string
    refreshToken: string

    constructor(deviceId: string, refreshToken: string) {
        this.deviceId = deviceId
        this.refreshToken = refreshToken
    }
}