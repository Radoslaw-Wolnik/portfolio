// src/controllers/project.controller.ts
import { Request, Response } from 'express';
import { projectService } from '../services/project.service';
import { NotFoundError, BadRequestError } from '../utils/custom-errors.util';
import Project from '../models/project.model';

export const createProject = async (req: Request, res: Response) => {
  const project = await projectService.createProject(req.body);
  res.status(201).json(project);
};

export const getAllProjects = async (req: Request, res: Response) => {
  const projects = await Project.find();
  res.json(projects);
};

export const getProjectById = async (req: Request, res: Response) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    throw new NotFoundError('Project not found');
  }
  res.json(project);
};

export const updateProject = async (req: Request, res: Response) => {
  const project = await projectService.updateProject(req.params.id, req.body);
  res.json(project);
};

export const deleteProject = async (req: Request, res: Response) => {
  await projectService.deleteProject(req.params.id);
  res.status(204).send();
};

export const startProject = async (req: Request, res: Response) => {
  const project = await projectService.startProject(req.params.id);
  res.json(project);
};

export const stopProject = async (req: Request, res: Response) => {
  const project = await projectService.stopProject(req.params.id);
  res.json(project);
};

export const setDefaultProject = async (req: Request, res: Response) => {
  const project = await projectService.setDefaultProject(req.params.id);
  res.json(project);
};

export const getDefaultProject = async (req: Request, res: Response) => {
  const project = await projectService.getDefaultProject();
  if (!project) {
    throw new NotFoundError('No default project set');
  }
  res.json(project);
};