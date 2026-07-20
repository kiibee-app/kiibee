# API Versioning Quick Reference

## 🚀 Quick Start

### Before (Old API)

```typescript
// URLs without version
GET / api / auth / login;
GET / api / payment / cards;
```

### After (New API with Versioning)

```typescript
// URLs with version
GET / api / v1 / auth / login;
GET / api / v1 / payment / cards;
```

## 📝 Using Versioned APIs

### Frontend (TypeScript/JavaScript)

```typescript
// Old way - DON'T USE
const response = await fetch("/api/auth/login", {
  method: "POST",
  body: JSON.stringify({ email, password }),
});

// New way - USE THIS
const response = await fetch("/api/v1/auth/login", {
  method: "POST",
  body: JSON.stringify({ email, password }),
});
```

### Using Axios

```typescript
// Update your base URL
const api = axios.create({
  baseURL: "/api/v1", // Changed from '/api'
});

// All calls automatically use v1
const login = await api.post("/auth/login", credentials);
const profile = await api.get("/auth/user/profile");
```

### Using React Query/TanStack Query

```typescript
// Update query keys to include version
const { data } = useQuery({
  queryKey: ["user", "profile"],
  queryFn: () => api.get("/api/v1/auth/user/profile"),
});
```

## 🔍 Checking API Version

### Response Headers

Every API response includes version info:

```
X-API-Current-Version: 1
X-API-Version-Info: {"version":"1","status":"current","released":"2026-01-01"}
```

### cURL Example

```bash
# Test endpoint and see version headers
curl -I http://localhost:4001/api/v1/health

# Response headers:
# X-API-Current-Version: 1
# X-API-Version-Info: {"version":"1","status":"current",...}
```

## 📋 Common Endpoints

### Authentication

```bash
POST   /api/v1/auth/login
POST   /api/v1/auth/signup
POST   /api/v1/auth/logout
GET    /api/v1/auth/user/profile
PATCH  /api/v1/auth/user/profile
```

### Payments

```bash
GET    /api/v1/payment/cards
POST   /api/v1/payment/card/add
DELETE /api/v1/payment/card/:id
PUT    /api/v1/payment/card/default/:id
```

### Orders

```bash
POST   /api/v1/order/create
GET    /api/v1/order/billing-history
GET    /api/v1/order/:orderId
```

### Content

```bash
GET    /api/v1/content/all
GET    /api/v1/content/:id
POST   /api/v1/content/upload
```

## ⚠️ Common Errors

### 404 Not Found

**Error:** `GET /api/auth/login` returns 404

**Fix:** Add version to URL

```typescript
// Wrong
"/api/auth/login";

// Correct
"/api/v1/auth/login";
```

### Version Mismatch

**Error:** Trying to access v2 endpoint that doesn't exist

**Fix:** Use v1 for now

```typescript
// Wrong - v2 doesn't exist yet
"/api/v2/auth/login";

// Correct
"/api/v1/auth/login";
```

## 🆘 Troubleshooting

### "Cannot find route"

Check that you're using the correct version:

```bash
# List all available versions
curl http://localhost:4001/api/v1/health
```

### "Version header missing"

The version is in the URL path, not just headers:

```typescript
// Must include v1 in URL
fetch("/api/v1/endpoint"); // ✅
fetch("/api/endpoint"); // ❌
```

## 📚 More Information

- Full documentation: `apps/server/API_VERSIONING.md`
- Version config: `apps/server/src/config/api-versioning.ts`
- Implementation checklist: See issue #2082

## 🔄 Migration Timeline

- **Now:** All endpoints use `/api/v1/`
- **Future (Q2 2027):** v2 will be introduced
- **Future (Q4 2027):** v1 will be deprecated (6 months after v2 release)

---

**Questions?** Create an issue with label `api-versioning` or contact the backend team.
