import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      errorFormat: 'pretty',
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async paginate<T>(model: string, pageable: Pageable): Promise<Page<T>> {
    const { page = 1, size = 20 } = pageable;
    const skip = (page - 1) * size;

    const query = {
      skip,
      take: size,
    };

    const resultPage: Page<T> = {
      content: [],
      metaData: {
        page,
        size,
        totalPages: 0,
      },
    };

    // Add the where clause to the query if it is provided
    const where = {};
    if (
      pageable.filter &&
      pageable.filter.length > 0 &&
      pageable.filter[0].includes('_')
    ) {
      pageable.filter.forEach((filterElement) => {
        const lastIndex = filterElement.indexOf('_');
        const field = filterElement.substring(0, lastIndex);
        const value = filterElement.substring(lastIndex + 1);

        where[field] = value;
      });
      query['where'] = where;
    }

    // Add the orderBy to the query if it is provided
    let isSorted = false;
    if (
      pageable.sort &&
      pageable.sort.length > 0 &&
      pageable.sort[0].includes('_')
    ) {
      const sort = pageable.sort?.map((sortElement) => {
        const [field, order] = sortElement.split('_');
        return {
          [field]: order.toLowerCase(),
        };
      });
      query['orderBy'] = sort;
      resultPage.metaData.sort = sort;
      isSorted = true;
    } else {
      query['orderBy'] = { createdAt: 'desc' };
    }

    console.log('query', query);

    const [data, count] = await Promise.all<[T[], number]>([
      this[model].findMany(query),
      this[model].count(),
    ]);

    const totalPages = Math.ceil(count / size);
    const prev =
      page > 1 ? `${pageable.route}?page=${page - 1}&size=${size}` : '';
    const next =
      page < totalPages
        ? `${pageable.route}?page=${page + 1}&size=${size}`
        : '';

    resultPage.content = data;

    if (pageable.route && pageable.route != '') {
      resultPage.links = {
        first: isSorted
          ? `${pageable.route}?size=${size}&sort=[%22${pageable.sort}%22]`
          : `${pageable.route}?size=${size}`,
        prev:
          isSorted && prev != ''
            ? `${prev}&sort=[%22${pageable.sort}%22]`
            : `${prev}`,
        next:
          isSorted && next != ''
            ? `${next}&sort=[%22${pageable.sort}%22]`
            : `${next}`,
        last: isSorted
          ? `${pageable.route}?page=${totalPages}&size=${size}&sort=[%22${pageable.sort}%22]`
          : `${pageable.route}?page=${totalPages}&size=${size}`,
      };
    }

    resultPage.metaData.totalPages = totalPages;

    return resultPage;
  }
}

type MetaData = {
  page: number;
  size: number;
  totalPages: number;
  sort?: Array<{ [key: string]: 'asc' | 'desc' | string }>;
  filter?: { [key: string]: any };
};

export interface Page<T> {
  content: T[];
  metaData: MetaData;
  links?: Links;
}

export interface Pageable {
  page?: number;
  size?: number;
  sort?: string[];
  filter?: string[];
  include?: string[];
  select?: string[];
  route?: string;
}

type Links = {
  first: string;
  prev: string;
  next: string;
  last: string;
};
