const { parse } = require('url')
const METHODS = require('http').METHODS

exports.namespace = (namespace) => (...fns) => {
  return async (req, res) => {
    for (const fn of fns) {
      if (await fn(req, res, namespace)) return true
    }
  }
}

METHODS.forEach(method => {
  exports[method === 'DELETE' ? 'del' : method.toLowerCase()] = createMethodFn(method)
})

function createMethodFn(method) {
  return (path, fn) => async (req, res, namespace = '') => {
    let route = namespace + path
    let methods = []

    methods.push(method)
    if (method === 'GET') methods.push('HEAD')

    if (methods.indexOf(req.method) >= 0 && checkRoute(req, route)) {
      return await fn(req, res)
    }
    return
  }
}

function checkRoute(req, route) {
  const { query, pathname } = parse(req.url, true)
  const routeSegment = route.split('/').filter(Boolean)
  const urlSegment = pathname.split('/').filter(Boolean)

  req.params = new Object()
  req.query = new Object()

  Object.assign(req.query, query)

  for (let i = 0; i < routeSegment.length; i++) {
    if (routeSegment[i] === '*') {
      req.serve = new Object()
      req.serve = '/' + urlSegment.slice(i).join('/')
      return true
    }

    if (routeSegment[i].match(/^:/)) {
      const key = routeSegment[i].slice(1)
      Object.assign(req.params, { [key]: urlSegment[i] })
    } else if (routeSegment[i] !== urlSegment[i]) {
      return
    }
  }

  if (routeSegment.length !== urlSegment.length) return

  return true
}