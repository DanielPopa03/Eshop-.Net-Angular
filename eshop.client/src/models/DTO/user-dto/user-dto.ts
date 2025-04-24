export class UserDto {
  id: number;
  email: string;
  lastName: string;
  firstName: string;
  phoneNumber: string;
  createdAt?: Date;

  //password registration
  password?: string;

  //OAuth2 registration
  oauth2Provider?: string;
  oauth2UserId?: number;

  constructor(data?: Partial<UserDto>) {
    if (data) {
      this.id = data.id ?? 0;
      this.email = data.email ?? '';
      this.lastName = data.lastName ?? '';
      this.firstName = data.firstName ?? '';
      this.phoneNumber = data.phoneNumber ?? '';
      this.createdAt = data.createdAt ? new Date(data.createdAt) : undefined;
      this.password = data.password;
      this.oauth2Provider = data.oauth2Provider;
      this.oauth2UserId = data.oauth2UserId;
    } else {
      this.id = 0;
      this.email = '';
      this.lastName = '';
      this.firstName = '';
      this.phoneNumber = '';
    }
  }
}

