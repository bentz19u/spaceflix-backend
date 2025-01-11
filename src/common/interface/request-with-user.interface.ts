import { Request } from 'express'

// add User to Request
interface RequestWithUser extends Request {
  user: any
}
export default RequestWithUser
