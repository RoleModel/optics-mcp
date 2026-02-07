import { describe, it, expect } from 'vitest'

import ValidateColorPairTool from '../../../src/tools/validate-color-pair-tool.js'

describe('ValidateColorPairTool', () => {
  describe('getValidForegroundTokens', () => {
    it('returns valid foreground tokens for a given background token', async () => {
      const tool = new ValidateColorPairTool()

      const response = tool.getValidForegroundTokens('op-color-primary-plus-three')

      expect(response).toEqual([
        'op-color-primary-on-plus-three',
        'op-color-primary-on-plus-three-alt',
      ])
    })

    it('returns valid foreground tokens for more complex colors of a given background token', async () => {
      const tool = new ValidateColorPairTool()

      const response = tool.getValidForegroundTokens('op-color-alerts-neutral-plus-one')

      expect(response).toEqual([
        'op-color-alerts-neutral-on-plus-one',
        'op-color-alerts-neutral-on-plus-one-alt',
      ])
    })

    it('returns an empty array when no valid foreground tokens exist for the given argument', () => {
      const tool = new ValidateColorPairTool()

      const response = tool.getValidForegroundTokens('op-color-nonexistent')

      expect(response).toEqual([])
    })
  })

  describe('getResponse', () => {
    it('returns a valid response with valid foreground tokens for a given background token', async () => {
      const tool = new ValidateColorPairTool()

      const response = tool.getResponse('op-color-primary-plus-three', 'op-color-primary-on-plus-three')

      expect(response).toEqual({
        valid: true,
        validForegroundTokens: [
          'op-color-primary-on-plus-three',
          'op-color-primary-on-plus-three-alt',
        ]
      })
    })

    it('returns an invalid response with valid foreground tokens for a given background token', async () => {
      const tool = new ValidateColorPairTool()

      const response = tool.getResponse('op-color-primary-plus-three', 'op-color-primary-on-plus-six')

      expect(response).toEqual({
        valid: false,
        validForegroundTokens: [
          'op-color-primary-on-plus-three',
          'op-color-primary-on-plus-three-alt',
        ]
      })
    })

    it('returns an invalid response with an error when no tokens exist for the given background token', () => {
      const tool = new ValidateColorPairTool()

      const response = tool.getResponse('op-color-nonexistent', 'op-color-primary-on-plus-three')

      expect(response).toEqual({
        valid: false,
        errorMessage: 'The given background token is not valid.'
      })
    })
  })
})
