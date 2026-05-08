import { describe, it, expect } from 'vitest'
import { capitalize, slugify, truncate } from '../src/utils/string-helpers'

describe('String Helpers', () => {
  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      // Arrange
      const input = 'hello'

      // Act
      const result = capitalize(input)

      // Assert
      expect(result).toBe('Hello')
    })
  })

  describe('slugify', () => {
    it('converts to lowercase and replaces spaces', () => {
      // Arrange
      const input = 'Hello World'

      // Act
      const result = slugify(input)

      // Assert
      expect(result).toBe('hello-world')
    })
  })

  describe('truncate', () => {
    it('returns the original string when it is shorter than the max length', () => {
      // Arrange
      const input = 'hello'

      // Act
      const result = truncate(input, 10)

      // Assert
      expect(result).toBe('hello')
    })

    it('returns the original string when it matches the max length', () => {
      // Arrange
      const input = 'hello'

      // Act
      const result = truncate(input, 5)

      // Assert
      expect(result).toBe('hello')
    })

    it('truncates and adds an ellipsis when the string exceeds the max length', () => {
      // Arrange
      const input = 'hello world'

      // Act
      const result = truncate(input, 8)

      // Assert
      expect(result).toBe('hello...')
    })

    it('returns only an ellipsis when the max length is 3 and truncation is needed', () => {
      // Arrange
      const input = 'hello'

      // Act
      const result = truncate(input, 3)

      // Assert
      expect(result).toBe('...')
    })

    it('returns a shortened ellipsis when the max length is less than 3 and truncation is needed', () => {
      // Arrange
      const input = 'hello'

      // Act
      const result = truncate(input, 2)

      // Assert
      expect(result).toBe('..')
    })

    it('returns an empty string when truncating to zero length', () => {
      // Arrange
      const input = 'hello'

      // Act
      const result = truncate(input, 0)

      // Assert
      expect(result).toBe('')
    })
  })
})
