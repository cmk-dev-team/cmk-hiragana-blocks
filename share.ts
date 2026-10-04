/**
 * 先生がゲーム内で子どものプログラムを見るための記録（v1.8.0〜）
 *
 * もとは たくのろじぃ先生の mcee-mkcd-share-system（cmk-dev-team に fork）。
 * - 再生の約2秒後に、エージェントを動かさずに中身をなぞって送る（mode = trace）
 * - チャットコマンドを実行したときも、動かしながら記録して送る（mode = run）
 * - 送り方は /scriptevent puzzle:submit me|<part>/<total>|<JSON 200字>
 *
 * 記録されるのは、この拡張のブロックだけ。ふつうのブロックは、なぞるときに本当に動く。
 * チュートリアルの道具箱は、この拡張のブロックだけにする。
 */
//% blockHidden=1
namespace hiraganaShare {
    class Cmd {
        type: string
        direction: string
        blocks: number
        times: number
        children: Cmd[]
        item: number
        count: number
        slot: number
        pos: string
        constructor(type: string) {
            this.type = type
            this.direction = ""
            this.blocks = 0
            this.times = 0
            this.children = []
            this.item = 0
            this.count = 0
            this.slot = 0
            this.pos = ""
        }
    }

    class Pending {
        command: string
        handler: () => void
        constructor(command: string, handler: () => void) {
            this.command = command
            this.handler = handler
        }
    }

    let program: Cmd[] = []
    let stack: Cmd[][] = []
    let recording = false
    let executing = true
    let lastPos = ""
    let pending: Pending[] = []
    let traceScheduled = false
    // 送る内容に入れる版。先生の画面に出るので、子どもが古い版を開いていても気づける
    const VERSION = "1.8.0-dev6"

    export function isExecuting(): boolean {
        return executing
    }

    /** ポジションのブロックが、いま作った位置を文字で覚えておく */
    export function notePos(text: string): void {
        lastPos = text
    }

    function takePos(position: Position): string {
        const t = lastPos
        lastPos = ""
        if (t != "") return t
        return position.toString()
    }

    function add(c: Cmd): void {
        if (recording) stack[stack.length - 1].push(c)
    }

    export function move(direction: string, blocks: number): void {
        const c = new Cmd("move")
        c.direction = direction
        c.blocks = blocks
        add(c)
    }

    export function turn(direction: string): void {
        const c = new Cmd("turn")
        c.direction = direction
        add(c)
    }

    export function place(direction: string): void {
        const c = new Cmd("place")
        c.direction = direction
        add(c)
    }

    export function setItem(item: number, count: number, slot: number): void {
        const c = new Cmd("setItem")
        c.item = item
        c.count = count
        c.slot = slot
        add(c)
    }

    export function callAgent(): void {
        add(new Cmd("callAgent"))
    }

    export function teleport(position: Position): void {
        const c = new Cmd("teleport")
        c.pos = takePos(position)
        add(c)
    }

    export function placeAt(item: number, position: Position): void {
        const c = new Cmd("placeAt")
        c.item = item
        c.pos = takePos(position)
        add(c)
    }

    export function spawn(mob: number, position: Position): void {
        const c = new Cmd("spawn")
        c.item = mob
        c.pos = takePos(position)
        add(c)
    }

    /** くりかえし：中身は1回だけ記録し、残りは記録せずに動かす */
    export function repeat(times: number, handler: () => void): void {
        if (!recording) {
            if (executing) for (let i = 0; i < times; i++) handler()
            return
        }
        const node = new Cmd("repeat")
        node.times = times
        add(node)
        stack.push(node.children)
        handler()
        stack.pop()
        if (executing) {
            for (let i = 1; i < times; i++) {
                recording = false
                handler()
                recording = true
            }
        }
    }

    // 区切りの | は送り方で使うので、文字の中では | にする
    function q(s: string): string {
        let out = "\""
        for (let i = 0; i < s.length; i++) {
            const ch = s.charAt(i)
            if (ch == "\"") out += "\\\""
            else if (ch == "\\") out += "\\\\"
            else if (ch == "\n") out += "\\n"
            else if (ch == "|") out += "\\u007c"
            else out += ch
        }
        return out + "\""
    }

    function one(c: Cmd): string {
        let s = "{\"type\":" + q(c.type)
        if (c.type == "move") s += ",\"direction\":" + q(c.direction) + ",\"blocks\":" + c.blocks
        else if (c.type == "turn" || c.type == "place") s += ",\"direction\":" + q(c.direction)
        else if (c.type == "setItem") s += ",\"item\":" + c.item + ",\"count\":" + c.count + ",\"slot\":" + c.slot
        else if (c.type == "teleport") s += ",\"pos\":" + q(c.pos)
        else if (c.type == "placeAt" || c.type == "spawn") s += ",\"item\":" + c.item + ",\"pos\":" + q(c.pos)
        else if (c.type == "repeat") s += ",\"times\":" + c.times + ",\"children\":" + list(c.children)
        return s + "}"
    }

    function list(cs: Cmd[]): string {
        let s = "["
        for (let i = 0; i < cs.length; i++) {
            if (i > 0) s += ","
            s += one(cs[i])
        }
        return s + "]"
    }

    function send(json: string): void {
        const size = 200
        const total = Math.ceil(json.length / size)
        for (let i = 0; i < total; i++) {
            player.execute("scriptevent puzzle:submit me|" + (i + 1) + "/" + total + "|" + json.substr(i * size, size))
        }
    }

    function runProgram(command: string, handler: () => void, doExecute: boolean): void {
        program = []
        stack = [program]
        lastPos = ""
        recording = true
        executing = doExecute
        handler()
        recording = false
        executing = true
        send("{\"command\":" + q(command) + ",\"mode\":" + q(doExecute ? "run" : "trace")
            + ",\"style\":\"hiragana\",\"ver\":" + q(VERSION) + ",\"program\":" + list(program) + "}")
    }

    /** チャットコマンドの入口。起動の約2秒後になぞって送り、実行したときは動かして送る */
    export function onChat(command: string, handler: () => void): void {
        pending.push(new Pending(command, handler))
        if (!traceScheduled) {
            traceScheduled = true
            loops.forever(function () {
                loops.pause(2000)
                if (pending.length > 0) {
                    const ps = pending
                    pending = []
                    for (let i = 0; i < ps.length; i++) runProgram(ps[i].command, ps[i].handler, false)
                }
            })
        }
        player.onChat(command, function () {
            runProgram(command, handler, true)
        })
    }
}
