---
name: coding-standards
description: Project coding standards and testing guidelines
version: 1.0.0
tags:
  - development
  - testing
---

# Coding Standards

## Code quality

- Functions under 50 lines
- Use descriptive variable names
- Always add TypeScript types

## Testing

- Test all exported functions
- Use AAA pattern: Arrange, Act, Assert
- Cover happy paths and edge cases

## Before committing

1. Write implementation
2. Write comprehensive tests
3. Run tests: `npm test`
4. All tests must pass
