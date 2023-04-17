import { NextApiHandler } from 'next';
import { OpenAI } from 'langchain/llms/openai';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { initializeAgentExecutor, ChatAgent, AgentExecutor } from 'langchain/agents';
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  PromptTemplate,
} from 'langchain/prompts';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { VectorDBQAChain, ChatVectorDBQAChain, LLMChain } from 'langchain/chains';
import { ChainTool } from 'langchain/tools';

const conversation: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') return;

  const { query, vectorStoreName } = JSON.parse(req.body);

  console.log(query, vectorStoreName);

  const model = new OpenAI({
    streaming: false,
    temperature: 0,
    modelName: 'gpt-3.5-turbo',
  });

  const chat = new ChatOpenAI({
    temperature: 0,
    modelName: 'gpt-3.5-turbo',
  });

  // const questionModel = new ChatOpenAI({
  //   openAIApiKey: process.env.OPENAI_API_KEY,
  //   temperature: 0,
  //   modelName: 'gpt-3.5-turbo',
  // });

  // const questionGenChain = new LLMChain({
  //   llm: questionModel,
  //   prompt: PromptTemplate.fromTemplate(`
  //     次のような会話とフォローアップの質問がある場合、フォローアップの質問を独立した質問となるように言い換えてください。

  //     会話履歴:
  //     {chat_history}
  //     フォローアップ入力: {question}
  //     独立した質問:`),
  // });

  // const questionGeneratorTemplate = PromptTemplate.fromTemplate(`
  // 次のような会話とフォローアップの質問がある場合、フォローアップの質問を独立した質問となるように言い換えてください。

  // 会話履歴:
  // {chat_history}
  // フォローアップ入力: {question}
  // 独立した質問:`)

  // const QAPrompt = new PromptTemplate({
  //   template: `以下の文脈を利用して、最後の質問に答えてください。答えがわからない場合は、わからないと答えて、答えを作ろうとしないでください。
  //   {context
  //   質問です：{question}です。
  //   参考になる回答:`,
  //   inputVariables: ['context', 'question'],
  // });

  const vectorStore = await HNSWLib.load(
    `${process.cwd()}/public/vectorStore/${vectorStoreName}`,
    new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
  );

  const chain = VectorDBQAChain.fromLLM(model, vectorStore, { returnSourceDocuments: true, k: 2 });

  const _chain = ChatVectorDBQAChain.fromLLM(model, vectorStore, {
    qaTemplate: 'ドキュメントの内容を参考にしつつ質問に答えてください。 {context} 質問: {input}',
    returnSourceDocuments: true,
    k: 2,
  });

  const qaTool = new ChainTool({
    name: `${vectorStoreName}のベクトルデータベース`,
    description: '質問に答えるためにこのツールを使用できます。',
    chain,
  });

  const tools = [qaTool];

  const prompt = ChatAgent.createPrompt(tools, {
    prefix: 'あなたはツールを用いて質問に答えるアシスタントです。次のツールを使用することができます:',
    suffix: '始めましょう！質問に答えるのに役立つツールを使用することを忘れないでください。',
  });

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    new SystemMessagePromptTemplate(prompt),
    HumanMessagePromptTemplate.fromTemplate(`{input}
      これはあなたの以前の推論結果です。私はあなたが最後に出した結果のみを必要としています。{agent_scratchpad}
    `),
  ]);

  const llmChain = new LLMChain({
    prompt: chatPrompt,
    llm: chat,
  });

  const agent = new ChatAgent({
    llmChain,
    allowedTools: tools.map((tool) => tool.name),
  });

  // const executor = AgentExecutor.fromAgentAndTools({ agent, tools });

  const executor = await initializeAgentExecutor(tools, model, 'zero-shot-react-description');

  try {
    const result = await chain.call({ query });
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

export default conversation;
