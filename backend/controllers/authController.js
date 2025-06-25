const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Usuario de ejemplo (en producción usar base de datos)
const user = {
  id: 1,
  username: 'admin',
  password: bcrypt.hashSync('admin123', 8), // Contraseña encriptada
  role: 'admin'
};

exports.login = (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (username !== user.username) {
      const err = new Error('Usuario o contraseña incorrectos');
      err.status = 401;
      return next(err);
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      const err = new Error('Usuario o contraseña incorrectos');
      err.status = 401;
      return next(err);
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secreto', {
      expiresIn: 86400 // 24 horas
    });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};
