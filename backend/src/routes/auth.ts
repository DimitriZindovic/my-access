import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { supabase, supabaseAdmin } from '../config/supabase.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

/**
 * POST /api/auth/signup
 * Create a new user account
 */
router.post(
  '/signup',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').optional().trim(),
    body('lastName').optional().trim(),
    body('phone').optional().trim(),
    body('handicapType').optional().trim(),
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ 
          error: 'Validation error',
          errors: errors.array() 
        });
        return;
      }

      const { email, password, firstName, lastName, phone, handicapType } = req.body;

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            handicap_type: handicapType,
          },
        },
      });

      if (authError) {
        res.status(400).json({ 
          error: 'Signup failed',
          message: authError.message 
        });
        return;
      }

      if (!authData.user) {
        res.status(400).json({ 
          error: 'Signup failed',
          message: 'User creation failed' 
        });
        return;
      }

      // Create user profile in database using Prisma
      try {
        await prisma.user.create({
          data: {
            id: authData.user.id,
            email: email,
            firstName: firstName || null,
            lastName: lastName || null,
            phone: phone || null,
            handicapType: handicapType || null,
          },
        });
      } catch (dbError: any) {
        console.error('Profile creation error:', dbError);
        // If profile creation fails, we should ideally rollback the auth user
        // For now, we'll just log the error
        if (dbError.code !== 'P2002') { // P2002 is unique constraint violation
          throw dbError;
        }
      }

      // Return user data
      const user = {
        id: authData.user.id,
        email: authData.user.email,
        firstName: firstName || null,
        lastName: lastName || null,
        phone: phone || null,
        handicapType: handicapType || null,
        createdAt: new Date().toISOString(),
      };

      res.status(201).json({
        message: 'User created successfully',
        user,
        session: authData.session,
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to create user' 
      });
    }
  }
);

/**
 * POST /api/auth/login
 * Authenticate user and return session
 */
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ 
          error: 'Validation error',
          errors: errors.array() 
        });
        return;
      }

      const { email, password } = req.body;

      // Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !authData.user) {
        res.status(401).json({ 
          error: 'Authentication failed',
          message: 'Invalid email or password' 
        });
        return;
      }

      // Get user profile from database using Prisma
      const profile = await prisma.user.findUnique({
        where: { id: authData.user.id },
      });

      // Build user object
      const user = {
        id: authData.user.id,
        email: authData.user.email,
        firstName: profile?.firstName || authData.user.user_metadata?.first_name || null,
        lastName: profile?.lastName || authData.user.user_metadata?.last_name || null,
        phone: profile?.phone || authData.user.user_metadata?.phone || null,
        handicapType: profile?.handicapType || authData.user.user_metadata?.handicap_type || null,
        createdAt: profile?.createdAt.toISOString() || authData.user.created_at,
      };

      res.json({
        message: 'Login successful',
        user,
        session: authData.session,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to authenticate user' 
      });
    }
  }
);

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    // Get user profile from database using Prisma
    const profile = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!profile) {
      res.status(404).json({ 
        error: 'Not found',
        message: 'User profile not found' 
      });
      return;
    }

    // Build user object
    const user = {
      id: profile.id,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      handicapType: profile.handicapType,
      createdAt: profile.createdAt.toISOString(),
    };

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to get user data' 
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout current user
 */
router.post('/logout', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.substring(7);
    
    if (token) {
      // Sign out the session
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
    }

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to logout' 
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      res.status(400).json({ 
        error: 'Bad request',
        message: 'Refresh token is required' 
      });
      return;
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (error || !data.session) {
      res.status(401).json({ 
        error: 'Invalid refresh token',
        message: 'Failed to refresh session' 
      });
      return;
    }

    res.json({
      message: 'Token refreshed successfully',
      session: data.session,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to refresh token' 
    });
  }
});

export default router;
