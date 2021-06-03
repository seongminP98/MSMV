const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const passport = require('passport');
const passportConfig = require('./passport');
passportConfig();
const MySQLStore = require('express-mysql-session')(session);
dotenv.config();

const joinRouter = require('./routes/join');
const authRouter = require('./routes/auth');


const options ={
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_DATABASE,
  database: process.env.DB_DATABASE
}
const sessionStore = new MySQLStore(options);

app.set('port',process.env.PORT || 8000);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'none',
  },
  store: sessionStore
}))
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth',authRouter);
app.use('/join',joinRouter);


app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next)=> {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8000, () => {
    console.log('Example app listening on port 8000!');
  });