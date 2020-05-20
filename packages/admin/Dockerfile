# 引用镜像
FROM node:latest
# 作者 wohsi hnjdshnjn
MAINTAINER yb

# 执行命令，创建文件夹
RUN mkdir -p /admin
# 将nestapi目录拷贝到镜像里，也可用COPY命令
ADD ./  /admin
# 执行镜像的工作目录
WORKDIR /admin

# RUN npm cache clean
RUN npm install --registry https://registry.npm.taobao.org 
RUN npm run build
# 配置系统变量，指定端口
ENV HOST 0.0.0.0
ENV PORT 3001

# 开放端口
EXPOSE 3001

# 容器启动命令

CMD ["npm","start"]

