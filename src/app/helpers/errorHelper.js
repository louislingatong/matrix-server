module.exports = {
  parseError: (res, status, error) => {
    switch (status) {
      case 422:
        const name = Object.keys(error)[0];
        const message = error[name];
        res.status(status).json({name, message});
        break;
      default:
        res.status(status).send(error);
        break;
    }
  }
}