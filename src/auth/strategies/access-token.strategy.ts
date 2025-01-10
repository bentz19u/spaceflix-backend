import { Injectable } from '@nestjs/common'
import { ExtractJwt } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'backend-jwt-auth') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.BACKEND_JWT_SECRET,
    })
  }

  async validate(payload: any) {
    return { sub: payload.sub, role: payload.role }
  }
}
