import axios, { AxiosError } from "axios";

const OPENROUTER_FREE_MODELS = [
  "mistralai/mistral-7b-instruct:free",
  "google/gemma-7b-it:free",
  "meta-llama/llama-3-8b-instruct:free",
  "microsoft/phi-3-mini-128k-instruct:free",
  "qwen/qwen-2-7b-instruct:free",
  "nousresearch/hermes-2-pro-llama-3-8b:free",
  "openchat/openchat-7b:free",
  "undi95/toppy-m-7b:free",
  "gryphe/mythomax-l2-13b:free",
  "huggingfaceh4/zephyr-7b-beta:free",
  "mistralai/mistral-tiny:free",
  "cognitivecomputations/dolphin-2.6-mixtral-8x7b:free",
  "rwkv/rwkv-5-world-3b:free",
  "recursal/eagle-7b:free",
];

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export class HermesAgent {
  private openRouterApiKey: string;
  private currentModelIndex = 0;
  private timeoutMs = 30000;

  constructor(apiKey: string) {
    this.openRouterApiKey = apiKey;
  }

  async chatWithFallback(messages: ChatMessage[]): Promise<string> {
    for (let i = 0; i < OPENROUTER_FREE_MODELS.length; i++) {
      const model = OPENROUTER_FREE_MODELS[this.currentModelIndex];
      console.log(`[Hermes Agent] Attempting to use model: ${model}`);

      try {
        const response = await this.queryOpenRouter(model, messages);
        return response;
      } catch (error) {
        console.warn(
          `[Hermes Agent] Model ${model} failed or timed out. Moving to the next free model...`,
        );
        // Move to the next model for subsequent tries
        this.currentModelIndex =
          (this.currentModelIndex + 1) % OPENROUTER_FREE_MODELS.length;
      }
    }

    throw new Error("All 14 free OpenRouter models failed or timed out.");
  }

  private async queryOpenRouter(
    model: string,
    messages: ChatMessage[],
  ): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model,
          messages,
        },
        {
          headers: {
            Authorization: `Bearer ${this.openRouterApiKey}`,
            "HTTP-Referer": "http://localhost:3000", // Update with your app URL
            "X-Title": "Hermes Agent Harness",
          },
          signal: controller.signal,
        },
      );

      return res.data.choices[0].message.content;
    } finally {
      clearTimeout(timeout);
    }
  }

  public generateGraphifyPrompt(projectStructure: string): ChatMessage {
    return {
      role: "system",
      content: `[SKILL: GRAPHIFY]\nYou are analyzing the project structure. Do not output full code. Keep tokens extremely low. Focus only on the relationships and file structure. Here is the structure:\n${projectStructure}`,
    };
  }

  public generateCavemanPrompt(): ChatMessage {
    return {
      role: "system",
      content: `[SKILL: CAVEMAN]\nPerform precise technical cleanup. No pleasantries. No explanations. Output only the exact changes or the cleaned-up code. Keep it brief.`,
    };
  }

  public generatePonytailPrompt(): ChatMessage {
    return {
      role: "system",
      content: `[SKILL: PONYTAIL]\nAct as a lazy but highly efficient senior developer. Provide the quickest, most minimalistic solution possible. Apply the YAGNI (You Aren't Gonna Need It) principle. Write the absolute minimum code to solve the problem and save tokens.`,
    };
  }
}
