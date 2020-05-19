import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagService } from '../tag/tag.service';
import { CategoryService } from '../category/category.service';
import { Project } from './project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly tagService: TagService,
    private readonly categoryService: CategoryService
  ) {}

  /**
   * 创建项目
   * @param article
   */
  async create(article: Partial<Project>): Promise<Project> {
    const { title } = article;
    const exist = await this.projectRepository.findOne({ where: { title } });

    if (exist) {
      throw new HttpException('项目已存在', HttpStatus.BAD_REQUEST);
    }

    let { tags, category } = article;
    tags = await this.tagService.findByIds(('' + tags).split(','));
    let existCategory = await this.categoryService.findById(category);
    const newProject = await this.projectRepository.create({
      ...article,
      category: existCategory,
      tags,
      needPassword: !!article.password,
    });
    await this.projectRepository.save(newProject);
    return newProject;
  }

  /**
   * 获取所有项目
   */
  async findAll(queryParams: any = {}): Promise<[Project[], number]> {
    const query = this.projectRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.tags', 'tag')
      .leftJoinAndSelect('article.category', 'category')
      .orderBy('article.publishAt', 'DESC');

    const { page = 1, pageSize = 12, status, ...otherParams } = queryParams;

    query.skip((+page - 1) * +pageSize);
    query.take(+pageSize);

    if (status) {
      query.andWhere('article.status=:status').setParameter('status', status);
    }

    if (otherParams) {
      Object.keys(otherParams).forEach(key => {
        query
          .andWhere(`article.${key} LIKE :${key}`)
          .setParameter(`${key}`, `%${otherParams[key]}%`);
      });
    }

    const [data, total] = await query.getManyAndCount();

    data.forEach(d => {
      if (d.needPassword) {
        delete d.content;
      }
    });

    return [data, total];
  }

  /**
   * 根据 category 查找项目
   * @param category
   * @param queryParams
   */
  async findProjectsByCategory(category, queryParams) {
    const query = this.projectRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .where('category.value=:value', { value: category })
      .orderBy('article.publishAt', 'DESC');

    const { page, pageSize, status } = queryParams;
    query.skip((+page - 1) * +pageSize);
    query.take(+pageSize);

    if (status) {
      query.andWhere('article.status=:status').setParameter('status', status);
    }

    const [data, total] = await query.getManyAndCount();

    data.forEach(d => {
      if (d.needPassword) {
        delete d.content;
      }
    });

    return [data, total];
  }

  /**
   * 根据 tag 查找项目
   * @param tag
   * @param queryParams
   */
  async findProjectsByTag(tag, queryParams) {
    const query = this.projectRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.tags', 'tag')
      .where('tag.value=:value', { value: tag })
      .orderBy('article.publishAt', 'DESC');

    const { page, pageSize, status } = queryParams;
    query.skip((+page - 1) * +pageSize);
    query.take(+pageSize);

    if (status) {
      query.andWhere('article.status=:status').setParameter('status', status);
    }

    const [data, total] = await query.getManyAndCount();

    data.forEach(d => {
      if (d.needPassword) {
        delete d.content;
      }
    });

    return [data, total];
  }

  /**
   * 获取项目归档
   */
  async getArchives(): Promise<{ [key: string]: Project[] }> {
    const data = await this.projectRepository.find({
      where: { status: 'publish' },
      order: { publishAt: 'DESC' },
    } as any);
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    let ret = {};

    data.forEach(d => {
      const year = new Date(d.publishAt).getFullYear();
      const month = new Date(d.publishAt).getMonth();

      if (d.needPassword) {
        delete d.content;
      }

      if (!ret[year]) {
        ret[year] = {};
      }

      if (!ret[year][months[month]]) {
        ret[year][months[month]] = [];
      }

      ret[year][months[month]].push(d);
    });

    return ret;
  }

  /**
   * 校验项目密码是否正确
   * @param id
   * @param password
   */
  async checkPassword(id, { password }): Promise<{ pass: boolean }> {
    const data = await this.projectRepository
      .createQueryBuilder('article')
      .where('article.id=:id')
      .andWhere('article.password=:password')
      .setParameter('id', id)
      .setParameter('password', password)
      .getOne();

    let pass = !!data;
    return pass ? { pass: !!data, ...data } : { pass: false };
  }

  /**
   * 获取指定项目信息
   * @param id
   */
  async findById(id, status = null, isAdmin = false): Promise<Project> {
    const query = this.projectRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tags')
      .where('article.id=:id')
      .orWhere('article.title=:title')
      .setParameter('id', id)
      .setParameter('title', id);

    if (status) {
      query.andWhere('article.status=:status').setParameter('status', status);
    }

    const data = await query.getOne();

    if (data && data.needPassword && !isAdmin) {
      delete data.content;
    }

    return data;
  }

  /**
   * 更新指定项目
   * @param id
   * @param article
   */
  async updateById(id, article: Partial<Project>): Promise<Project> {
    const oldProject = await this.projectRepository.findOne(id);
    let { tags, category, status } = article;

    if (tags) {
      tags = await this.tagService.findByIds(('' + tags).split(','));
    }

    let existCategory = await this.categoryService.findById(category);

    const newProject = {
      ...article,
      views: oldProject.views,
      category: existCategory,
      needPassword: !!article.password,
      publishAt:
        oldProject.status === 'draft' && status === 'publish'
          ? new Date()
          : oldProject.publishAt,
    };

    if (tags) {
      Object.assign(newProject, { tags });
    }

    const updatedProject = await this.projectRepository.merge(
      oldProject,
      newProject
    );
    return this.projectRepository.save(updatedProject);
  }

  /**
   * 更新指定项目阅读量 + 1
   * @param id
   * @param article
   */
  async updateViewsById(id): Promise<Project> {
    const oldProject = await this.projectRepository.findOne(id);
    const updatedProject = await this.projectRepository.merge(oldProject, {
      views: oldProject.views + 1,
    });
    return this.projectRepository.save(updatedProject);
  }

  /**
   * 删除项目
   * @param id
   */
  async deleteById(id) {
    const article = await this.projectRepository.findOne(id);
    return this.projectRepository.remove(article);
  }

  /**
   * 关键词搜索项目
   * @param keyword
   */
  async search(keyword) {
    const res = await this.projectRepository
      .createQueryBuilder('article')
      .where('article.title LIKE :keyword')
      .orWhere('article.summary LIKE :keyword')
      .orWhere('article.content LIKE :keyword')
      .setParameter('keyword', `%${keyword}%`)
      .getMany();

    return res;
  }

  /**
   * 推荐项目
   * @param articleId
   */
  async recommend(articleId = null) {
    const query = this.projectRepository
      .createQueryBuilder('article')
      .orderBy('article.publishAt', 'DESC')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tags');

    if (!articleId) {
      query.where('article.status=:status').setParameter('status', 'publish');
      return query.take(6).getMany();
    } else {
      const sub = this.projectRepository
        .createQueryBuilder('article')
        .orderBy('article.publishAt', 'DESC')
        .leftJoinAndSelect('article.category', 'category')
        .leftJoinAndSelect('article.tags', 'tags')
        .where('article.id=:id')
        .setParameter('id', articleId);
      const exist = await sub.getOne();

      if (!exist) {
        return query.take(6).getMany();
      }

      const { title, summary } = exist;

      try {
        const nodejieba = require('nodejieba');
        const topN = 4;
        const kw1 = nodejieba.extract(title, topN);
        const kw2 = nodejieba.extract(summary, topN);

        kw1.forEach((kw, i) => {
          let paramKey = `title_` + i;
          if (i === 0) {
            query.where(`article.title LIKE :${paramKey}`);
          } else {
            query.orWhere(`article.title LIKE :${paramKey}`);
          }
          query.setParameter(paramKey, `%${kw.word}%`);
        });

        kw2.forEach((kw, i) => {
          let paramKey = `summary_` + i;
          if (!kw1.length) {
            query.where(`article.summary LIKE :${paramKey}`);
          } else {
            query.orWhere(`article.summary LIKE :${paramKey}`);
          }
          query.setParameter(paramKey, `%${kw.word}%`);
        });
      } catch (e) {}

      const data = await query.getMany();
      return data.filter(d => d.id !== articleId && d.status === 'publish');
    }
  }
}
