/**
 * Each error must have two properties.
 * - code: Unique name of the error. It should have its component name and four numeric number.
 * - description: Brief information of the error code.
 */
export const ErrorCodes = {
  /**
   * It may have error, but partially
   */
  PARTIALLY_ERROR: {
    code: 'common-0001',
    description: 'Requesting API was handled successfully, but maybe something goes wrong',
  },

  /**
   * You couldn't specify something, then use this
   */
  GENERAL_ERROR: {
    code: 'common-0002',
    description: 'Processed abnormally',
  },

  /**
   * Client error responses 400 - 499
   *
   * e.g) 403 -> client-0002
   */
  BAD_REQUEST_ERROR: {
    code: 'client-0000',
    description: `This request has issued a malformed or illegal request`,
  },

  UNAUTHORIZED_ERROR: {
    code: 'client-0001',
    description: `Bad Authentication data`,
  },

  FORBIDDEN_ERROR: {
    code: 'client-0002',
    description: `You don't have permission to access on this server`,
  },

  NOT_FOUND_ERROR: {
    code: 'client-0003',
    description: `Sorry, this resource is not available`,
  },

  /**
   * Login error codes
   */
  LOGIN: {
    USER_MUST_WAIT: {
      code: 'user-login-0001',
      description: 'user must wait for a while, and then try again',
    },
    HAS_TOO_MANY_ATTEMPT: {
      code: 'user-login-0002',
      description: 'user is attempting too many logins',
    },
    MISSING_REMOTE_ADDR: {
      code: 'user-login-0003',
      description: 'internal server error, please escalate this to land-fx development team',
    },
    WRONG_CREDENTIALS: {
      code: 'user-login-0004',
      description: 'wrong credentials. please check id or password',
    },
    CREDENTIALS_NOT_PROVIDED: {
      code: 'user-login-0005',
      description: 'provide mt4AccountNo or email address',
    },
    NO_ACCOUNTS_FOUND: {
      code: 'user-login-0006',
      description: 'Account(s) not found for the required service.',
    },
    USER_MUST_USE_EMAIL: {
      code: 'user-login-0007',
      description: 'user must login using their email.',
    },
  },
}
