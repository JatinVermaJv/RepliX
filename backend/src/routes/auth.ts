import express from 'express';
import passport from 'passport';

const router = express.Router();

const FRONTEND_URL = process.env.NODE_ENV === 'production'
  ? 'https://repli-x.vercel.app'
  : 'http://localhost:3000';

router.get(
  '/google',
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
        return res.redirect(`${FRONTEND_URL}/login?error=no_user`);
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error('Login error:', err);
          return res.redirect(`${FRONTEND_URL}/login?error=login_failed`);
        }
        res.cookie('auth_status', 'success', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined,
          maxAge: 24 * 60 * 60 * 1000 
        });
        return res.redirect(FRONTEND_URL);
      });
    })(req, res, next);
  }
);

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.clearCookie('auth_status', {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
    });
    res.redirect(FRONTEND_URL);
  });
});

router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

export default router; 