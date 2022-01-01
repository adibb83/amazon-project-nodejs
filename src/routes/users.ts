import { Request, Response, NextFunction, Router } from 'express';
import { uuid } from '../utils/uuid';
import { UserDto } from '../assets/users';
import { getUserByIdAsync, getUsersAsync, getUserIndexByIdAsync, getUsers } from '../store/user-store';
import { editUserSchma, newUserSchma } from '../validations/common';
import { wrapAsyncAndSend } from '../utils/async-routes';
import { createLogger } from '../utils/logger';
import { idValidator } from '../validations/common';

const logger = createLogger('Users');
const USERS: UserDto[] = getUsers();

const usersRouter = Router();

const resolveUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  switch (req.method) {
    case 'GET':
      if (req.params.id) {
        try {
          const userId = await idValidator.validateAsync(req.params.id);
          const user = await getUserByIdAsync(userId);
          if (!user) {
            res.sendStatus(404);
            return;
          }
          res.locals.user = user;
        } catch (err) {
          next(err);
        }
      } else {
        try {
          const users = await getUsersAsync();
          res.locals.users = users;
        } catch (err) {
          next(err);
        }
      }
      break;
    case 'POST':
      try {
        const postUser = await newUserSchma.validateAsync(req.body);
        postUser.id = uuid();
        res.locals.user = postUser;
        USERS.push(postUser);
      } catch (err) {
        next(err);
      }
      break;
    case 'PUT':
      try {
        const putUser = await editUserSchma.validateAsync(req.body);
        res.locals.user = await getUserByIdAsync(putUser.userId);
        Object.assign(res.locals.user, putUser);
      } catch (err) {
        next(err);
      }
      break;
    case 'DELETE':
      try {
        const userId = await idValidator.validateAsync(req.params.id);
        res.locals.userIndex = getUserIndexByIdAsync(userId);
        USERS.splice(res.locals.userIndex, 1);
      } catch (err) {
        next(err);
      }
      break;
    default:
      break;
  }
  next();
};

usersRouter.get(
  '/',
  wrapAsyncAndSend(() => getUsersAsync()),
);

usersRouter.get('/:id', resolveUserHandler, (req, res) => {
  logger.info(`USER ${res.locals.user.id} was Requested`);
  res.send(res.locals.user);
});

usersRouter.get('/*', (req, res) => {
  logger.info('Users Api');
});

usersRouter.post('/', resolveUserHandler, (req, res) => {
  logger.info('User created');
  res.sendStatus(201);
});

usersRouter.put('/:id', resolveUserHandler, (req, res) => {
  logger.info(`USER ${res.locals.user.id} was changed`);
  res.status(200).send(res.locals.user);
});

usersRouter.delete('/:id', resolveUserHandler, (req, res) => {
  logger.info(`USER ${res.locals.user.id} was deleted`);
  res.sendStatus(204);
});

export { usersRouter };
