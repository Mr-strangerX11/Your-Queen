# NPM Publishing Guide

If you want to publish components of this project to NPM, follow this guide.

## Publishing the Entire Project

This is generally **not recommended** for full-stack applications, but if you want to create an npm package:

### Prerequisites
- NPM account (create at https://www.npmjs.com/signup)
- Logged in to npm: `npm login`

### Steps

1. **Update package.json**
   ```json
   {
     "name": "@your-username/your-queen",
     "version": "1.0.0",
     "description": "Premium Online Jewelry Store",
     "main": "backend/server.js",
     "private": false
   }
   ```

2. **Publish**
   ```bash
   npm publish --access public
   ```

## Publishing Reusable Components

A better approach is to extract reusable components and publish them separately.

### Example: Publishing Frontend Components

1. **Create a new package**
   ```bash
   mkdir your-queen-components
   cd your-queen-components
   npm init -y
   ```

2. **Copy reusable components**
   ```
   your-queen-components/
   ├── src/
   │   ├── components/
   │   │   ├── ProductCard.jsx
   │   │   ├── CartItem.jsx
   │   │   └── Button.jsx
   │   └── index.js
   ├── package.json
   └── README.md
   ```

3. **Update package.json**
   ```json
   {
     "name": "@your-username/your-queen-components",
     "version": "1.0.0",
     "description": "Reusable React components for e-commerce",
     "main": "dist/index.js",
     "module": "dist/index.esm.js",
     "files": ["dist"],
     "peerDependencies": {
       "react": "^18.0.0",
       "react-dom": "^18.0.0"
     },
     "devDependencies": {
       "@rollup/plugin-node-resolve": "^15.0.0",
       "rollup": "^3.0.0",
       "rollup-plugin-peer-deps-external": "^2.2.4",
       "@rollup/plugin-commonjs": "^25.0.0",
       "@rollup/plugin-babel": "^6.0.0"
     }
   }
   ```

4. **Build and publish**
   ```bash
   npm run build
   npm publish --access public
   ```

### Example: Publishing Backend API Client

1. **Create SDK package**
   ```bash
   mkdir your-queen-sdk
   cd your-queen-sdk
   npm init -y
   ```

2. **Create API client**
   ```javascript
   // src/index.js
   class YourQueenClient {
     constructor(apiUrl, apiKey) {
       this.apiUrl = apiUrl;
       this.apiKey = apiKey;
     }

     async getProducts(filters) {
       // Implementation
     }

     async createOrder(orderData) {
       // Implementation
     }
   }

   module.exports = YourQueenClient;
   ```

3. **Publish**
   ```bash
   npm publish --access public
   ```

## Versioning

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features, backward compatible
- **PATCH** (0.0.1): Bug fixes

Update version:
```bash
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.1 -> 1.1.0
npm version major  # 1.1.0 -> 2.0.0
```

Then publish:
```bash
npm publish
```

## Best Practices

1. **Use scoped packages**: `@your-username/package-name`
2. **Add .npmignore**: Exclude unnecessary files
3. **Include README**: Good documentation
4. **Add keywords**: Help users find your package
5. **License**: Include a LICENSE file
6. **Test before publishing**: `npm pack` to test locally
7. **Use npm scripts**: Automate build and publish

## NPM Scripts

Add to package.json:
```json
{
  "scripts": {
    "prepublishOnly": "npm run build && npm test",
    "build": "rollup -c",
    "test": "jest"
  }
}
```

## .npmignore Example

```
src/
tests/
.github/
.gitignore
.env
.env.example
docker-compose.yml
Dockerfile
*.log
node_modules/
coverage/
```

## Publishing Checklist

- [ ] Tests pass
- [ ] Build succeeds
- [ ] README is complete
- [ ] Version is bumped
- [ ] CHANGELOG is updated
- [ ] No sensitive data in package
- [ ] License is included
- [ ] Package.json is correct
- [ ] Tested locally with `npm pack`

## Unpublishing

⚠️ **Warning**: Only unpublish if absolutely necessary within 72 hours.

```bash
npm unpublish @your-username/package-name@1.0.0
```

## GitHub Package Registry

Alternative to NPM:

1. **Create .npmrc**
   ```
   @your-username:registry=https://npm.pkg.github.com
   ```

2. **Update package.json**
   ```json
   {
     "name": "@your-username/your-queen",
     "publishConfig": {
       "registry": "https://npm.pkg.github.com"
     }
   }
   ```

3. **Authenticate**
   ```bash
   npm login --registry=https://npm.pkg.github.com
   ```

4. **Publish**
   ```bash
   npm publish
   ```

## Note

For this full-stack application, **deployment** (not npm publishing) is the recommended way to share your project. See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment options.

NPM publishing is useful if you want to:
- Share reusable components
- Create a plugin system
- Build a framework on top of this
- Create an SDK for your API
