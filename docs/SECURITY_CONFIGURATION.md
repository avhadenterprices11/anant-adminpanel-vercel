# Security Configuration Guide - Anant Enterprises Admin Panel

## 🔒 Current Security Measures

### 1. **Authentication & Authorization**
- ✅ JWT-based authentication via Supabase
- ✅ Token refresh handled automatically
- ✅ Protected routes with authentication checks
- ✅ Session management with automatic logout on expiry
- ✅ Role-based access control (RBAC) implemented

**Implementation Files:**
- [src/contexts/AuthContext.tsx](../src/contexts/AuthContext.tsx)
- [src/layouts/ProtectedRoute.tsx](../src/layouts/ProtectedRoute.tsx)
- [src/lib/api/httpClient.ts](../src/lib/api/httpClient.ts)

### 2. **API Security**
- ✅ Bearer token authentication on all requests
- ✅ Request timeout configured (30 seconds)
- ✅ HTTPS required for production
- ✅ Content-Type validation
- ✅ Error message sanitization

### 3. **Data Protection**
- ✅ Environment variables for sensitive data
- ✅ No hardcoded secrets in code
- ✅ `.env` files excluded from git
- ✅ Input validation using Zod schemas
- ✅ SQL injection prevention (backend handles)

### 4. **Client-Side Security**
- ✅ XSS protection via React's built-in escaping
- ✅ No `dangerouslySetInnerHTML` usage (except Quill editor with sanitization)
- ✅ CSP-friendly code structure
- ✅ Secure local storage usage (tokens stored in Supabase session)

## ⚠️ Production Security Checklist

### Critical (Before Deployment)

#### 1. **HTTPS Configuration**
```bash
# Ensure SSL/TLS certificate is valid
# Force HTTPS redirect
# HSTS header configured
```

#### 2. **Environment Variables**
```bash
# NEVER commit these files
.env
.env.local
.env.production

# Update production values
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1/
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-key
```

#### 3. **Security Headers**
Add these headers in your hosting configuration:

```nginx
# Nginx example
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

# Content Security Policy
add_header Content-Security-Policy "
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https: blob:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.yourdomain.com https://*.supabase.co wss://*.supabase.co;
  frame-src https://api.razorpay.com;
" always;

# HSTS (only after SSL is confirmed working)
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

**Vercel/Netlify Configuration:**
Create `vercel.json` or `netlify.toml`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

#### 4. **CORS Configuration**
Ensure your backend API has proper CORS settings:

```javascript
// Backend CORS configuration should allow only your admin domain
{
  origin: [
    'https://admin.yourdomain.com',
    'https://yourdomain.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

#### 5. **Token Security**
- ✅ Tokens stored in Supabase session (httpOnly cookies)
- ✅ Access tokens automatically refreshed
- ⚠️ Ensure token expiry is set appropriately (recommend: 1 hour)
- ⚠️ Implement token rotation on refresh

#### 6. **Input Validation**
All forms use Zod validation. Example:

```typescript
// Ensure all user inputs are validated
const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  // Add more validations as needed
});
```

### High Priority

#### 7. **Rate Limiting**
⚠️ **Action Required**: Implement rate limiting on backend API
- Login attempts: 5 per 15 minutes
- API requests: 100 per minute per user
- Password reset: 3 per hour

#### 8. **Audit Logging**
⚠️ **Recommendation**: Log security-relevant events
- Failed login attempts
- Permission changes
- Data exports
- Sensitive data access

#### 9. **Password Policy**
Current requirements (enforced on backend):
- Minimum 8 characters
- At least one uppercase letter
- At least one number
- At least one special character

#### 10. **Two-Factor Authentication (2FA)**
⚠️ **Recommendation**: Implement 2FA for admin users
- TOTP-based (Google Authenticator)
- SMS backup codes
- Recovery codes

### Medium Priority

#### 11. **Session Management**
Current implementation:
- ✅ Automatic logout on token expiry
- ✅ "Remember me" functionality
- ⚠️ Consider adding: Concurrent session limits
- ⚠️ Consider adding: Session hijacking detection

#### 12. **Data Encryption**
- ✅ Data in transit: HTTPS
- ⚠️ Data at rest: Ensure backend database encryption is enabled
- ⚠️ Consider: Encryption for sensitive fields (PII)

#### 13. **Error Handling**
- ✅ Errors don't expose sensitive information
- ✅ Stack traces hidden in production
- ✅ Generic error messages to users
- ✅ Detailed errors logged server-side

#### 14. **Dependency Security**
```bash
# Regular security audits
npm audit

# Fix vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated
```

#### 15. **Content Security**
- ✅ Rich text editor (Quill) sanitizes HTML
- ✅ Image uploads validated by file type
- ⚠️ Consider: Virus scanning for uploaded files
- ⚠️ Consider: File size limits enforced

## 🔍 Security Testing

### Manual Testing Checklist

#### Authentication
- [ ] Try accessing protected routes without login
- [ ] Test session expiry behavior
- [ ] Verify logout clears all session data
- [ ] Test "remember me" functionality
- [ ] Attempt SQL injection in login form
- [ ] Test XSS in input fields

#### Authorization
- [ ] Verify role-based access control
- [ ] Test accessing restricted features
- [ ] Check API endpoints return 403 for unauthorized access
- [ ] Verify user can't escalate their own privileges

#### Data Protection
- [ ] Check sensitive data isn't logged in browser console
- [ ] Verify tokens aren't exposed in localStorage
- [ ] Test CSRF protection
- [ ] Verify file upload restrictions

#### Network Security
- [ ] Confirm all API calls use HTTPS
- [ ] Check for mixed content warnings
- [ ] Verify secure cookies are set
- [ ] Test CORS restrictions

### Automated Security Testing

```bash
# Install security testing tools
npm install -D eslint-plugin-security

# Add to eslint.config.js
{
  plugins: ['security'],
  extends: ['plugin:security/recommended']
}

# Run security linting
npm run lint
```

## 🚨 Incident Response Plan

### If Security Breach Detected

1. **Immediate Actions**
   - Rotate all API keys and tokens
   - Force logout all users
   - Enable maintenance mode if needed
   - Document the incident

2. **Investigation**
   - Review audit logs
   - Identify affected users
   - Determine scope of breach
   - Analyze attack vector

3. **Remediation**
   - Patch vulnerability
   - Update security measures
   - Notify affected users (if required by law)
   - Implement additional monitoring

4. **Post-Incident**
   - Document lessons learned
   - Update security procedures
   - Conduct security training
   - Schedule security audit

## 📋 Security Maintenance Schedule

### Daily
- Monitor error logs for suspicious activity
- Check failed login attempts

### Weekly
- Review audit logs
- Check for security updates
- Monitor API usage patterns

### Monthly
- Run npm audit
- Update dependencies
- Review access permissions
- Test backup restore procedures

### Quarterly
- Full security audit
- Penetration testing (recommended)
- Update security documentation
- Review and update security policies

## 🔗 Security Resources

### Tools
- [OWASP ZAP](https://www.zaproxy.org/) - Web app security scanner
- [Snyk](https://snyk.io/) - Dependency vulnerability scanning
- [Mozilla Observatory](https://observatory.mozilla.org/) - Security header testing

### Best Practices
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

## 📞 Security Contacts

For security issues:
1. Do NOT create public GitHub issues
2. Contact: [Your security email]
3. Use PGP encryption if possible

## ✅ Pre-Deployment Security Verification

Run this checklist before deploying to production:

```bash
# 1. Check for sensitive data in code
git grep -i "password\|secret\|key\|token" --cached

# 2. Verify environment variables
cat .env.production

# 3. Run security audit
npm audit

# 4. Build for production
npm run build:prod

# 5. Test production build locally
npm run preview

# 6. Check bundle for sensitive data
grep -r "API_KEY\|SECRET\|PASSWORD" dist/

# 7. Verify security headers (after deployment)
curl -I https://your-domain.com
```

---

**Last Updated**: February 2026
**Review Date**: May 2026
**Version**: 1.0
