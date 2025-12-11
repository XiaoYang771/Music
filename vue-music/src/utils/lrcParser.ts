interface Lyric {
    time: number,
    text: string
}
export function parseLrc(text: string): Lyric[] {
    //按换行符分割每一段歌词，然后过滤空行，最后再进行解析
    return text.split('\n').filter(line => line.trim()).map(line => {
        //匹配时间的格式,[01:23:45]
        const timeMatch = line.match(/\[(\d{2}):(\d{2}\.\d{2})\]/)
        if (!timeMatch) return { time: 0, text: '' }
        //分钟
        const minute = parseInt(timeMatch[1] ?? '0')
        //秒钟
        const second = parseFloat(timeMatch[2] ?? '0')
        //总时间
        const time = minute * 60 + second
        //提取歌词文本，去掉时间标签再去掉空格
        const text = line.replace(/\[.+\]/, '').trim()
        return { time, text }
    })
        .filter(lyric => lyric.text)    //过滤掉解析后无文本的歌词
}