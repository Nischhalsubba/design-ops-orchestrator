const MAX_PROMPT_LENGTH = 2000
const MAX_RESPONSE_LENGTH = 8000

export async function askAssistant(prompt) {
  const message = String(prompt ?? '').trim().slice(0, MAX_PROMPT_LENGTH)
  if (!message) throw new Error('A prompt is required')

  const response = await fetch('/api/assistant', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify({ message }),
  })

  if (!response.ok) throw new Error(`Assistant request failed with ${response.status}`)

  const payload = await response.json()
  if (!payload || typeof payload.answer !== 'string') throw new Error('Invalid assistant response')

  return payload.answer.slice(0, MAX_RESPONSE_LENGTH)
}
