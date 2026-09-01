---
title: 如何使用 NestJs 创建分页、可排序和可过滤的接口
categories:
  - 解决方案
date: 2023-09-01T14:00:00.000-05:00
tags:
  - 笔记
  - Node.js
  - Nest.js
draft: false
cover: ./images/cover.jpg
---

分页、排序和过滤是用于处理 API 返回的大型数据集的常用技术，例如在列出端点时。它们对于优化性能、改善用户体验和减少服务器（以及客户端）负载至关重要。在深入研究一些 NestJs 代码之前，让我们简要讨论一下这个概念。


## **分页**


包括将大型数据集划分为较小的页面并以增量、有组织的方式将此数据提供给客户端的过程。这提高了客户端的渲染速度，并减少了通过网络发送的数据量。


假设您的数据库上有一个城市表。例如，巴西有超过 5.500 个城市。每次用户调用它时都返回所有这些是不合理的。相反，我们可以一次发送 20 个，并相应地渲染它们（例如表或下拉列表）负责请求正确的数据。


前端如何能够“请求正确的数据”？这很简单，我们通常使用页面和大小等查询参数来指定要获取的页面和结果数量。


在分页资源响应中，通常包括其他元数据以及提取的数据，以提供有关分页的相关信息。这样做可以让客户端更好地编排请求。


例如，我们可以返回总项目计数和总页数，然后客户端将知道有多少页仍可供获取。


**一个简单的例子**


让我们了解一下这将如何与我们的城市表配合使用。假设我们的数据库如下所示。


```markdown
ID      | NAME              | STATE_ID
--------|-------------------|---------
1       | São Paulo         | 1
2       | Santos            | 1
3       | Campinas          | 1
4       | Rio de Janeiro    | 2
5       | Niterói           | 2
6       | Belo Horizonte    | 3
7       | Brasília          | 4
8       | Curitiba          | 5
9       | Porto Alegre      | 6
10      | Florianópolis     |
```


理想中的接口应该是下面这样的：

