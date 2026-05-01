const express=require('express');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret:'secretkey',
    resave:false,
    saveUninitialized:true
}));
function isLoggedIn(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send("Please login first");
    }
}
app.get('/',(req,res)=>{
    res.send("Welcome rhega ji appka");
});
app.post('/login',(req,res)=>{
    const{username,role}=req.body;
    req.session.user={username,role};
    res.cookie('user',username);
    res.send('Balle Balle Login ho gya hai ji');
});
app.get('/courses', isLoggedIn, (req, res) => {
    res.send("Dekho bhai courses");
});
app.get('/create-course', isLoggedIn, (req, res) => {
    if (req.session.user.role === "instructor") {
        res.send("Course bn gya");
    } else {
        res.status(403).send("Access denied bhag ja yha se");
    }
});
app.get('/profile', isLoggedIn, (req, res) => {
    const user = req.session.user;
    res.send(`Username: ${user.username}, Role: ${user.role}`);
});
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('user');
        res.send("Logged out ho gya hai ji");
    });
});
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});