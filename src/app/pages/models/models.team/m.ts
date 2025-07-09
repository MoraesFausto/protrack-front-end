/*
package br.com.edu.alunos.utfpr.protrack.infrastructure.repositories;

import br.com.edu.alunos.utfpr.protrack.domain.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);
}








package br.com.edu.alunos.utfpr.protrack.application.services;

import br.com.edu.alunos.utfpr.protrack.domain.dtos.task.TaskRequest;
import br.com.edu.alunos.utfpr.protrack.domain.dtos.task.TaskResponse;
import br.com.edu.alunos.utfpr.protrack.domain.models.Task;
import br.com.edu.alunos.utfpr.protrack.domain.models.Team;
import br.com.edu.alunos.utfpr.protrack.domain.models.Employee;
import br.com.edu.alunos.utfpr.protrack.infrastructure.repositories.TaskRepository;
import br.com.edu.alunos.utfpr.protrack.infrastructure.repositories.TeamRepository;
import br.com.edu.alunos.utfpr.protrack.infrastructure.repositories.EmployeeRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final TeamRepository teamRepository;
    private final EmployeeRepository employeeRepository;

    public TaskService(TaskRepository taskRepository, TeamRepository teamRepository, EmployeeRepository employeeRepository) {
        this.taskRepository = taskRepository;
        this.teamRepository = teamRepository;
        this.employeeRepository = employeeRepository;
    }

    public TaskResponse create(TaskRequest request) {
        Team project = teamRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Projeto não encontrado"));

        Employee assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = employeeRepository.findById(request.getAssigneeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado"));
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status("pendente")
                .project(project)
                .assignee(assignee)
                .build();

        Task saved = taskRepository.save(task);
        return toResponse(saved);
    }

    public List<TaskResponse> findAllByProject(Long projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        return tasks.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public TaskResponse update(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getAssigneeId() != null) {
            Employee assignee = employeeRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado"));
            task.setAssignee(assignee);
        }
        // Status update separado, se desejar pode incluir aqui também

        Task updated = taskRepository.save(task);
        return toResponse(updated);
    }

    public TaskResponse updateStatus(Long id, String status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));
        task.setStatus(status);
        Task updated = taskRepository.save(task);
        return toResponse(updated);
    }

    public void delete(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));
        taskRepository.delete(task);
    }

    private TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .projectId(task.getProject().getId())
                .assigneeId(task.getAssignee() != null ? task.getAssignee().getId() : null)
                .build();
    }
}














import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: 'pendente' })
  status: 'pendente' | 'em_andamento' | 'concluida';

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User, (user) => user.tasks, { nullable: true, eager: true })
  @JoinColumn({ name: 'assignee_id' })
  assignee?: User;
}








import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @IsOptional()
  @IsNumber()
  assigneeId?: number;
}






import { IsOptional, IsString, IsNumber, IsIn } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['pendente', 'em_andamento', 'concluida'])
  status?: string;

  @IsOptional()
  @IsNumber()
  assigneeId?: number;
}










import { IsNotEmpty, IsIn } from 'class-validator';

export class UpdateStatusDto {
  @IsNotEmpty()
  @IsIn(['pendente', 'em_andamento', 'concluida'])
  status: string;
}










import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,

    @InjectRepository(Project)
    private projectRepository: Repository<Project>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createDto: CreateTaskDto): Promise<Task> {
    const project = await this.projectRepository.findOne({
      where: { id: createDto.projectId },
    });

    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }

    const task = this.taskRepository.create({
      title: createDto.title,
      description: createDto.description,
      status: 'pendente',
      project,
    });

    if (createDto.assigneeId) {
      const user = await this.userRepository.findOne({
        where: { id: createDto.assigneeId },
      });

      if (!user) throw new NotFoundException('Usuário não encontrado');

      task.assignee = user;
    }

    return this.taskRepository.save(task);
  }

  async findAllByProject(projectId: number): Promise<Task[]> {
    return this.taskRepository.find({
      where: { project: { id: projectId } },
      relations: ['assignee'],
    });
  }

  async update(id: number, updateDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['assignee'],
    });

    if (!task) throw new NotFoundException('Tarefa não encontrada');

    Object.assign(task, updateDto);

    if (updateDto.assigneeId) {
      const user = await this.userRepository.findOne({
        where: { id: updateDto.assigneeId },
      });

      if (!user) throw new NotFoundException('Usuário não encontrado');
      task.assignee = user;
    }

    return this.taskRepository.save(task);
  }

  async updateStatus(id: number, statusDto: UpdateStatusDto): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) throw new NotFoundException('Tarefa não encontrada');

    task.status = statusDto.status;
    return this.taskRepository.save(task);
  }

  async delete(id: number): Promise<void> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) throw new NotFoundException('Tarefa não encontrada');

    await this.taskRepository.remove(task);
  }
}








package br.com.edu.alunos.utfpr.protrack.domain.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false)
    private String status = "pendente";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Team project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private Employee assignee;
}







package br.com.edu.alunos.utfpr.protrack.domain.dtos.task;

import lombok.Data;

@Data
public class TaskRequest {
    private String title;
    private String description;
    private Long projectId;
    private Long assigneeId;
}






package br.com.edu.alunos.utfpr.protrack.domain.dtos.task;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private String status;
    private Long projectId;
    private Long assigneeId;
}


*/
