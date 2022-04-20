//引入express框架
const express = require('express');
//引入jsonwebtoken框架
const jwt = require('jsonwebtoken');
//此文件是用来生随机字符串
const crypto = require('./crypto');
const app = express();
//生成私钥
const jwtKey = crypto(30);

//解析JSON数据
app.use(express.json());

//数据库用户
const database = { username: '火星上的飞猫', password: 'hello'};

//登录生成token
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if(username === database.username && password === database.password){
        jwt.sign(
            { username },
            jwtKey,
            {
                expiresIn: '30s' //过期时间，设置30s
            },
            (err, token) => {
                res.json({ username, message: '登陆成功', token})
            }
        )
    }
})

//登录后访问页面
app.get('/home', (req, res) => {
    console.log(req)
    const headers = req.headers;
    const token = headers['authorization'].split(' ')[1];
    jwt.verify(token, jwtKey, (err, payload) => {
        if(err) res.sendStatus(403);
        res.json({ message: '认证成功', payload})
    })
})


//绑定并侦听端口
app.listen(3000, () => console.log(
    '连接成功',jwtKey
))

