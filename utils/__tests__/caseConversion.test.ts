import { describe, it, expect } from 'vitest';
import {
  snakeToCamelString,
  camelToSnakeString,
  snakeToCamel,
  camelToSnake,
  convertKeysSnakeToCamel,
  convertKeysCamelToSnake,
  fromBackend,
  toBackend,
} from '../caseConversion';

describe('caseConversion', () => {
  describe('snakeToCamelString', () => {
    it('should convert simple snake_case to camelCase', () => {
      expect(snakeToCamelString('user_name')).toBe('userName');
      expect(snakeToCamelString('created_at')).toBe('createdAt');
    });

    it('should handle multiple underscores', () => {
      expect(snakeToCamelString('first_middle_last_name')).toBe('firstMiddleLastName');
    });

    it('should handle already camelCase strings', () => {
      expect(snakeToCamelString('userName')).toBe('userName');
    });

    it('should handle single word strings', () => {
      expect(snakeToCamelString('name')).toBe('name');
    });

    it('should handle empty strings', () => {
      expect(snakeToCamelString('')).toBe('');
    });
  });

  describe('camelToSnakeString', () => {
    it('should convert simple camelCase to snake_case', () => {
      expect(camelToSnakeString('userName')).toBe('user_name');
      expect(camelToSnakeString('createdAt')).toBe('created_at');
    });

    it('should handle multiple capitals', () => {
      expect(camelToSnakeString('firstMiddleLastName')).toBe('first_middle_last_name');
    });

    it('should handle already snake_case strings', () => {
      expect(camelToSnakeString('user_name')).toBe('user_name');
    });

    it('should handle single word strings', () => {
      expect(camelToSnakeString('name')).toBe('name');
    });
  });

  describe('snakeToCamel (object)', () => {
    it('should convert flat object keys', () => {
      const input = { user_name: 'John', created_at: '2024-01-01' };
      const expected = { userName: 'John', createdAt: '2024-01-01' };
      expect(snakeToCamel(input)).toEqual(expected);
    });

    it('should convert nested object keys', () => {
      const input = {
        user_data: {
          first_name: 'John',
          last_name: 'Doe',
        },
      };
      const expected = {
        userData: {
          firstName: 'John',
          lastName: 'Doe',
        },
      };
      expect(snakeToCamel(input)).toEqual(expected);
    });

    it('should convert arrays of objects', () => {
      const input = [
        { user_name: 'John' },
        { user_name: 'Jane' },
      ];
      const expected = [
        { userName: 'John' },
        { userName: 'Jane' },
      ];
      expect(snakeToCamel(input)).toEqual(expected);
    });

    it('should preserve primitive values', () => {
      expect(snakeToCamel('test')).toBe('test');
      expect(snakeToCamel(123)).toBe(123);
      expect(snakeToCamel(null)).toBe(null);
      expect(snakeToCamel(undefined)).toBe(undefined);
    });

    it('should preserve Date objects', () => {
      const date = new Date('2024-01-01');
      const input = { created_at: date };
      const result = snakeToCamel(input);
      expect(result.createdAt).toBe(date);
    });
  });

  describe('camelToSnake (object)', () => {
    it('should convert flat object keys', () => {
      const input = { userName: 'John', createdAt: '2024-01-01' };
      const expected = { user_name: 'John', created_at: '2024-01-01' };
      expect(camelToSnake(input)).toEqual(expected);
    });

    it('should convert nested object keys', () => {
      const input = {
        userData: {
          firstName: 'John',
          lastName: 'Doe',
        },
      };
      const expected = {
        user_data: {
          first_name: 'John',
          last_name: 'Doe',
        },
      };
      expect(camelToSnake(input)).toEqual(expected);
    });

    it('should convert arrays of objects', () => {
      const input = [
        { userName: 'John' },
        { userName: 'Jane' },
      ];
      const expected = [
        { user_name: 'John' },
        { user_name: 'Jane' },
      ];
      expect(camelToSnake(input)).toEqual(expected);
    });
  });

  describe('convertKeysSnakeToCamel', () => {
    it('should only convert specified keys', () => {
      const input = { user_name: 'John', raw_data: { nested: true } };
      const result = convertKeysSnakeToCamel(input, ['user_name']);
      expect(result).toEqual({ userName: 'John', raw_data: { nested: true } });
    });

    it('should not modify object when no keys match', () => {
      const input = { user_name: 'John' };
      const result = convertKeysSnakeToCamel(input, ['other_key']);
      expect(result).toEqual({ user_name: 'John' });
    });
  });

  describe('convertKeysCamelToSnake', () => {
    it('should only convert specified keys', () => {
      const input = { userName: 'John', rawData: { nested: true } };
      const result = convertKeysCamelToSnake(input, ['userName']);
      expect(result).toEqual({ user_name: 'John', rawData: { nested: true } });
    });
  });

  describe('fromBackend', () => {
    it('should convert backend response to frontend format', () => {
      const backendResponse = {
        user_id: 1,
        user_name: 'John',
        created_at: '2024-01-01',
      };
      const result = fromBackend<{ userId: number; userName: string; createdAt: string }>(backendResponse);
      expect(result).toEqual({
        userId: 1,
        userName: 'John',
        createdAt: '2024-01-01',
      });
    });
  });

  describe('toBackend', () => {
    it('should convert frontend data to backend format', () => {
      const frontendData = {
        userId: 1,
        userName: 'John',
        createdAt: '2024-01-01',
      };
      const result = toBackend(frontendData);
      expect(result).toEqual({
        user_id: 1,
        user_name: 'John',
        created_at: '2024-01-01',
      });
    });
  });
});
