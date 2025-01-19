import { Module } from '@nestjs/common'
import { WebHooksService } from './web-hooks.service'

@Module({
  imports: [],
  controllers: [],
  providers: [WebHooksService],
  exports: [WebHooksService],
})
export class WebHooksModule {}
