import express from 'express';
import passport from 'passport';

const router = express.Router();

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
        return res.redirect('http://localhost:3000/login?error=authentication_failed');
      }
      if (!user) {
        return res.redirect('http://localhost:3000/login?error=no_user');
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error('Login error:', err);
          return res.redirect('http://localhost:3000/login?error=login_failed');
        }
        res.cookie('auth_status', 'success', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000 
        });
        return res.redirect('http://localhost:3000');
      });
    })(req, res, next);
  }
);

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.clearCookie('auth_status');
    res.redirect('http://localhost:3000');
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