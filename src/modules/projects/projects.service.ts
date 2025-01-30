import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProjectDocument, Projects } from './entities/project.entity';
import { Model, Types } from 'mongoose';
import { ProjectMember, ProjectMemberDocument } from './entities/project-member.entity';
import { User, UserDocument } from '../users/entities/user.entity';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor (
    @InjectModel(Projects.name) private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(ProjectMember.name) private readonly projectMemberModel: Model<ProjectMemberDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async create(createProjectDto: CreateProjectDto) {
    const newProjectInstance = new this.projectModel({...createProjectDto})
    return newProjectInstance.save();
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const {project_members = []} = updateProjectDto
    const project = await this.projectModel.findById(id).populate({
      path: 'project_members',
      populate: {
        path: 'user',
        select: '_id name email username'
      }
    });
    if (!project) {
      throw new BadRequestException('Project not found');
    }    
    if (project_members?.length > 0) {
        const projectMembers = await Promise.all(
            project_members.map(async member => {
              const memberDetail = await this.userModel.findById(member?.id)
                const response = await this.projectMemberModel.findOneAndUpdate({
                    project_id: new Types.ObjectId(id),
                    user: memberDetail?._id
                }, {
                    role: member.role,
                    user: memberDetail,
                    project_id: new Types.ObjectId(id)
                }, { new: true, upsert: true }).exec();
                return response.id;
            })
        );
        project.project_members = projectMembers;
    }

    project.name = updateProjectDto.name ?? project.name;
    project.description = updateProjectDto.description ?? project.description;

    return (await project.save()).populate({
      path: 'project_members',
      select: 'user role',
      populate: {
        path: 'user',
        select: '_id name email username'
      }
    });
  }

  async findById(id: string) {
    const projectDetails = await this.projectModel.findById(id).exec();
    return projectDetails?.toObject();
  }

  async removeCollaborator(projectId: string, userId: string) {
    const memberDetail = await this.userModel.findById(userId)
    const response =  await this.projectMemberModel.findOneAndDelete({
      project_id: projectId,
      user: memberDetail 
    })
    const updatedResponse = (await this.projectModel.findByIdAndUpdate(projectId, {
      $pull: {project_members: response?.id}
    }, {new: true}).exec())?.populate(
      {
        path: 'project_members',
        select: 'user role',
        populate: {
          path: 'user',
          select: '_id name email username'
        }
      }
    )
    return updatedResponse
  }

  async archiveProject(projectId: string) {
    const updatedResponse = (await this.projectModel.findByIdAndUpdate(projectId, {
      is_deleted: true
    }, {new: true}).exec())?.populate(
      {
        path: 'project_members',
        select: 'user role',
        populate: {
          path: 'user',
          select: '_id name email username'
        }
      }
    )
    return updatedResponse
  }
}
