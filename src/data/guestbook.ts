// 邮局留言簿。定位:玩具层,不做账号体系——读者去 GitHub issue 留言,
// 站长定期把像样的留言誊抄进 letters(带 [skip ci] 的草稿提交或手动改)。
// repoIssue 指向公开仓库的 issues 列表;若仓库转私有,记得换掉或删掉入口。
export interface GuestLetter {
  from: string;
  date: string;
  text: string;
}

export const GUESTBOOK = {
  repoIssue: "https://github.com/zhanglun/zhanglun.github.io/issues",
  letters: [
    {
      from: "站长",
      date: "2026.11.02",
      text: "留言簿刚挂出来，头一页先写：欢迎来小镇串门，邮局的炉子随时温着。",
    },
  ] as GuestLetter[],
};
