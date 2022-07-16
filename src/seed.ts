import { MemberType, Prisma, PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
const prisma = new PrismaClient();
import * as dotenv from 'dotenv';

dotenv.config(); // Load the environment variables

const createMembers = async (username: string, nickname: string) => {
  const getSubCreate = async (layer: number, type: MemberType) => {
    const data: Prisma.MemberCreateInput = {
      username: username + layer,
      nickname: `${nickname}${layer}號`,
      password: await argon2.hash(process.env.DEFAULT_PASSWORD),
      type,
      layer,
    };
    if (layer < +process.env.MAX_LEVEL_DEPTH) {
      data.subs = {
        connectOrCreate: {
          where: { username: username + (layer + 1) },
          create: await getSubCreate(layer + 1, type),
        },
      };
    }
    return data;
  };
  const length = await prisma.member.count({
    where: { username: { contains: username } },
  });
  if (length > 0) {
    return;
  }
  await prisma.member.create({
    data: await getSubCreate(1, 'AGENT'),
  });
};

async function main() {
  await prisma.adminRole.createMany({
    data: [
      {
        name: '客服',
        code: 'SERVICE',
      },
      {
        name: '代理',
        code: 'AGENT',
      },
    ],
    skipDuplicates: true,
  });
  await prisma.adminUser.upsert({
    where: { username: 'superAdmin' },
    update: {},
    create: {
      nickname: '超級管理員',
      username: 'superAdmin',
      password: await argon2.hash(process.env.DEFAULT_PASSWORD),
      admin_role: {
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

  createMembers('apple', '小蘋果');
  createMembers('kiwi', '奇異果');
  createMembers('cherry', '我是櫻桃');

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

      {
        name: '會員/代理管理-列表',
        controller: 'MemberController',
        handler: 'findAll',
      },
      {
        name: '會員/代理管理-查看',
        controller: 'MemberController',
        handler: 'findOne',
      },
      {
        name: '會員/代理管理-新增',
        controller: 'MemberController',
        handler: 'create',
      },
      {
        name: '會員/代理管理-修改',
        controller: 'MemberController',
        handler: 'update',
      },
      // {
      //   name: '會員/代理管理-刪除',
      //   controller: 'MemberController',
      //   handler: 'remove',
      // },

      {
        name: '選單管理-列表',
        controller: 'MenuController',
        handler: 'findAll',
      },
      {
        name: '選單管理-查看',
        controller: 'MenuController',
        handler: 'findOne',
      },
      {
        name: '選單管理-新增',
        controller: 'MenuController',
        handler: 'create',
      },
      {
        name: '選單管理-修改',
        controller: 'MenuController',
        handler: 'update',
      },

      {
        name: '權限管理-列表',
        controller: 'PermissionController',
        handler: 'findAll',
      },
      {
        name: '權限管理-查看',
        controller: 'PermissionController',
        handler: 'findOne',
      },
      {
        name: '權限管理-新增',
        controller: 'PermissionController',
        handler: 'create',
      },
      {
        name: '權限管理-修改',
        controller: 'PermissionController',
        handler: 'update',
      },

      {
        name: '站內信-新增',
        controller: 'InboxController',
        handler: 'create',
      },
      {
        name: '站內信-列表',
        controller: 'InboxController',
        handler: 'findAll',
      },

      {
        name: '輪播圖管理-列表',
        controller: 'BannerController',
        handler: 'findAll',
      },
      {
        name: '輪播圖管理-查看',
        controller: 'BannerController',
        handler: 'findOne',
      },
      {
        name: '輪播圖管理-新增',
        controller: 'BannerController',
        handler: 'create',
      },
      {
        name: '輪播圖管理-修改',
        controller: 'BannerController',
        handler: 'update',
      },
      {
        name: '輪播圖管理-刪除',
        controller: 'BannerController',
        handler: 'remove',
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
