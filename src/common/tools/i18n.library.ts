import { formatI18nErrors } from 'nestjs-i18n/dist/utils/util'
import { isEmpty } from 'lodash'
import { ValidationError } from 'class-validator'

// we need to loop for every child in case of nested validation
export function I18nLibrary(validationErrors: ValidationError[], i18n): any[] {
  for (const validationError of validationErrors) {
    if (!isEmpty(validationError.constraints)) {
      formatI18nErrors([validationError], i18n.service, {
        lang: i18n.lang,
      })
    } else if (!isEmpty(validationError.children)) {
      I18nLibrary(validationError.children, i18n)
    }
  }
  return validationErrors
}
