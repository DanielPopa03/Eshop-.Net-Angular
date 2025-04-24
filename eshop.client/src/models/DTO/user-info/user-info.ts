export class UserInfo {
  id: number;        
  email: string;     
  role: string;       
  first_name: string; 
  last_name: string;
  exp: number;
  constructor(
    sub: number,
    email: string,
    role: string,
    first_name: string,
    last_name: string,
    exp: number
  ) {
    this.id = sub;
    this.email = email;
    this.role = role;
    this.first_name = first_name;
    this.last_name = last_name;
    this.exp = exp;
  }

  static fromJwtPayload(payload: any): UserInfo {
    return new UserInfo(
      Number(payload.sub),
      payload.email || '',
      payload.role || '',
      payload.first_name || '',
      payload.last_name || '',
      Number(payload.exp)
    );
  }
}
