import { RequestHandler } from 'express';
import statusCodes from 'http-status-codes';
import { isValidObjectId } from 'mongoose';
import BoardModel from '../schemas/board.schema';
import ProjectModel from '../schemas/project.schema';
import ApiError from '../utils/ApiError';

export const addBoard: RequestHandler = async (req, res) => {
  const { project } = req.body;
  if (!project || !isValidObjectId(project)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  const projectData = await ProjectModel.findById(project.toString());
  if (!projectData) throw new ApiError('project.notFound', statusCodes.BAD_REQUEST);

  const existedBoard = await BoardModel.findOne({ project: project.toString(), name: req.body.name.trim() });
  if (existedBoard) throw new ApiError('board.exists', statusCodes.BAD_REQUEST);

  const board = await BoardModel.create(req.body);
  if (!board) throw new ApiError('board.notCreated', statusCodes.BAD_REQUEST);

  res.send(board);
};

export const deleteBoard: RequestHandler = async (req, res) => {
  const { id } = req.body;
  if (!isValidObjectId(id)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);
  const board = await BoardModel.findById(id);
  if (!board) throw new ApiError('board.notFound', statusCodes.BAD_REQUEST);
  await board.remove();
  res.send(board);
};

export const updateBoard: RequestHandler = async (req, res) => {
  const { id, project, ...data } = req.body;

  if (!project || !id || !isValidObjectId(id) || !isValidObjectId(project))
    throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  const projectData = await ProjectModel.findById(project.toString());
  if (!projectData) throw new ApiError('project.notFound', statusCodes.BAD_REQUEST);

  const existedBoard = await BoardModel.findOne({ project: project.toString(), name: req.body.name.trim() });
  if (existedBoard && existedBoard._id.toString() !== id.toString())
    throw new ApiError('board.exists', statusCodes.BAD_REQUEST);

  const board = await BoardModel.findByIdAndUpdate(id, data, { new: true });
  if (!board) throw new ApiError('board.notFound', statusCodes.BAD_REQUEST);
  res.send(board);
};

export const getBoard: RequestHandler = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  const board = await BoardModel.findById(id);
  if (!board) throw new ApiError('board.notFound', statusCodes.BAD_REQUEST);

  res.send(board);
};

export const getBoards: RequestHandler = async (req, res) => {
  const { project } = req.query as { project: string };
  const boards = await BoardModel.find({ project: project.toString() }).populate('project');
  if (!boards) throw new ApiError('board.notCreated', statusCodes.BAD_REQUEST);

  res.send(boards);
};
