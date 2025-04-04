import express from 'express';
import passport from 'passport';
import { Session } from 'express-session';

interface CustomSession extends Session {
  returnTo?: string;
}

const router = express.Router();

const FRONTEND_URL = process.env.NODE_ENV === 'production'
  ? 'https://repli-x.vercel.app'
  : 'http://localhost:3000';

router.get(
  '/google',
  (req, res, next) => {
    // Store the intended return URL in session
    (req.session as CustomSession).returnTo = req.get('Referer') || FRONTEND_URL;
    next();
  },
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube.force-ssl'
    ]
  })
);

router.get(
  '/google/callback',
  (req, res, next) => {
    passport.authenticate('google', (err: Error, user: any, info: any) => {
      if (err) {
        console.error('Authentication error:', err);
        return res.redirect(`${FRONTEND_URL}/login?error=authentication_failed`);
      }
      if (!user) {
        console.error('No user found');
        return res.redirect(`${FRONTEND_URL}/login?error=no_user`);
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error('Login error:', err);
          return res.redirect(`${FRONTEND_URL}/login?error=login_failed`);
        }

        // Set session cookie
        req.session.cookie.secure = process.env.NODE_ENV === 'production';
        req.session.cookie.sameSite = process.env.NODE_ENV === 'production' ? 'none' : 'lax';
        
        // Save session before redirect
        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err);
            return res.redirect(`${FRONTEND_URL}/login?error=session_error`);
          }
          return res.redirect(FRONTEND_URL);
        });
      });
    })(req, res, next);
  }
);

router.get('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
      }
      res.redirect(FRONTEND_URL);
    });
  });
});

router.get('/me', (req, res) => {
  console.log('Session ID:', req.sessionID);
  console.log('Is Authenticated:', req.isAuthenticated());
  console.log('User:', req.user);
  
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

export default router; 