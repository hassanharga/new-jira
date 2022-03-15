import { RequestHandler } from 'express';
import statusCodes from 'http-status-codes';
import { isValidObjectId } from 'mongoose';
import UserModel from '../schemas/user.schema';
import ApiError from '../utils/ApiError';

export const addUser: RequestHandler = async (req, res) => {
  const user = await UserModel.create(req.body);
  if (!user) throw new ApiError('user.notCreated', statusCodes.BAD_REQUEST);

  res.send(user);
};

export const deleteUser: RequestHandler = async (req, res) => {
  const { id } = req.body;
  if (!isValidObjectId(id)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  const user = await UserModel.findById(id);
  if (!user) throw new ApiError('user.notFound', statusCodes.BAD_REQUEST);
  await user.remove();

  res.send(user);
};

export const updateUser: RequestHandler = async (req, res) => {
  const { id, name, username, email } = req.body;

  if (!isValidObjectId(id)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  const user = await UserModel.findById(id);
  if (!user) throw new ApiError('user.notFound', statusCodes.BAD_REQUEST);

  if (name) user.name = name;
  if (username) user.username = username;
  if (email) user.email = email;

  await user.save();

  res.send(user);
};

export const getUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError('errorMsg.badCredentials', statusCodes.BAD_REQUEST);

  const user = await UserModel.findById(id);
  if (!user) throw new ApiError('user.notFound', statusCodes.BAD_REQUEST);

  res.send(user);
};

export const getUsers: RequestHandler = async (req, res) => {
  const { search = '' } = req.query as { search: string };
  const query: Record<string, any> = {};
  if (search) query.name = { $regex: search, $options: 'i' };

  const Users = await UserModel.find(query);
  if (!Users) throw new ApiError('User.notFound', statusCodes.BAD_REQUEST);

  res.send(Users);
};
