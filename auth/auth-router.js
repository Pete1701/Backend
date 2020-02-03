const router = require('express').Router()
const Users = require('./users-model')
const bc = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register', (req, res) => {
    let user = req.body;
  
    const hash = bc.hashSync(req.body.password, 3);
    user.password = hash;
  
    Users.add(user)
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(error => {
            res.status(500).json(error);
        });
  });

  router.post('/login', (req, res) => {
    let { username, password } = req.body;
  
      Users.findBy({ username })
          .first()
          .then(user => {
              if (user && bc.compareSync(password, user.password)) {
                  const token = generateToken(user)
                  res.status(200).json({ message: `Welcome ${user.username}!`, token});
              } else {
                  res.status(401).json({ message: "Invalid Credentials" });
              }
          })
          .catch(error => {
              res.status(500).json(error);
          });
  });
  
  function generateToken(user){
    const payload = {
        username: user.username,
        id: user.id
    }
    const options ={
        expiresIn: '1d'
    }
    return jwt.sign(payload, process.env.JWT_SECRET || 'thisObscuresThePassword', options)
  }

module.exports = router 