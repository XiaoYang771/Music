interface Lyric {
    time: number,
    text: string
}
export function parseLrc(text: string): Lyric[] {
    return text.split('\n').filter(line => line.trim()).map(line => {
        const timeMatch = line.match(/\[(\d{2}):(\d{2}\.\d{2})\]/)
        if (!timeMatch) return { time: 0, text: '' }
        const minute = parseInt(timeMatch[1] ?? '0')
        const second = parseFloat(timeMatch[2] ?? '0')
        const time = minute * 60 + second
        const text = line.replace(/\[.+\]/, '').trim()
        return { time, text }
    })
        .filter(lyric => lyric.text)
}