- [`https://our-api/v1/cities?page=0&size=2`](https://our-api/v1/cities?page=0&size=2%3A)
- [`https://our-api/v1/cities?page=1&size=2`](https://our-api/v1/cities?page=0&size=2%3A)
- [`https://our-api/v1/cities?page=0&size=`](https://our-api/v1/cities?page=0&size=2%3A)`4`

## **排序和筛选**


排序是指根据特定条件和特定字段对数据进行排序。筛选是指根据其他一些条件（也基于特定字段）选择特定的数据条目。


在使用Nest.js的过程中，要习惯其类spring的风格，所有接下来的代码会不太一样。首先，使用自定义装饰器来获取客户端传递过来的参数。


## **@PaginationParams()**


第一个装饰器负责从 HTTP 请求查询字符串中提取和验证分页参数。


```typescript
import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface Pagination {
    page: number;
    limit: number;
    size: number;
    offset: number;
}

export const PaginationParams = createParamDecorator((data, ctx: ExecutionContext): Pagination => {
    const req: Request = ctx.switchToHttp().getRequest();
    const page = parseInt(req.query.page as string);
    const size = parseInt(req.query.size as string);

    // check if page and size are valid
    if (isNaN(page) || page < 0 || isNaN(size) || size < 0) {
        throw new BadRequestException('Invalid pagination params');
    }
    // do not allow to fetch large slices of the dataset
    if (size > 100) {
        throw new BadRequestException('Invalid pagination params: Max size is 100');
    }

    // calculate pagination parameters
    const limit = size;
    const offset = page * limit;
    return { page, limit, size, offset };
});
```


从查询中提取页面和大小并对其进行验证后，装饰器返回一个对象，其中包含将采用多少项（限制）和将跳过多少项（偏移量）的信息。


## **@SortingParams(validParams)**


负责将格式 `paramName:direction` 的查询参数解析为对象，验证方向和参数是否有效。是 `direction` `asc` 和 `desc` 的有效值，有效参数是控制器发送的字符串数组。


```typescript
import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface Sorting {
    property: string;
    direction: string;
}

export const SortingParams = createParamDecorator((validParams, ctx: ExecutionContext): Sorting => {
    const req: Request = ctx.switchToHttp().getRequest();
    const sort = req.query.sort as string;
    if (!sort) return null;
    
    // check if the valid params sent is an array
    if (typeof validParams != 'object') throw new BadRequestException('Invalid sort parameter');

    // check the format of the sort query param
    const sortPattern = /^([a-zA-Z0-9]+):(asc|desc)$/;
    if (!sort.match(sortPattern)) throw new BadRequestException('Invalid sort parameter');

    // extract the property name and direction and check if they are valid
    const [property, direction] = sort.split(':');
    if (!validParams.includes(property)) throw new BadRequestException(`Invalid sort property: ${property}`);

    return { property, direction };
});
```


## **@FilteringParms(validParams)**


这个装饰器负责解析格式的过滤参数（在本例中，我们一次只能过滤一列）， `paramName:rule:value` 。


```typescript
import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface Filtering {
    property: string;
    rule: string;
    value: string;
}

// valid filter rules
export enum FilterRule {
    EQUALS = 'eq',
    NOT_EQUALS = 'neq',
    GREATER_THAN = 'gt',
    GREATER_THAN_OR_EQUALS = 'gte',
    LESS_THAN = 'lt',
    LESS_THAN_OR_EQUALS = 'lte',
    LIKE = 'like',
    NOT_LIKE = 'nlike',
    IN = 'in',
    NOT_IN = 'nin',
    IS_NULL = 'isnull',
    IS_NOT_NULL = 'isnotnull',
}

export const FilteringParams = createParamDecorator((data, ctx: ExecutionContext): Filtering => {
    const req: Request = ctx.switchToHttp().getRequest();
    const filter = req.query.filter as string;
    if (!filter) return null;

    // check if the valid params sent is an array
    if (typeof data != 'object') throw new BadRequestException('Invalid filter parameter');

    // validate the format of the filter, if the rule is 'isnull' or 'isnotnull' it don't need to have a value
    if (!filter.match(/^[a-zA-Z0-9_]+:(eq|neq|gt|gte|lt|lte|like|nlike|in|nin):[a-zA-Z0-9_,]+$/) && !filter.match(/^[a-zA-Z0-9_]+:(isnull|isnotnull)$/)) {
        throw new BadRequestException('Invalid filter parameter');
    }

    // extract the parameters and validate if the rule and the property are valid
    const [property, rule, value] = filter.split(':');
    if (!data.includes(property)) throw new BadRequestException(`Invalid filter property: ${property}`);
    if (!Object.values(FilterRule).includes(rule as FilterRule)) throw new BadRequestException(`Invalid filter rule: ${rule}`);

    return { property, rule, value };
});
```


最后但并非最不重要的一点是，编写一些辅助函数来生成我们的 where 对象和订单对象，以便与 TypeORM Repository 方法一起使用。如果使用其他的ORM工具，按照对应用法修改即可。


```typescript
import { IsNull, Not, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, ILike, In } from "typeorm";

import { Filtering } from "src/helpers/decorators/filtering-params.decorator"
import { Sorting } from "src/helpers/decorators/sorting-params.decorator";
import { FilterRule } from "src/helpers/decorators/filtering-params.decorator";

export const getOrder = (sort: Sorting) => sort ? { [sort.property]: sort.direction } : {};

export const getWhere = (filter: Filtering) => {
    if (!filter) return {};
    
    if (filter.rule == FilterRule.IS_NULL) return { [filter.property]: IsNull() };
    if (filter.rule == FilterRule.IS_NOT_NULL) return { [filter.property]: Not(IsNull()) };
    if (filter.rule == FilterRule.EQUALS) return { [filter.property]: filter.value };
    if (filter.rule == FilterRule.NOT_EQUALS) return { [filter.property]: Not(filter.value) };
    if (filter.rule == FilterRule.GREATER_THAN) return { [filter.property]: MoreThan(filter.value) };
    if (filter.rule == FilterRule.GREATER_THAN_OR_EQUALS) return { [filter.property]: MoreThanOrEqual(filter.value) };
    if (filter.rule == FilterRule.LESS_THAN) return { [filter.property]: LessThan(filter.value) };
    if (filter.rule == FilterRule.LESS_THAN_OR_EQUALS) return { [filter.property]: LessThanOrEqual(filter.value) };
    if (filter.rule == FilterRule.LIKE) return { [filter.property]: ILike(`%${filter.value}%`) };
    if (filter.rule == FilterRule.NOT_LIKE) return { [filter.property]: Not(ILike(`%${filter.value}%`)) };
    if (filter.rule == FilterRule.IN) return { [filter.property]: In(filter.value.split(',')) };
    if (filter.rule == FilterRule.NOT_IN) return { [filter.property]: Not(In(filter.value.split(','))) };
}
```


函数基本上基于修饰器返回的属性创建对象。例如，如果过滤器是 `city:like:Campinas` ，我们将得到：


```plain text
{
    city: ILike(`%Campinas%`)
}
```


还需要一个特定的 DTO 在从分页资源返回数据时使用


```plain text
export type PaginatedResource<T> = {
    totalItems: number;
    items: T[];
    page: number;
    size: number;
};
```


准备就绪之后，接下来开始Controller和Service部分的开发。


```typescript
@Controller('cities')
export class CitiesController {
    private readonly logger = new Logger(CitiesController.name);
    
    constructor(
        private readonly cityService: CityService,
    ) { }
        
    @Get()
    @HttpCode(HttpStatus.OK)
    public async getCities(
        @PaginationParams() paginationParams: Pagination,
        @SortingParams(['name', 'id', 'stateId']) sort?: Sorting,
        @FilteringParams(['name', 'id', 'stateId']) filter?: Filtering
    ): Promise<PaginatedResource<Partial<City>>> {
        this.logger.log(`REST request to get cities: ${JSON.stringify(paginationParams)}, ${sort}, ${filter}`);
        return await this.cityService.getCities(paginationParams, sort, filter);
    }
}
```


```typescript
@Injectable()
export class CityService {
    constructor(
        @InjectRepository(City)
        private readonly cityRepository: Repository<City>,
    ) { }

    public async getCities(
        { page, limit, size, offset }: Pagination,
        sort?: Sorting,
        filter?: Filtering,
    ): Promise<PaginatedResource<Partial<Language>>> {
        const where = getWhere(filter);
        const order = getOrder(sort);

        const [languages, total] = await this.cityRepository.findAndCount({
            where,
            order,
            take: limit,
            skip: offset,
        });

        return {
            totalItems: total,
            items: languages,
            page,
            size
        };
    }
}
```


现在就实现了一个简单的分页了和排序查询了。


## 参考

- [https://medium.com/@bhkfazano/how-to-create-paginated-sortable-and-filterable-endpoints-with-nestjs-fde6315c8466](https://medium.com/@bhkfazano/how-to-create-paginated-sortable-and-filterable-endpoints-with-nestjs-fde6315c8466#id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImM3ZTExNDEwNTlhMTliMjE4MjA5YmM1YWY3YTgxYTcyMGUzOWI1MDAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyMTYyOTYwMzU4MzQtazFrNnFlMDYwczJ0cDJhMmphbTRsamRjbXMwMHN0dGcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyMTYyOTYwMzU4MzQtazFrNnFlMDYwczJ0cDJhMmphbTRsamRjbXMwMHN0dGcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDcxNjkxNjExNjI4OTcyNzE1OTUiLCJlbWFpbCI6InpoYW5nbHVuMTQxMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmJmIjoxNjkzMjc2ODMwLCJuYW1lIjoiTHVuIFpoYW5nIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBY0hUdGVEU1FWU004N0pZcWRNX0t6Tm9WNzlTNXdteXpBNXFxYWM3akY4d0RGdmdHWT1zOTYtYyIsImdpdmVuX25hbWUiOiJMdW4iLCJmYW1pbHlfbmFtZSI6IlpoYW5nIiwibG9jYWxlIjoiemgtQ04iLCJpYXQiOjE2OTMyNzcxMzEsImV4cCI6MTY5MzI4MDczMSwianRpIjoiMzYzNWI5OTg0NDgxM2ZhZWIzMzQ5Y2QwZWUyNjFlZDcyN2E1N2E2OSJ9.btJb1JRJps8NxLPJRRzSSDUiUtnV42xVTb_rfzSYv67-t5L6aseb2P96lFfG_1qWMgtRjyzWBUdtDeMmIEsOAfd60T9e7oSTWOEEJRkA-rpY30J-xLtui1idte0dT8t7txymCxMRv7RRjSk0RU-8XV9TdObFAkl5kNEf0W09CSeBIB7DmG1y-jOeV-rRY6UuvquO0-uHA4oSyVKwBLhMS34tOarHiuiXb4oWMt0kmDSFG5D6NZpl7xYqdS3ekPQ9e9q6JA4gulI7LHiyEyAjzyYKbPVsMHyhRxoEtwzTnoizE7QLEsyDWf6ISpVYvB6ivUn6YAPX66-QADngGnLnQQ)
- [https://docs.nestjs.com/custom-decorators](https://docs.nestjs.com/custom-decorators)
