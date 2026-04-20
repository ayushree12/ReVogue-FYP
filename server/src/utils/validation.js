const { z } = require('zod');

const createValidator = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: result.error.errors.map((e) => e.message).join(', ') });
  }
  req.body = result.data;
  next();
};

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const productSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().nonnegative(),
  condition: z.enum(['new', 'like_new', 'good', 'fair']),
  size: z.string(),
  categoryId: z.string()
});

module.exports = {
  createValidator,
  registerSchema,
  loginSchema,
  productSchema
};
