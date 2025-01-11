import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class BackendJwtRefreshGuard extends AuthGuard('backend-jwt-refresh') {}
