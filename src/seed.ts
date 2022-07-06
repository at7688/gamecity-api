import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
const prisma = new PrismaClient();
import * as dotenv from 'dotenv';

dotenv.config(); // Load the environment variables

async function main() {
  await prisma.user.upsert({
    where: { email: 'sp@admin.com' },
    update: {},
    create: {
      email: 'sp@admin.com',
      name: '超級管理員',
      password: await argon2.hash(process.env.DEFAULT_PASSWORD),
      role: {
        connectOrCreate: {
          where: { code: 'MASTER' },
          create: {
            name: '總管理員',
            code: 'MASTER',
          },
        },
      },
    },
  });

  await prisma.permission.createMany({
    data: [
      {
        name: '最新消息-列表',
        controller: 'AnnouncementController',
        handler: 'findAll',
      },
      {
        name: '最新消息-查看',
        controller: 'AnnouncementController',
        handler: 'findOne',
      },
      {
        name: '最新消息-新增',
        controller: 'AnnouncementController',
        handler: 'create',
      },
      {
        name: '最新消息-修改',
        controller: 'AnnouncementController',
        handler: 'update',
      },
      {
        name: '最新消息-刪除',
        controller: 'AnnouncementController',
        handler: 'remove',
      },

      {
        name: '活動管理-列表',
        controller: 'EventController',
        handler: 'findAll',
      },
      {
        name: '活動管理-查看',
        controller: 'EventController',
        handler: 'findOne',
      },
      {
        name: '活動管理-新增',
        controller: 'EventController',
        handler: 'create',
      },
      {
        name: '活動管理-修改',
        controller: 'EventController',
        handler: 'update',
      },
      {
        name: '活動管理-刪除',
        controller: 'EventController',
        handler: 'remove',
      },
      {
        name: '活動管理-選項',
        controller: 'EventController',
        handler: 'option',
      },

      {
        name: '活動組合管理-列表',
        controller: 'EventGroupController',
        handler: 'findAll',
      },
      {
        name: '活動組合管理-查看',
        controller: 'EventGroupController',
        handler: 'findOne',
      },
      {
        name: '活動組合管理-新增',
        controller: 'EventGroupController',
        handler: 'create',
      },
      {
        name: '活動組合管理-修改',
        controller: 'EventGroupController',
        handler: 'update',
      },
      {
        name: '活動組合管理-刪除',
        controller: 'EventGroupController',
        handler: 'remove',
      },
      {
        name: '活動組合管理-選項',
        controller: 'EventGroupController',
        handler: 'option',
      },

      {
        name: '活動曝光管理-列表',
        controller: 'EventExpoController',
        handler: 'findAll',
      },
      {
        name: '活動曝光管理-查看',
        controller: 'EventExpoController',
        handler: 'findOne',
      },
      {
        name: '活動曝光管理-新增',
        controller: 'EventExpoController',
        handler: 'create',
      },
      {
        name: '活動曝光管理-修改',
        controller: 'EventExpoController',
        handler: 'update',
      },
      {
        name: '活動曝光管理-刪除',
        controller: 'EventExpoController',
        handler: 'remove',
      },
      {
        name: '活動曝光管理-選項',
        controller: 'EventExpoController',
        handler: 'option',
      },

      {
        name: '管理員管理-列表',
        controller: 'UserController',
        handler: 'findAll',
      },
      {
        name: '管理員管理-查看',
        controller: 'UserController',
        handler: 'findOne',
      },
      {
        name: '管理員管理-新增',
        controller: 'UserController',
        handler: 'create',
      },
      {
        name: '管理員管理-修改',
        controller: 'UserController',
        handler: 'update',
      },
      {
        name: '管理員管理-刪除',
        controller: 'UserController',
        handler: 'remove',
      },
      {
        name: '角色管理-列表',
        controller: 'RoleController',
        handler: 'findAll',
      },
      {
        name: '角色管理-查看',
        controller: 'RoleController',
        handler: 'findOne',
      },
      {
        name: '角色管理-新增',
        controller: 'RoleController',
        handler: 'create',
      },
      {
        name: '角色管理-修改',
        controller: 'RoleController',
        handler: 'update',
      },
      {
        name: '角色管理-刪除',
        controller: 'RoleController',
        handler: 'remove',
      },
      {
        name: '操作記錄-列表',
        controller: 'OperationRecController',
        handler: 'findAll',
      },
      {
        name: '操作記錄-查看',
        controller: 'OperationRecController',
        handler: 'findOne',
      },
      {
        name: '操作記錄-查看',
        controller: 'OperationRecController',
        handler: 'findOne',
      },
      {
        name: '登入記錄',
        controller: 'OperationRecController',
        handler: 'findAuthAll',
      },

      {
        name: '獎項-選項',
        controller: 'PrizeController',
        handler: 'option',
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
