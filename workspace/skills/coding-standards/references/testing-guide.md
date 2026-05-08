# Testing Guide

## AAA pattern

```typescript
it('descriptive test name', () => {
  // Arrange: Set up test data
  const input = 'test'

  // Act: Execute the function
  const result = doSomething(input)

  // Assert: Verify the result
  expect(result).toBe('expected')
})
```

## What to test

- Happy paths (normal inputs)
- Edge cases (empty, null, boundary values)
- Error cases (invalid inputs, exceptions)
