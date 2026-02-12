import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';

const tenantSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  logoUrl: z.string().url().optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  categories: z.array(z.string()).optional(),
  menuItems: z.array(z.string()).optional(),
  checkoutMode: z.enum(['WHATSAPP', 'PIX']).optional(),
  pixKey: z.string().optional(),
  about: z.string().optional(),
  contactEmail: z.string().email().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroImageUrl: z.string().url().optional(),
});

export const getAllTenants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenants = await prisma.tenant.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        primaryColor: true,
        secondaryColor: true,
        categories: true,
        menuItems: true,
        heroTitle: true,
        heroSubtitle: true,
        heroImageUrl: true,
        createdAt: true,
      },
    });

    const parsedTenants = tenants.map(tenant => ({
      ...tenant,
      categories: JSON.parse(tenant.categories || '[]'),
      menuItems: JSON.parse(tenant.menuItems || '[]'),
    }));

    res.json({
      status: 'success',
      data: { tenants: parsedTenants },
    });
  } catch (error) {
    next(error);
  }
};

export const getTenantBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    const tenant = await prisma.tenant.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
        },
      },
    });

    if (!tenant) {
      throw new AppError('Tenant not found', 404);
    }

    const parsedTenant = {
      ...tenant,
      categories: JSON.parse(tenant.categories || '[]'),
      menuItems: JSON.parse(tenant.menuItems || '[]'),
      products: tenant.products.map(p => ({
        ...p,
        images: JSON.parse(p.images || '[]'),
        sizes: JSON.parse(p.sizes || '[]'),
      })),
    };

    res.json({
      status: 'success',
      data: { tenant: parsedTenant },
    });
  } catch (error) {
    next(error);
  }
};

export const createTenant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = tenantSchema.parse(req.body);

    const existingTenant = await prisma.tenant.findUnique({
      where: { slug: data.slug },
    });

    if (existingTenant) {
      throw new AppError('Slug already in use', 400);
    }

    const tenant = await prisma.tenant.create({
      data: {
        name: data.name,
        slug: data.slug,
        logoUrl: data.logoUrl,
        primaryColor: data.primaryColor || '#6366f1',
        secondaryColor: data.secondaryColor || '#f59e0b',
        categories: JSON.stringify(data.categories || []),
        menuItems: JSON.stringify(data.menuItems || []),
        checkoutMode: data.checkoutMode || 'WHATSAPP',
        pixKey: data.pixKey,
        about: data.about,
        contactEmail: data.contactEmail,
        phone: data.phone,
        whatsapp: data.whatsapp,
        address: data.address,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        heroImageUrl: data.heroImageUrl,
      },
    });

    const parsedTenant = {
      ...tenant,
      categories: JSON.parse(tenant.categories),
      menuItems: JSON.parse(tenant.menuItems),
    };

    res.status(201).json({
      status: 'success',
      data: { tenant: parsedTenant },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
};

export const updateTenant = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = tenantSchema.partial().parse(req.body);

    const existingTenant = await prisma.tenant.findUnique({
      where: { id },
    });

    if (!existingTenant) {
      throw new AppError('Tenant not found', 404);
    }

    if (req.user!.role === 'LOJISTA' && req.user!.tenantId !== id) {
      throw new AppError('You can only update your own tenant', 403);
    }

    const updateData: any = { ...data };
    if (data.categories) updateData.categories = JSON.stringify(data.categories);
    if (data.menuItems) updateData.menuItems = JSON.stringify(data.menuItems);

    const tenant = await prisma.tenant.update({
      where: { id },
      data: updateData,
    });

    const parsedTenant = {
      ...tenant,
      categories: JSON.parse(tenant.categories),
      menuItems: JSON.parse(tenant.menuItems),
    };

    res.json({
      status: 'success',
      data: { tenant: parsedTenant },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
};

export const deleteTenant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const tenant = await prisma.tenant.findUnique({
      where: { id },
    });

    if (!tenant) {
      throw new AppError('Tenant not found', 404);
    }

    await prisma.tenant.update({
      where: { id },
      data: { isActive: false },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
