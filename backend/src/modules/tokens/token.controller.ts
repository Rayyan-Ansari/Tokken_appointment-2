import { Response } from 'express';
import { AuthRequest } from '@/lib/auth';
import { tokenService } from './token.service';
import {
  validateRequest,
  bookTokenSchema,
  myTokensSchema
} from '@/lib/validators';

class TokenController {
  // Book a new token
  async bookToken(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const data = validateRequest(bookTokenSchema)(req.body);
      const result = await tokenService.bookToken(req.user.userId, data);

      res.status(201).json({
        success: true,
        message: 'Token booked successfully',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to book token'
      });
    }
  }

  // Get patient's tokens
  async getMyTokens(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const query = validateRequest(myTokensSchema)(req.query);
      const result = await tokenService.getMyTokens(
        req.user.userId,
        query.doctorId,
        query.status
      );

      res.json({
        success: true,
        message: 'Tokens retrieved successfully',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get tokens'
      });
    }
  }

  // Get tokens for a session (for doctors)
  async getSessionTokens(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const { sessionId } = req.params;
      const result = await tokenService.getSessionTokens(sessionId);

      res.json({
        success: true,
        message: 'Session tokens retrieved successfully',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get session tokens'
      });
    }
  }
}

export const tokenController = new TokenController();