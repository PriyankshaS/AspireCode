const jwt = require("jsonwebtoken");


function UserController() {

  //Customer or Admin logins the application
  const login = async function(req, res) {

  // Assuming a login mechanism with simple hardcoded credentials for demo only
  const { username, password } = req.body;
  if ((username === 'admin' || username ==='customer') && password === 'password') {
    const token = jwt.sign({ username }, process.env.APP_SECRET);
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Authentication failed' });
  }
  };

  return {
    login,
  };
}

module.exports = UserController();
