declare namespace Express {
  interface Request {
    oidc?: import('express-openid-connect').RequestContext;
  }
}
