import { Request, Response, NextFunction, Router } from 'express';
import { uuid } from '../utils/uuid';
import { usersData, UserDto } from '../assets/users';
import { getUserByIdAsync, getUsers, getUsersAsync } from '../store/user-store';

const USERS: UserDto[] = usersData;

const usersRouter = Router();

type RouteHandler<T = void> = (req?: Request, res?: Response, next?: NextFunction) => T;

function wrapAsyncAndSend(fn: RouteHandler<Promise<any>>): RouteHandler {
  const handler: RouteHandler = (req, res, next) => {
    fn(req, res, next)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .then((result) => res!.send(result))
      .catch(next);
  };

  return handler;
}

const resolveUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  switch (req.method) {
    case 'GET':
      if (req.params.id) {
        try {
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
      break;
    case 'PUT':
      break;
    case 'DELETE':
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

usersRouter.post('/', (req, res) => {
  const user = req.body as UserDto;
  if (!user) {
    res.sendStatus(500);
    return;
  }
  user.id = uuid();
  USERS.push(user);
  res.sendStatus(201);
  console.log('USER created');
});

usersRouter.put('/:id', resolveUserHandler, (req, res) => {
  const user = req.body as UserDto;
  user.id = res.locals.user.id;
  Object.assign(res.locals.user, user);
  res.send(res.locals.user);
  console.log('USER was changed');
});

usersRouter.delete('/:id', resolveUserHandler, (req, res) => {
  USERS.splice(res.locals.userIndex, 1);
  res.sendStatus(204);
  console.log('USER Deleted');
});

export { usersRouter };
