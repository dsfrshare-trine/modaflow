import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';

const productSchema = z.object({
  tenantId: z.string(),
  name: z.string().min(2),
  description: z.string(),
  price: z.number().positive(),
  category: z.string(),
  images: z.array(z.string().url()),
  sizes: z.array(z.string()),
  stock: z.number().int().min(0).optional(),
  minQuantity: z.number().int().positive().optional(),
});

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;

    const where: any = { isActive: true };

    if (category) where.category = category as string;
    if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice as string) };
    if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice as string) };
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    const parsedProducts = products.map(p => ({
      ...p,
      images: JSON.parse(p.images),
      sizes: JSON.parse(p.sizes),
    }));

    res.json({
      status: 'success',
      data: { products: parsedProducts },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductsByTenant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tenantId } = req.params;

    const products = await prisma.product.findMany({
      where: {
        tenantId,
        isActive: true,
      },
    });

    const parsedProducts = products.map(p => ({
      ...p,
      images: JSON.parse(p.images),
      sizes: JSON.parse(p.sizes),
    }));

    res.json({
      status: 'success',
      data: { products: parsedProducts },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const parsedProduct = {
      ...product,
      images: JSON.parse(product.images),
      sizes: JSON.parse(product.sizes),
    };

    res.json({
      status: 'success',
      data: { product: parsedProduct },
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = productSchema.parse(req.body);

    if (req.user!.role === 'LOJISTA' && req.user!.tenantId !== data.tenantId) {
      throw new AppError('You can only create products for your own tenant', 403);
    }

    const product = await prisma.product.create({
      data: {
        tenantId: data.tenantId,
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        images: JSON.stringify(data.images),
        sizes: JSON.stringify(data.sizes),
        stock: data.stock || 0,
        minQuantity: data.minQuantity || 10,
      },
    });

    const parsedProduct = {
      ...product,
      images: JSON.parse(product.images),
      sizes: JSON.parse(product.sizes),
    };

    res.status(201).json({
      status: 'success',
      data: { product: parsedProduct },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
};

export const updateProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = productSchema.partial().parse(req.body);

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new AppError('Product not found', 404);
    }

    if (req.user!.role === 'LOJISTA' && req.user!.tenantId !== existingProduct.tenantId) {
      throw new AppError('You can only update products from your own tenant', 403);
    }

    const updateData: any = { ...data };
    if (data.images) updateData.images = JSON.stringify(data.images);
    if (data.sizes) updateData.sizes = JSON.stringify(data.sizes);

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    const parsedProduct = {
      ...product,
      images: JSON.parse(product.images),
      sizes: JSON.parse(product.sizes),
    };

    res.json({
      status: 'success',
      data: { product: parsedProduct },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (req.user!.role === 'LOJISTA' && req.user!.tenantId !== product.tenantId) {
      throw new AppError('You can only delete products from your own tenant', 403);
    }

    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
