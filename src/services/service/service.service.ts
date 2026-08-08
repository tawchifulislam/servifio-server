import prisma from '../../lib/prisma';
import ApiError from '../../lib/ApiError';

interface CreateServiceInput {
  title: string;
  description: string;
  price: number;
  categoryId: string;
}

interface UpdateServiceInput {
  title?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

const createService = async (
  providerId: string,
  payload: CreateServiceInput,
) => {
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!category || category.isDeleted) {
    throw new ApiError(404, 'Category not found');
  }

  const service = await prisma.service.create({
    data: {
      title: payload.title,
      description: payload.description,
      price: payload.price,
      categoryId: payload.categoryId,
      providerId: providerId,
    },
  });

  return service;
};

const getAllServices = async () => {
  const services = await prisma.service.findMany({
    where: { isDeleted: false, status: 'ACTIVE' },
    include: {
      category: true,
      provider: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return services;
};

const getServiceById = async (id: string) => {
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      category: true,
      provider: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
  });

  if (!service || service.isDeleted) {
    throw new ApiError(404, 'Service not found');
  }

  return service;
};

const updateService = async (
  id: string,
  requesterId: string,
  requesterRole: string,
  payload: UpdateServiceInput,
) => {
  const service = await prisma.service.findUnique({ where: { id } });

  if (!service || service.isDeleted) {
    throw new ApiError(404, 'Service not found');
  }

  if (service.providerId !== requesterId && requesterRole !== 'ADMIN') {
    throw new ApiError(403, 'You can only update your own services');
  }

  const updated = await prisma.service.update({
    where: { id },
    data: payload,
  });

  return updated;
};

const deleteService = async (
  id: string,
  requesterId: string,
  requesterRole: string,
) => {
  const service = await prisma.service.findUnique({ where: { id } });

  if (!service || service.isDeleted) {
    throw new ApiError(404, 'Service not found');
  }

  if (service.providerId !== requesterId && requesterRole !== 'ADMIN') {
    throw new ApiError(403, 'You can only delete your own services');
  }

  const deleted = await prisma.service.update({
    where: { id },
    data: { isDeleted: true },
  });

  return deleted;
};

export const ServiceModuleService = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
