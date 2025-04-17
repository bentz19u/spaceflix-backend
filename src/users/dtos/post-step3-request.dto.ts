import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { PostStep1RequestDto } from './post-step1-request.dto'
import { UserPlanEnum } from '../../common/enums/plan.enum'

export class PostStep3RequestDto extends PostStep1RequestDto {
  @ApiProperty({ example: UserPlanEnum.STANDARD })
  @IsNotEmpty()
  @IsEnum(UserPlanEnum)
  stat: string
}
