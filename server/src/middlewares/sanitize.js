// Recursively remove any keys that start with "$" or contain a dot
function sanitizeValue(value) {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue)
  }
  if (value && typeof value === 'object') {
    const clean = {}
    for (const [key, val] of Object.entries(value)) {
      if (key.startsWith('$') || key.includes('.')) continue
      clean[key] = sanitizeValue(val)
    }
    return clean
  }
  return value
}

// Basic XSS protection - remove script tags and dangerous attributes
function xssClean(value) {
  if (typeof value === 'string') {
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
  }
  if (Array.isArray(value)) {
    return value.map(xssClean)
  }
  if (value && typeof value === 'object') {
    const clean = {}
    for (const [key, val] of Object.entries(value)) {
      clean[key] = xssClean(val)
    }
    return clean
  }
  return value
}

export function sanitizeRequest(req, res, next) {
  try {
    if (req.body) {
      req.body = sanitizeValue(req.body)
      req.body = xssClean(req.body) // Apply XSS protection
    }
    if (req.params) {
      req.params = sanitizeValue(req.params)
      req.params = xssClean(req.params) // Apply XSS protection
    }
    // Intentionally skip req.query because it's a getter-only in Express 5 router
    next()
  } catch (err) {
    next(err)
  }
}

export default sanitizeRequest


