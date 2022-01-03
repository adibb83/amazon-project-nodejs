import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as Jwstartegy, ExtractJwt } from 'passport-jwt';
import store from '../store';
import config, { KnownConfigKey } from '../utils/config';
import { UserToken } from '../assets';

export function initPassport() {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      (userName, password, callback) => {
        const user = store.credetials.find((t) => t.email === userName && t.password === password);

        if (user) {
          const { email, roles } = user;
          const tokenPayLoad: UserToken = { email, roles };
          callback(null, tokenPayLoad, { message: 'Succeeded' });
        } else {
          callback(null, false, { message: 'Faild' });
        }
      },
    ),
  );
}
