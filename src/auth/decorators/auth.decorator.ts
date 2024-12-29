import { UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export const UseAuth = () => UseGuards(AuthGuard('jwt'))