import * as React from 'react';
import { Link, graphql } from 'gatsby';

import Layout from '../components/layout';
import Seo from '../components/seo';

function About({ data, location }) {
  const siteTitle = data.site.siteMetadata?.title || 'Title';
  const siteMenu = data.site.siteMetadata?.menu || [];
  const description = data.site.siteMetadata?.description || '';

  return (
    <Layout
      location={location}
      title={siteTitle}
      menu={siteMenu}
      description={description}
    >
      <Seo title="张伦" />
      <section className="main">
        <div>
          <h1 id="-">个人信息</h1>
          <ul>
            <li>张伦/男/1994年</li>
            <li>211本科/2015年毕业/南昌大学/网络工程</li>
            <li>工作年限：7年</li>
            <li>
              邮箱:
              {' '}
              <strong>zhanglun1410@gmail.com</strong>
            </li>
            <li>
              个人博客：
              <a href="https://zhanglun.github.io">https://zhanglun.github.io</a>
            </li>
            <li>
              Github：
              <a href="http://github.com/zhanglun">http://github.com/zhanglun</a>
            </li>
          </ul>
          <h1 id="-">工作经历</h1>
          <h2 id="-2017-3-">杭州快迪科技-资深软件研发工程师（2017年3月~至今）</h2>
          <h3 id="-b-">
            <strong>网约车租车业务线B端前端负责人</strong>
          </h3>
          <p>
            2020年10月至今。小桔有车运营系统和小桔有车商家通平台系统负责人。基于
            <strong>React</strong>
            的面向平台的运营管理人员和入驻商家的Web管理系统，提供公司管理，订单管理，车辆管理等众多模块。主要工作：
          </p>
          <ol>
            <li>
              参与日常开发和业务需求支撑；作为B端需求对接人，拆解任务，协调前端人力。
            </li>
            <li>
              使用
              <strong>微前端</strong>
              方案改造系统，按照业务模块将两个巨无霸系统拆解。
              <strong>提高构建和发布的效率</strong>
              ，
              <strong>提升团队协作效率</strong>
            </li>
            <li>
              基于
              <strong>Node.js</strong>
              的测试环境部署方案。利用持续集成，分支
              <strong>自动部署更新</strong>
              测试环境。多版本并存，支撑需求并发进行。
            </li>
          </ol>
          <h3 id="-">
            <strong>内部技术运营平台</strong>
          </h3>
          <p>
            2019年至2020年5月
            负责集团内部统一技术运营平台的开发和维护工作。平台面向公司的工程师，提供公共服务和业务相关的信息聚合，成本账单，正向反馈和技术交流的能力。主要工作：
          </p>
          <ol>
            <li>
              接手之后参与平台门户架构设计，
              <strong>基于Node.js的全栈开发</strong>
              ，负责了包括门户首页，服务市场，文档中心和问答等多个模块的开发维护。
            </li>
            <li>
              实现了基于
              {' '}
              <strong>Git</strong>
              {' '}
              + Markdown
              的文档系统，包含从协作到部署的
              <strong>完整方案</strong>
              。
              <ul>
                <li>使用Git仓库管理文档</li>
                <li>
                  使用自研的构建工具将markdown文件转换成JSON，导入到MySQL数据库中。
                </li>
                <li>支持全文搜索，支持自定义语法解析。</li>
                <li>设置反馈入口收集用户建议，帮助提升和改进文档。</li>
              </ul>
            </li>
            <li>
              作为小组长带领两位同学负责平台的运营系统，以及平台的日常开发和迭代等。
            </li>
          </ol>
          <h3 id="-dstack-web-">
            私有云项目 DStack 的 Web 管控系统的开发和维护。
          </h3>
          <p>
            2018年5月-2019年6月，独立负责私有云项目Dstack的Web管控系统的开发和维护。是产品化的IaaS软件，为企业提供管理包括计算，网络，存储在内的数据中心资源的能力。主要工作：
          </p>
          <ol>
            <li>
              从零到一完成了整个项目，包括项目脚手架的搭建，构建打包流程，Web前端单页应用的开发，Node层的数据聚合和操作记录等业务逻辑
            </li>
            <li>
              产出基于Node.js的Web项目的私有化部署方案，具备一键构建和一键部署的能力
            </li>
          </ol>
          <h3 id="paas-">PaaS服务控制台系统的开发和维护</h3>
          <p>
            2017年3月至2018年5月，独立负责多个内部PaaS服务的控制台系统的开发和维护，至少有6+个系统。主要工作：
          </p>
          <ol>
            <li>
              制定开发规范，通过自动化方案落地执行，保证代码的质量和可维护性
            </li>
            <li>主导团队UI组件库的落地和维护，服务于20+PaaS服务系统。</li>
            <li>
              团队项目脚手架工具
              yak-cli。具备项目脚手架、代码格式化，代码规范检查，Commit规范约束等能力。
            </li>
          </ol>
          <h2 id="-web-2015-7-2017-2-">
            上海万企明道软件有限公司-Web前端开发工程师（2015年7月~2017年2月）
          </h2>
          <h3 id="-">明道内部更新系统</h3>
          <p>
            2015年8月开始，负责整个系统的前端开发以及后期功能的迭代和维护。该系统主要服务于后端组、移动组和运维组，用于公司产品更新发布和运维管理。主要工作：
          </p>
          <ul>
            <li>
              从零搭建了该系统的前端架构。使用
              <strong>gulp</strong>
              管理构建流程，使用
              <strong>bower</strong>
              管理第三方库。
            </li>
            <li>
              引入
              <strong>Vue.js</strong>
              ，用于数据绑定。逐步替换了前端模板引擎。
            </li>
            <li>
              引入
              <strong>webpack</strong>
              。结合
              <strong>Vue.js</strong>
              的
              <strong>组件系统</strong>
              ，逐步拆解每个功能模块，抽离出公共模块，减少模块之间的耦合。配合
              <strong>gulp</strong>
              完成前端开发的自动化流程。
            </li>
            <li>
              使用
              <strong>ES6</strong>
              重写了部分现有的通用组件，包括Alert，Modal，Terminal。
            </li>
          </ul>
          <h3 id="-web-">明道产品Web端的消息模块</h3>
          <p>
            2015年11月中旬，接手消息模块，负责
            <strong>所有新功能的迭代和维护</strong>
            。主要工作：
          </p>
          <ul>
            <li>
              借鉴
              <strong>Flux</strong>
              和
              <strong>MVC</strong>
              的思想，在原有的基础上以
              <strong>组件</strong>
              的形式划分页面，组件中
              <strong>数据和视图模板解耦</strong>
              ，组件之间使用“订阅发布者模式”通信。极大地提高了模块的可拓展性、可维护性，同时
              <strong>降低了研发成本</strong>
              ，能够更好地
              <strong>适应后续需求</strong>
              的调整。为后期引入
              {' '}
              <strong>React</strong>
              {' '}
              做铺垫。
            </li>
            <li>
              整合页面中
              <strong>不同来源</strong>
              的数据，数据通过唯一的“管道”加工后返回
              <strong>前端统一的格式</strong>
              。解决了不同后端人员提供的
              <strong>数据不一致</strong>
              导致的麻烦，让需求变更引起的数据变更可以
              <strong>短平快</strong>
              的被消化，
              <strong>降低了研发成本，提高了错误追踪的效率</strong>
              。
            </li>
            <li>
              引入
              <strong>Less</strong>
              作为
              <strong>CSS预处理器</strong>
              ，使用
              <strong>React</strong>
              {' '}
              处理系统的视图层，替换原有代码中的“jQuery+模板引擎”模式，极大地提高了开发效率。
            </li>
          </ul>
        </div>
      </section>
    </Layout>
  );
}

export default About;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
        menu {
          id
          name
          url
        }
      }
    }
  }
`;
