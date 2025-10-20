# Contributing to CarbonDepict

Thank you for your interest in contributing to CarbonDepict! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow

## Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`
5. Make your changes
6. Run tests: `npm test`
7. Commit: `git commit -m "feat: description"`
8. Push: `git push origin feature/your-feature-name`
9. Create a Pull Request

## Commit Convention

We use Conventional Commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Example: `feat: add refrigerant emission calculation`

## Code Style

- Use Prettier for formatting
- Follow ESLint rules
- Use meaningful variable names
- Add comments for complex logic
- Write accessible components

## Testing

- Write unit tests for utilities
- Add component tests for UI
- Include integration tests for API
- Ensure accessibility with axe-core

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Request review from maintainers

## Areas for Contribution

### High Priority
- Database models (Mongoose schemas)
- Chart components (Chart.js/Recharts)
- PDF report generation
- Excel upload functionality
- Additional DEFRA categories

### Medium Priority
- Additional tests
- Documentation improvements
- UI enhancements
- Performance optimizations

### Low Priority
- Storybook stories
- Additional languages
- Theme customization

## Questions?

Open an issue or contact the maintainers.

Thank you for contributing! 🙏
