import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IncomingWebhook, IncomingWebhookSendArguments } from '@slack/webhook'

@Injectable()
export class WebHooksService {
  private readonly logger = new Logger(WebHooksService.name)
  private readonly incomingWebhook: IncomingWebhook

  constructor(private readonly configService: ConfigService) {
    this.incomingWebhook = new IncomingWebhook(this.configService.get('SLACK_BACKEND_HOOKS_URL'))
  }

  send(args: IncomingWebhookSendArguments) {
    if (this.configService.get('NODE_ENV') != 'TEST' && this.configService.get('NODE_ENV') != 'LOCAL') {
      if (this.configService.get('SLACK_BACKEND_HOOKS_URL')) {
        try {
          ;(async () => {
            await this.incomingWebhook.send(args)
          })()
        } catch (e) {
          this.logger.error(`WebHooksService#send.catch ${JSON.stringify(e)}`)
        }
      }
    }
  }
}
