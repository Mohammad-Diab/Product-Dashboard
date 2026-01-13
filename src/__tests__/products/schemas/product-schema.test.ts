import { ProductFormData, productSchema } from "@/features/products/schemas";

describe('product-schema', () => {
  describe('valid data', () => {
    it('should validate correct product data', () => {
      const validData = {
        name: 'Test Product',
        description: 'This is a test product',
        price: 99.99,
        status: 'active' as const,
      };

      const result = productSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should validate product with minimum name length', () => {
      const result = productSchema.safeParse({
        name: 'ABC',
        price: 10,
        status: 'active',
      });

      expect(result.success).toBe(true);
    });

    it('should validate product without description', () => {
      const result = productSchema.safeParse({
        name: 'Product',
        price: 50,
        status: 'inactive',
      });

      expect(result.success).toBe(true);
    });

    it('should validate product with empty description', () => {
      const result = productSchema.safeParse({
        name: 'Product',
        description: '',
        price: 50,
        status: 'active',
      });

      expect(result.success).toBe(true);
    });

    it('should validate product with maximum description length', () => {
      const result = productSchema.safeParse({
        name: 'Product',
        description: 'a'.repeat(500),
        price: 100,
        status: 'active',
      });

      expect(result.success).toBe(true);
    });

    it('should validate product with very small positive price', () => {
      const result = productSchema.safeParse({
        name: 'Cheap Product',
        price: 0.01,
        status: 'active',
      });

      expect(result.success).toBe(true);
    });

    it('should validate product with large price', () => {
      const result = productSchema.safeParse({
        name: 'Expensive Product',
        price: 999999.99,
        status: 'active',
      });

      expect(result.success).toBe(true);
    });

    it('should validate product with decimal price', () => {
      const result = productSchema.safeParse({
        name: 'Product',
        price: 19.95,
        status: 'active',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('invalid name', () => {
    it('should reject name shorter than 3 characters', () => {
      const result = productSchema.safeParse({
        name: 'AB',
        price: 10,
        status: 'active',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name must be at least 3 characters');
      }
    });

    it('should reject empty name', () => {
      const result = productSchema.safeParse({
        name: '',
        price: 10,
        status: 'active',
      });

      expect(result.success).toBe(false);
    });

    it('should reject missing name', () => {
      const result = productSchema.safeParse({
        price: 10,
        status: 'active',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('invalid description', () => {
    it('should reject description exceeding 500 characters', () => {
      const result = productSchema.safeParse({
        name: 'Product',
        description: 'a'.repeat(501),
        price: 10,
        status: 'active',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Description must not exceed 500 characters'
        );
      }
    });

    it('should reject very long description', () => {
      const result = productSchema.safeParse({
        name: 'Product',
        description: 'a'.repeat(1000),
        price: 10,
        status: 'active',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('invalid price', () => {
    it('should reject negative price', () => {
      const result = productSchema.safeParse({
        name: 'Product',
        price: -10,
        status: 'active',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Price must be a positive number');
      }
    });

    it('should reject zero price', () => {
      const result = productSchema.safeParse({
        name: 'Product',
        price: 0,
        status: 'active',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Price must be a positive number');
      }
    });

    it('should reject missing price', () => {
      const result = productSchema.safeParse({
        name: 'Product',
        status: 'active',
      });

      expect(result.success).toBe(false);
    });

    it('should reject non-numeric price', () => {
      const result = productSchema.safeParse({
        name: 'Product',
        price: 'invalid',
        status: 'active',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('invalid status', () => {
    it('should reject invalid status value', () => {
      const result = productSchema.safeParse({
        name: 'Product',
        price: 10,
        status: 'invalid-status',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Status is required');
      }
    });

    it('should reject missing status', () => {
      const result = productSchema.safeParse({
        name: 'Product',
        price: 10,
      });

      expect(result.success).toBe(false);
    });

    it('should reject empty string status', () => {
      const result = productSchema.safeParse({
        name: 'Product',
        price: 10,
        status: '',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('status values', () => {
    it('should accept "active" status', () => {
      const result = productSchema.safeParse({
        name: 'Product',
        price: 10,
        status: 'active',
      });

      expect(result.success).toBe(true);
    });

    it('should accept "inactive" status', () => {
      const result = productSchema.safeParse({
        name: 'Product',
        price: 10,
        status: 'inactive',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('multiple validation errors', () => {
    it('should return all validation errors', () => {
      const result = productSchema.safeParse({
        name: 'AB',
        description: 'a'.repeat(501),
        price: -10,
        status: 'invalid',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(1);
      }
    });

    it('should return errors for all missing required fields', () => {
      const result = productSchema.safeParse({});

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe('edge cases', () => {
    it('should handle null values', () => {
      const result = productSchema.safeParse({
        name: null,
        price: null,
        status: null,
      });

      expect(result.success).toBe(false);
    });

    it('should handle undefined values explicitly', () => {
      const result = productSchema.safeParse({
        name: undefined,
        price: undefined,
        status: undefined,
      });

      expect(result.success).toBe(false);
    });

    it('should handle extra fields gracefully', () => {
      const result = productSchema.safeParse({
        name: 'Product',
        price: 10,
        status: 'active',
        extraField: 'should be ignored',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect('extraField' in result.data).toBe(false);
      }
    });
  });

  describe('type inference', () => {
    it('should correctly infer ProductFormData type', () => {
      const data: ProductFormData = {
        name: 'Product',
        description: 'Description',
        price: 99.99,
        status: 'active',
      };

      expect(data.name).toBeDefined();
      expect(data.price).toBeDefined();
      expect(data.status).toBeDefined();
    });

    it('should allow optional description in type', () => {
      const data: ProductFormData = {
        name: 'Product',
        price: 99.99,
        status: 'active',
      };

      expect(data.description).toBeUndefined();
    });
  });

  describe('real-world scenarios', () => {
    it('should validate complete product form submission', () => {
      const formData = {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 199.99,
        status: 'active' as const,
      };

      const result = productSchema.safeParse(formData);

      expect(result.success).toBe(true);
    });

    it('should validate product update without description', () => {
      const formData = {
        name: 'Updated Product Name',
        price: 149.99,
        status: 'inactive' as const,
      };

      const result = productSchema.safeParse(formData);

      expect(result.success).toBe(true);
    });

    it('should reject incomplete form submission', () => {
      const formData = {
        name: 'Product',
        // Missing price and status
      };

      const result = productSchema.safeParse(formData);

      expect(result.success).toBe(false);
    });
  });
});
