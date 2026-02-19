const { GoogleGenerativeAI } = require("@google/generative-ai");

const YOUR_API_KEY = "AIzaSyApf2eNhgPFsMvDikSwv6LX-ndWRSn7TbY"; 

async function runTest() {
  try {
    const genAI = new GoogleGenerativeAI(YOUR_API_KEY);
    
    console.log("🔍 正在查询你的 Key 到底支持哪些模型...");
    
    // 这个方法会列出所有你可用的模型名
    // 注意：由于 SDK 限制，我们直接尝试请求
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent("Hi");
    const response = await result.response;
    console.log("\n✅ 终于成功了！AI 回复:", response.text());

  } catch (error) {
    console.log("\n❌ 还是不行。错误详细内容如下：");
    console.error(error.message);
    
    if (error.message.includes("404")) {
      console.log("\n💡 最终诊断：你的 Google 账号目前处于‘受限状态’。");
      console.log("建议：换一个 Google 账号（Gmail）登录 AI Studio 重新拿 Key。");
    }
  }
}

runTest();