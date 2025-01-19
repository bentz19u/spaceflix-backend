import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { LoggerWrapperService } from '../logger-wrapper.service'
import { cloneDeep, isEmpty } from 'lodash'
import { AsyncLocalStorage } from 'async_hooks'
import shortUUID from 'short-uuid'
import * as requestIp from '@supercharge/request-ip'

@Injectable()
export class IncomingLoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: LoggerWrapperService,
    private readonly als: AsyncLocalStorage<any>,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const ipAddress: string = requestIp.getClientIp(req)
    if (isEmpty(req.headers['x-request-id'])) {
      req.headers['x-request-id'] = shortUUID().generate()
    }
    let message = `REQUEST: ${req.method}, ${req.originalUrl}, ${ipAddress}`

    // I do not want to log user's passwords
    if (req.method == 'POST' || req.method == 'PUT') {
      const body = cloneDeep(req.body)
      if (!isEmpty(body) && !isEmpty(body.password)) {
        delete body.password
      }
      if (!isEmpty(body) && !isEmpty(body.confirmPassword)) {
        delete body.confirmPassword
      }
      message += `, BODY: ${JSON.stringify(body)}`
    }

    const store = {
      'x-request-id': req.headers['x-request-id'],
    }
    this.als.run(store, () => {
      this.logger.info('INCOMING', message)
      next()
    })
  }
}
