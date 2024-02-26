import { chat } from '@ampt/ai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  return await chat(messages)
}
