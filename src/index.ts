import { app } from './app';

app.set('port', process.env.PORT || 8000);

app.listen(app.get('port'), () => {
  console.log('app runing at http//localhost:%d in %s mode', app.get('port'), app.get('env'));
});
