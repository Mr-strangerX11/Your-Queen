# Contributing to Your Queen

Thank you for your interest in contributing to Your Queen! We welcome contributions from the community.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

---

## Code of Conduct

By participating in this project, you agree to:
- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Git
- A code editor (VS Code recommended)

### Setup Development Environment

1. **Fork the repository**
   - Visit https://github.com/Mr-strangerX11/Your-Queen
   - Click "Fork" button

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/Your-Queen.git
   cd Your-Queen
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/Mr-strangerX11/Your-Queen.git
   ```

4. **Install dependencies**
   ```bash
   npm run install-all
   ```

5. **Set up environment variables**
   ```bash
   cd backend
   cp env.template .env
   # Edit .env with your local configuration
   ```

6. **Start development servers**
   ```bash
   # From project root
   npm run dev
   ```

---

## How to Contribute

### Reporting Bugs

Found a bug? Help us fix it!

1. Check if the bug has already been reported in [Issues](https://github.com/Mr-strangerX11/Your-Queen/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details (OS, Node version, etc.)

### Suggesting Features

Have an idea for improvement?

1. Check existing [Issues](https://github.com/Mr-strangerX11/Your-Queen/issues) and [Pull Requests](https://github.com/Mr-strangerX11/Your-Queen/pulls)
2. Create a new issue with:
   - Clear title describing the feature
   - Detailed description of the proposed feature
   - Use cases and benefits
   - Possible implementation approach

### Improving Documentation

Documentation improvements are always welcome:
- Fix typos or unclear explanations
- Add examples or tutorials
- Improve setup instructions
- Translate documentation

---

## Development Workflow

### 1. Create a Branch

```bash
# Update your fork
git checkout main
git pull upstream main

# Create a new branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

### 2. Make Your Changes

- Write clean, readable code
- Follow the coding standards (see below)
- Add comments for complex logic
- Update documentation if needed
- Add or update tests

### 3. Test Your Changes

```bash
# Backend tests (if available)
cd backend
npm test

# Frontend tests (if available)
cd frontend
npm test

# Manual testing
npm run dev
```

Test checklist:
- [ ] Feature works as expected
- [ ] No console errors
- [ ] Existing features still work
- [ ] Works on different screen sizes (for UI changes)
- [ ] Database operations are correct

### 4. Commit Your Changes

```bash
git add .
git commit -m "Your descriptive commit message"
```

See [Commit Messages](#commit-messages) section for guidelines.

### 5. Push and Create Pull Request

```bash
git push origin your-branch-name
```

Then:
1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill in the PR template
4. Submit the pull request

---

## Coding Standards

### General Guidelines

- **Keep it simple**: Write clear, simple code
- **DRY**: Don't Repeat Yourself
- **KISS**: Keep It Simple, Stupid
- **YAGNI**: You Aren't Gonna Need It
- **Consistent**: Follow existing code style

### JavaScript/Node.js

```javascript
// Use const/let, not var
const API_URL = 'http://localhost:5000';
let userCount = 0;

// Use arrow functions for callbacks
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);

// Use async/await instead of callbacks
async function fetchUser(id) {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Use destructuring
const { name, email } = user;

// Use template literals
const message = `Welcome, ${name}!`;
```

### React

```javascript
// Use functional components
const ProductCard = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false);
  
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </div>
  );
};

// Use proper prop types or TypeScript
ProductCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.required,
    price: PropTypes.number.required
  }).required
};
```

### File Organization

```
backend/
├── config/          # Configuration files
├── middleware/      # Express middleware
├── models/          # Database models
├── routes/          # API routes
├── utils/           # Utility functions
└── server.js        # Entry point

frontend/
├── src/
│   ├── components/  # Reusable components
│   ├── pages/       # Page components
│   ├── context/     # React context
│   ├── utils/       # Utility functions
│   └── App.js       # Main app component
```

### Naming Conventions

- **Files**: camelCase for JavaScript files, PascalCase for React components
  - `userController.js`, `ProductCard.jsx`
- **Variables**: camelCase
  - `const userName = 'John';`
- **Constants**: UPPER_SNAKE_CASE
  - `const API_BASE_URL = '...';`
- **Classes/Components**: PascalCase
  - `class UserModel`, `function ProductList()`
- **Functions**: camelCase, use verbs
  - `getUserById()`, `fetchProducts()`

---

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
# Simple commit
git commit -m "feat: add user profile page"

# With scope
git commit -m "fix(auth): resolve JWT token expiration issue"

# With body
git commit -m "feat(products): add product filtering

- Add filter by category
- Add filter by price range
- Add sort options"

# Breaking change
git commit -m "feat(api): change product schema

BREAKING CHANGE: Product schema now requires 'category' field"
```

---

## Pull Request Process

### Before Submitting

Checklist:
- [ ] Code follows the project's coding standards
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated (if needed)
- [ ] Tests added/updated (if applicable)
- [ ] All tests pass
- [ ] No console errors or warnings
- [ ] Branch is up to date with main

### PR Title

Follow commit message conventions:
```
feat: add product wishlist feature
fix: resolve cart total calculation bug
docs: update deployment guide
```

### PR Description Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
How were these changes tested?

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Fixes #123
Related to #456
```

### Review Process

1. Maintainer will review your PR
2. Address any requested changes
3. Once approved, PR will be merged
4. Your contribution will be credited

### After Merge

```bash
# Switch back to main
git checkout main

# Pull latest changes
git pull upstream main

# Delete your feature branch
git branch -d feature/your-feature-name
```

---

## Questions?

- Create an issue for general questions
- Join our community discussions
- Email: support@yourqueen.com

---

Thank you for contributing to Your Queen! 🎉
