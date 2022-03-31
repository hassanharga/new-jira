import { RequestHandler } from 'express';
import statusCodes from 'http-status-codes';
import { isValidObjectId } from 'mongoose';
import TestModuleModel from '../schemas/testModule.schema';
import TestCaseModel from '../schemas/testCase.schema';
import ApiError from '../utils/ApiError';

export const addTestModule: RequestHandler = async (req, res) => {
  const module = await (await TestModuleModel.create(req.body)).populate('testCases');
  if (!module) throw new ApiError('module.notCreated', statusCodes.BAD_REQUEST);

  res.send(module);
};

export const deleteTestModule: RequestHandler = async (req, res) => {
  const { id } = req.body;
  if (!isValidObjectId(id)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  const module = await TestModuleModel.findById(id);
  if (!module) throw new ApiError('module.notFound', statusCodes.BAD_REQUEST);
  await module.remove();

  res.send(module);
};

export const getTestModule: RequestHandler = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  const module = await TestModuleModel.findById(id).populate('testCases');
  if (!module) throw new ApiError('module.notFound', statusCodes.BAD_REQUEST);

  res.send(module);
};

export const getTestModules: RequestHandler = async (req, res) => {
  const { project } = req.query;
  if (!isValidObjectId(project)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  const modules = await TestModuleModel.find({ project }).populate('testCases');
  if (!modules) throw new ApiError('module.notFound', statusCodes.BAD_REQUEST);

  res.send(modules);
};

export const addTestCase: RequestHandler = async (req, res) => {
  const { module } = req.params as { module: string };
  if (!isValidObjectId(module)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  const moduleData = await TestModuleModel.findById(module);
  if (!moduleData) throw new ApiError('module.notFound', statusCodes.BAD_REQUEST);

  const testCase = await TestCaseModel.create({ ...req.body, module });
  if (!testCase) throw new ApiError('testCase.notCreated', statusCodes.BAD_REQUEST);

  moduleData.testCases.push(testCase._id);
  await moduleData.save();

  res.send(testCase);
};

