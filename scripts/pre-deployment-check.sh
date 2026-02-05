#!/bin/bash

# Pre-Deployment Validation Script for Anant Enterprises Admin Panel
# This script performs comprehensive checks before deploying to production

set -e  # Exit on error

echo "🔍 Starting Pre-Deployment Validation..."
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
WARNINGS=0
ERRORS=0

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
        ERRORS=$((ERRORS + 1))
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    WARNINGS=$((WARNINGS + 1))
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Checking Environment Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if .env.production exists
if [ -f ".env.production" ]; then
    print_status 0 ".env.production file exists"
    
    # Check for required variables
    required_vars=("VITE_API_BASE_URL" "VITE_SUPABASE_URL" "VITE_SUPABASE_ANON_KEY")
    for var in "${required_vars[@]}"; do
        if grep -q "^$var=" .env.production 2>/dev/null; then
            value=$(grep "^$var=" .env.production | cut -d'=' -f2-)
            if [[ "$value" == *"your-"* ]] || [[ "$value" == *"localhost"* ]]; then
                print_warning "$var contains placeholder value"
            else
                print_status 0 "$var is configured"
            fi
        else
            print_status 1 "$var is missing in .env.production"
        fi
    done
else
    print_status 1 ".env.production file not found"
    echo "   Create .env.production from .env.production.example"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. Checking for Sensitive Data in Code"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check for hardcoded secrets
if git grep -i "password.*=.*['\"]" -- "*.ts" "*.tsx" >/dev/null 2>&1; then
    print_warning "Found potential hardcoded passwords"
else
    print_status 0 "No hardcoded passwords found"
fi

if git grep -i "api.*key.*=.*['\"]" -- "*.ts" "*.tsx" >/dev/null 2>&1; then
    print_warning "Found potential hardcoded API keys"
else
    print_status 0 "No hardcoded API keys found"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. Running Type Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if npm run type-check >/dev/null 2>&1; then
    print_status 0 "TypeScript compilation successful"
else
    print_status 1 "TypeScript compilation failed"
    echo "   Run: npm run type-check to see errors"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. Running Linter"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if npm run lint >/dev/null 2>&1; then
    print_status 0 "Linting passed"
else
    print_warning "Linting found issues"
    echo "   Run: npm run lint to see details"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. Running Security Audit"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

audit_output=$(npm audit --production 2>&1 || true)
if echo "$audit_output" | grep -q "found 0 vulnerabilities"; then
    print_status 0 "No security vulnerabilities found"
else
    critical=$(echo "$audit_output" | grep -o "[0-9]* critical" | awk '{print $1}' || echo "0")
    high=$(echo "$audit_output" | grep -o "[0-9]* high" | awk '{print $1}' || echo "0")
    
    if [ "$critical" -gt 0 ] || [ "$high" -gt 0 ]; then
        print_status 1 "Found $critical critical and $high high severity vulnerabilities"
        echo "   Run: npm audit for details"
    else
        print_warning "Found low/moderate vulnerabilities"
        echo "   Run: npm audit for details"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. Building for Production"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if npm run build:prod >/dev/null 2>&1; then
    print_status 0 "Production build successful"
    
    # Check dist folder
    if [ -d "dist" ]; then
        dist_size=$(du -sh dist | cut -f1)
        echo "   Build size: $dist_size"
        
        # Check for large chunks
        large_chunks=$(find dist/assets -name "*.js" -size +500k 2>/dev/null || true)
        if [ -n "$large_chunks" ]; then
            print_warning "Found chunks larger than 500KB:"
            echo "$large_chunks" | while read -r file; do
                size=$(du -h "$file" | cut -f1)
                echo "      - $(basename "$file"): $size"
            done
        fi
    fi
else
    print_status 1 "Production build failed"
    echo "   Run: npm run build:prod to see errors"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7. Checking for Debug Code"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check dist folder for console.log (should be minimal in production)
if [ -d "dist" ]; then
    console_count=$(grep -r "console\.log" dist/ 2>/dev/null | wc -l || echo "0")
    if [ "$console_count" -gt 10 ]; then
        print_warning "Found $console_count console.log statements in build"
    else
        print_status 0 "Minimal console.log usage in build"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "8. Checking Git Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check for uncommitted changes
if [ -z "$(git status --porcelain)" ]; then
    print_status 0 "No uncommitted changes"
else
    print_warning "Uncommitted changes detected"
    echo "   Run: git status to see details"
fi

# Check current branch
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" = "main" ] || [ "$current_branch" = "master" ]; then
    print_status 0 "On main branch"
else
    print_warning "Not on main branch (current: $current_branch)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "9. Checking Package Dependencies"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check for outdated packages
outdated_output=$(npm outdated 2>&1 || true)
if [ -z "$outdated_output" ]; then
    print_status 0 "All packages are up to date"
else
    print_warning "Some packages are outdated"
    echo "   Run: npm outdated for details"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "10. Final Checklist"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "Manual verification required:"
echo "  [ ] Backend API is accessible from production domain"
echo "  [ ] CORS is configured on backend"
echo "  [ ] SSL certificate is configured"
echo "  [ ] Security headers are configured"
echo "  [ ] Supabase Storage permissions are correct"
echo "  [ ] All environment variables are production values"
echo "  [ ] Database migrations are applied"
echo "  [ ] Backup procedures are in place"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Validation Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Your application is ready for deployment."
    echo ""
    echo "Next steps:"
    echo "  1. Review the manual checklist above"
    echo "  2. Deploy the dist/ folder to your hosting platform"
    echo "  3. Monitor error logs after deployment"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ Validation completed with $WARNINGS warning(s)${NC}"
    echo ""
    echo "Please review the warnings before deploying."
    exit 0
else
    echo -e "${RED}✗ Validation failed with $ERRORS error(s) and $WARNINGS warning(s)${NC}"
    echo ""
    echo "Please fix the errors before deploying."
    exit 1
fi
