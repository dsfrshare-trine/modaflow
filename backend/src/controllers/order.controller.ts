import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

const orderSchema = z.object({
  tenantId: z.string(),
  customerName: z.string().min(2),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  items: z.array(orderItemSchema).min(1),
});

const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      status: 'success',
      data: { orders },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrdersByTenant = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { tenantId } = req.params;

    if (req.user!.role === 'LOJISTA' && req.user!.tenantId !== tenantId) {
      throw new AppError('You can only view orders from your own tenant', 403);
    }

    const orders = await prisma.order.findMany({
      where: { tenantId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      status: 'success',
      data: { orders },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (
      req.user!.role === 'CUSTOMER' &&
      order.userId !== req.user!.id
    ) {
      throw new AppError('You can only view your own orders', 403);
    }

    if (
      req.user!.role === 'LOJISTA' &&
      order.tenantId !== req.user!.tenantId
    ) {
      throw new AppError('You can only view orders from your own tenant', 403);
    }

    res.json({
      status: 'success',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = orderSchema.parse(req.body);

    const productIds = data.items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        tenantId: data.tenantId,
        isActive: true,
      },
    });

    if (products.length !== productIds.length) {
      throw new AppError('One or more products not found or inactive', 400);
    }

    for (const item of data.items) {
      const product = products.find(p => p.id === item.productId);
      if (product && item.quantity < product.minQuantity) {
        throw new AppError(
          `Minimum quantity for ${product.name} is ${product.minQuantity}`,
          400
        );
      }
    }

    const total = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        tenantId: data.tenantId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        total,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.status(201).json({
      status: 'success',
      data: { order },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = updateStatusSchema.parse(req.body);

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new AppError('Order not found', 404);
    }

    if (req.user!.role === 'LOJISTA' && req.user!.tenantId !== existingOrder.tenantId) {
      throw new AppError('You can only update orders from your own tenant', 403);
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status: data.status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json({
      status: 'success',
      data: { order },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    await prisma.order.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
