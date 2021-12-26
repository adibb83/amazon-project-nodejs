import { Request, Response, NextFunction, Router } from 'express';
import { uuid } from '../utils/uuid';
import { UserDto } from '../assets/users';
import { getUserByIdAsync, getUsersAsync, getUserIndexByIdAsync, getUsers } from '../store/user-store';
import { checkValidId, checkValidName } from '../validations/common';
import { wrapAsyncAndSend } from '../utils/async-routes';

const USERS: UserDto[] = getUsers();

const usersRouter = Router();

const resolveUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  switch (req.method) {
    case 'GET':
      if (req.params.id) {
        try {
          if (!checkValidId(req.params.id)) {
            res.sendStatus(400);
            return;
          }
          const user = await getUserByIdAsync(req.params.id);
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
        const postUser = req.body as UserDto;
        if (!postUser || !checkValidName(postUser.name, 3)) {
          res.sendStatus(400);
          return;
        }
        postUser.id = uuid();
        USERS.push(postUser);
      } catch (err) {
        next(err);
      }
      break;
    case 'PUT':
      try {
        if (!checkValidId(req.params.id)) {
          res.sendStatus(400);
          return;
        }
        const putUser = req.body as UserDto;
        if (!putUser || !checkValidName(putUser.name, 3)) {
          res.sendStatus(409);
          return;
        }
        putUser.id = req.params.id;
        res.locals.user = await getUserByIdAsync(req.params.id);
        Object.assign(res.locals.user, putUser);
      } catch (err) {
        next(err);
      }
      break;
    case 'DELETE':
      try {
        if (!checkValidId(req.params.id)) {
          res.sendStatus(500);
          return;
        }
        res.locals.userIndex = getUserIndexByIdAsync(req.params.id);
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
  res.send(res.locals.user);
});

usersRouter.get('/*', (req, res) => {
  console.log('USER was REQUESTED: ' + res.locals.id);
});

usersRouter.post('/', resolveUserHandler, (req, res) => {
  res.sendStatus(201);
  console.log('USER created');
});

usersRouter.put('/:id', resolveUserHandler, (req, res) => {
  res.status(200).send(res.locals.user);
  console.log('USER was changed');
});

usersRouter.delete('/:id', resolveUserHandler, (req, res) => {
  res.sendStatus(204);
  console.log('USER Deleted');
});

export { usersRouter };
