import { NextRequest, NextResponse } from 'next/server'
import { askEdux } from '@/lib/edux'
import { error } from 'console'
import { stat } from 'fs'

console.log('GROQ KEY', process.env.GROQ_API_KEY)

export async function POST(req: NextRequest) {
  try {
    type message = {
      id: number,
      role: 'user' | 'assistant'
      content: string
    }

    type response = {
      messages: message[]
    }

    const { messages }: response = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'message array is required' }, { status: 400 })
    }

    const reply = await askEdux(messages)
    return NextResponse.json({ reply }, { status: 200 })
  } catch (error) {
    console.error('Edux Error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
