import { applyDecorators, CanActivate, Controller, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiForbiddenResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { BackendJwtAuthGuard } from '@auth/guards/backend-jwt-auth.guard'

/**
 * Spaceflix Controller
 */
export const SpaceflixController = (options?: { pathPrefix: string; tag: string; guards?: CanActivate[] }) =>
  applyDecorators(
    Controller(options.pathPrefix),
    ApiTags(options.tag),
    ApiBearerAuth('backend-jwt-auth'),
    UseGuards(BackendJwtAuthGuard, ...(options?.guards ?? [])),
    ApiUnauthorizedResponse({ description: 'Returned if the calling user is not authenticated.' }),
    ApiForbiddenResponse({ description: 'Returned if the calling user is not authorized.' }),
  )
