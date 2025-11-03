import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { title, description, columnName } = await request.json()

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      )
    }

    const context = `
Card Title: ${title}
${description ? `Current Description: ${description}` : 'Current Description: None'}
Column: ${columnName}
    `.trim()

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-1-20250805',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a helpful assistant that converts task card titles into clear, simple prompts for developers using Claude Code.

Take the following task card information and generate a simple, actionable prompt that a developer could give to Claude Code to implement this feature.

The prompt should be:
- Clear and concise (2-3 sentences)
- Focus on the core functionality needed
- Avoid overly technical jargon
- Be straightforward and practical

${context}

Generate just the prompt text, nothing else. No explanations or preamble.`,
        },
      ],
    })

    const generatedPrompt =
      message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({ prompt: generatedPrompt })
  } catch (error) {
    console.error('Error generating prompt:', error)
    return NextResponse.json(
      { error: 'Failed to generate prompt' },
      { status: 500 }
    )
  }
}
