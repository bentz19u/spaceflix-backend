import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'backend-jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.BACKEND_JWT_REFRESH_SECRET,
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim()
    return { ...payload, refreshToken }
  }
}
