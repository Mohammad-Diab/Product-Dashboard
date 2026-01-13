import { loginSchema, registerSchema, LoginFormData, RegisterFormData } from "@/features/auth/schemas";

describe('auth-schemas', () => {
  describe('loginSchema', () => {
    describe('valid data', () => {
      it('should validate correct login data', () => {
        const validData = {
          email: 'test@example.com',
          password: 'password123',
        };

        const result = loginSchema.safeParse(validData);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(validData);
        }
      });

      it('should accept various valid email formats', () => {
        const validEmails = [
          'user@example.com',
          'user.name@example.com',
          'user+tag@example.co.uk',
          'user123@test-domain.com',
        ];

        validEmails.forEach((email) => {
          const result = loginSchema.safeParse({
            email,
            password: 'password123',
          });

          expect(result.success).toBe(true);
        });
      });

      it('should accept password with exactly 8 characters', () => {
        const result = loginSchema.safeParse({
          email: 'test@example.com',
          password: '12345678',
        });

        expect(result.success).toBe(true);
      });

      it('should accept long passwords', () => {
        const result = loginSchema.safeParse({
          email: 'test@example.com',
          password: 'a'.repeat(100),
        });

        expect(result.success).toBe(true);
      });
    });

    describe('invalid email', () => {
      it('should reject invalid email format', () => {
        const result = loginSchema.safeParse({
          email: 'invalid-email',
          password: 'password123',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Invalid email format');
        }
      });

      it('should reject email without domain', () => {
        const result = loginSchema.safeParse({
          email: 'test@',
          password: 'password123',
        });

        expect(result.success).toBe(false);
      });

      it('should reject email without @', () => {
        const result = loginSchema.safeParse({
          email: 'testexample.com',
          password: 'password123',
        });

        expect(result.success).toBe(false);
      });

      it('should reject empty email', () => {
        const result = loginSchema.safeParse({
          email: '',
          password: 'password123',
        });

        expect(result.success).toBe(false);
      });
    });

    describe('invalid password', () => {
      it('should reject password shorter than 8 characters', () => {
        const result = loginSchema.safeParse({
          email: 'test@example.com',
          password: '1234567',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            'Password must be at least 8 characters'
          );
        }
      });

      it('should reject empty password', () => {
        const result = loginSchema.safeParse({
          email: 'test@example.com',
          password: '',
        });

        expect(result.success).toBe(false);
      });
    });

    describe('missing fields', () => {
      it('should reject missing email', () => {
        const result = loginSchema.safeParse({
          password: 'password123',
        });

        expect(result.success).toBe(false);
      });

      it('should reject missing password', () => {
        const result = loginSchema.safeParse({
          email: 'test@example.com',
        });

        expect(result.success).toBe(false);
      });

      it('should reject empty object', () => {
        const result = loginSchema.safeParse({});

        expect(result.success).toBe(false);
      });
    });
  });

  describe('registerSchema', () => {
    describe('valid data', () => {
      it('should validate correct registration data', () => {
        const validData = {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        };

        const result = registerSchema.safeParse(validData);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(validData);
        }
      });

      it('should accept long names', () => {
        const result = registerSchema.safeParse({
          name: 'a'.repeat(100),
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        });

        expect(result.success).toBe(true);
      });
    });

    describe('invalid name', () => {

      it('should reject missing name', () => {
        const result = registerSchema.safeParse({
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        });

        expect(result.success).toBe(false);
      });
    });

    describe('invalid email', () => {
      it('should reject invalid email format', () => {
        const result = registerSchema.safeParse({
          name: 'John Doe',
          email: 'invalid-email',
          password: 'password123',
          confirmPassword: 'password123',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Invalid email format');
        }
      });
    });

    describe('invalid password', () => {
      it('should reject password shorter than 8 characters', () => {
        const result = registerSchema.safeParse({
          name: 'John Doe',
          email: 'test@example.com',
          password: '1234567',
          confirmPassword: '1234567',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues.some((issue) => issue.path.includes('password'))).toBe(
            true
          );
        }
      });
    });

    describe('password confirmation', () => {
      it('should reject when passwords do not match', () => {
        const result = registerSchema.safeParse({
          name: 'John Doe',
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password456',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Passwords do not match');
          expect(result.error.issues[0].path).toContain('confirmPassword');
        }
      });

      it('should reject when confirmPassword is empty', () => {
        const result = registerSchema.safeParse({
          name: 'John Doe',
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: '',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          const confirmPasswordErrors = result.error.issues.filter((issue) =>
            issue.path.includes('confirmPassword')
          );
          expect(confirmPasswordErrors.length).toBeGreaterThan(0);
        }
      });

      it('should reject when confirmPassword is missing', () => {
        const result = registerSchema.safeParse({
          name: 'John Doe',
          email: 'test@example.com',
          password: 'password123',
        });

        expect(result.success).toBe(false);
      });

      it('should pass when passwords match exactly', () => {
        const result = registerSchema.safeParse({
          name: 'John Doe',
          email: 'test@example.com',
          password: 'MySecureP@ssw0rd!',
          confirmPassword: 'MySecureP@ssw0rd!',
        });

        expect(result.success).toBe(true);
      });
    });

    describe('multiple validation errors', () => {
      it('should return all validation errors', () => {
        const result = registerSchema.safeParse({
          name: '',
          email: 'invalid',
          password: '123',
          confirmPassword: '456',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues.length).toBeGreaterThan(1);
        }
      });
    });

    describe('missing fields', () => {
      it('should reject empty object', () => {
        const result = registerSchema.safeParse({});

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('type inference', () => {
    it('should correctly infer LoginFormData type', () => {
      const data: LoginFormData = {
        email: 'test@example.com',
        password: 'password123',
      };

      expect(data.email).toBeDefined();
      expect(data.password).toBeDefined();
    });

    it('should correctly infer RegisterFormData type', () => {
      const data: RegisterFormData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      expect(data.name).toBeDefined();
      expect(data.email).toBeDefined();
      expect(data.password).toBeDefined();
      expect(data.confirmPassword).toBeDefined();
    });
  });
});
