interface IUser {
  name: string;
  avatar: string;
  email: string;
  token: string;
}

interface IFile {
  id: string;
  originalname: string;
  filename: string;
  type: string;
  size: number;
  url: string;
  createAt: string;
}

interface IArticle {
  // scope:string; //文章还是项目 0  1
  // codeUrl:string;//项目代码地址
  // viewUrl:string;//预览地址
  id: string;
  // ---
  codeUrl:string;//项目代码地址
  viewUrl:string;//预览地址
  date:string;  //项目时间
  scale:string; //项目规模
// --
  title: string;
  summary: string;
  content: string;
  tags?: [any];
  cover?: string;
  toc: string;
  views: number;
  category: any;
  status: string;
  password?: string; // 访问密码
  needPassword: boolean;
  isCommentable?: boolean; // 是否可评论
  createAt: string;
  updateAt: string;
  publishAt: string;
}
// 新增项目实体
interface IProject {
  // scope:string; //文章还是项目
  codeUrl:string;//项目代码地址
  viewUrl:string;//预览地址
  date:string;  //项目时间
  scale:string; //项目规模

  // ---------
  id: string;
  title: string;  //项目名称
  summary: string; //项目摘要
  content: string; //项目详解
  tags?: [any];
  cover?: string;
  toc: string;
  views: number;
  category: any;
  status: string;
  password?: string; // 访问密码
  needPassword: boolean;
  isCommentable?: boolean; // 是否可评论
  createAt: string;
  updateAt: string;
  publishAt: string;
}

interface ITag {
  id: string;
  label: string;
  value: string;
  scope:string
}

interface ICategory {
  id: string;
  label: string;
  scope:string,
  value: string;
}

interface IPage {
  id: string;
  name: string;
  path: string;
  cover?: string;
  content: string;
  toc: string;
  status: string;
  views: number;
  createAt: string;
  publishAt: string;
}

interface IComment {
  id: string;
  name: string;
  email: string;
  content: string;
  html: string;
  pass: boolean;
  createAt: string;
  userAgent: string;
  article?: IArticle;
  parentCommentId: string;
  hostId: string;
  isHostInPage: boolean;
  replyUserName?: string;
  replyUserEmail?: string;
  children?: [IComment];
}

interface IView {
  id: string;
  ip: string;
  userAgent: string;
  url: string;
  count: number;
  createAt: string;
  updateAt: string;
}

interface IMail {
  id: string;
  from: string;
  to: string;
  subject: number;
  text: string;
  html: string;
  createAt: string;
}

interface ISearch {
  id: string;
  type: string;
  keyword: string;
  count: number;
  createAt: string;
}
