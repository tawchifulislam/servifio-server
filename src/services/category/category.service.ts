import prisma from '../../lib/prisma';
import ApiError from '../../lib/ApiError';

interface CreateCategoryInput {
  name: string;
  description?: string;
  icon?: string;
}

interface UpdateCategoryInput {
  name?: string;
  description?: string;
  icon?: string;
}

const createCategory = async (payload: CreateCategoryInput) => {
  const existing = await prisma.category.findUnique({
    where: { name: payload.name },
  });

  if (existing) {
    throw new ApiError(409, 'Category already exists with this name');
  }

  const category = await prisma.category.create({
    data: {
      name: payload.name,
      description: payload.description ?? null,
      icon: payload.icon ?? null,
    },
  });

  return category;
};

const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: 'desc' },
  });

  return categories;
};

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category || category.isDeleted) {
    throw new ApiError(404, 'Category not found');
  }

  return category;
};

const updateCategory = async (id: string, payload: UpdateCategoryInput) => {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category || category.isDeleted) {
    throw new ApiError(404, 'Category not found');
  }

  const updated = await prisma.category.update({
    where: { id },
    data: payload,
  });

  return updated;
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category || category.isDeleted) {
    throw new ApiError(404, 'Category not found');
  }

  const deleted = await prisma.category.update({
    where: { id },
    data: { isDeleted: true },
  });

  return deleted;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
