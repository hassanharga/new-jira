import { RequestHandler } from 'express';
import statusCodes from 'http-status-codes';
import { isValidObjectId } from 'mongoose';
import ProjectModel from '../schemas/project.schema';
import ApiError from '../utils/ApiError';

export const addProject: RequestHandler = async (req, res) => {
  const project = await ProjectModel.create(req.body);
  if (!project) throw new ApiError('project.notCreated', statusCodes.BAD_REQUEST);

  res.send(project);
};

export const deleteProject: RequestHandler = async (req, res) => {
  const { id } = req.body;
  if (!isValidObjectId(id)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  const project = await ProjectModel.findById(id);
  if (!project) throw new ApiError('project.notFound', statusCodes.BAD_REQUEST);
  await project.remove();

  res.send(project);
};

export const updateProject: RequestHandler = async (req, res) => {
  const { id, ...data } = req.body;
  if (!isValidObjectId(id)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  const project = await ProjectModel.findByIdAndUpdate(id, data, { new: true });
  if (!project) throw new ApiError('project.notFound', statusCodes.BAD_REQUEST);

  res.send(project);
};

export const getProject: RequestHandler = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  const project = await ProjectModel.findById(id);
  if (!project) throw new ApiError('project.notFound', statusCodes.BAD_REQUEST);

  res.send(project);
};

export const getProjects: RequestHandler = async (req, res) => {
  const { search = '' } = req.query as { search: string };
  const query: Record<string, any> = {};
  if (search) query.name = { $regex: search, $options: 'i' };
  const projects = await ProjectModel.find(query);
  if (!projects) throw new ApiError('project.notCreated', statusCodes.BAD_REQUEST);

  res.send(projects);
};
