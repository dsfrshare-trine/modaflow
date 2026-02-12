import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../middleware/errorHandler.js';
import { geminiService } from '../services/gemini.service.js';

const productDescriptionSchema = z.object({
  productName: z.string().min(2),
  category: z.string(),
  brandName: z.string(),
});

const seoKeywordsSchema = z.object({
  productName: z.string().min(2),
});

const categoryDescriptionSchema = z.object({
  categoryName: z.string().min(2),
  brandName: z.string(),
});

export const generateProductDescription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = productDescriptionSchema.parse(req.body);

    const description = await geminiService.generateProductDescription(
      data.productName,
      data.category,
      data.brandName
    );

    res.json({
      status: 'success',
      data: { description },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
};

export const generateSEOKeywords = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = seoKeywordsSchema.parse(req.body);

    const keywords = await geminiService.generateSEOKeywords(data.productName);

    res.json({
      status: 'success',
      data: { keywords },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
};

export const generateCategoryDescription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = categoryDescriptionSchema.parse(req.body);

    const description = await geminiService.generateCategoryDescription(
      data.categoryName,
      data.brandName
    );

    res.json({
      status: 'success',
      data: { description },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
};
