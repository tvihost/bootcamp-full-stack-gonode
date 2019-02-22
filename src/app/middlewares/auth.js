module.exports = (req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user
    console.log(res.locals.user)
    return next()
  }

  return res.redirect('/')
}
