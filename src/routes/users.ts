import { Request, Response, NextFunction, Router } from 'express';
import { uuid } from '../utils/uuid';
import { usersData, UserDto } from '../assets/users';

const USERS: UserDto[] = usersData;

const usersRouter = Router();

const resolveUserHandler = (req: Request, res: Response, next: NextFunction): void => {
  const userId = req.params.id;
  const userIndex = USERS.findIndex((u) => u.id === userId);

  if (userIndex < 0) {
    res.sendStatus(404);
    return;
  }

  res.locals.userIndex = userIndex;
  res.locals.user = USERS[userIndex];

  next();
};

usersRouter.get('/', (req, res) => {
  res.send(USERS);
});

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
