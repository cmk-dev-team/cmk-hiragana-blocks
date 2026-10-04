//% block="エージェント"
//% color="#D83B01"
//% weight=64
namespace hiraganaAgent {
    export enum Direction {
        //% block="まえ"
        Forward,
        //% block="うしろ"
        Back,
        //% block="ひだり"
        Left,
        //% block="みぎ"
        Right,
        //% block="うえ"
        Up,
        //% block="した"
        Down
    }

    export enum TurnDirection {
        //% block="ひだり"
        Left,
        //% block="みぎ"
        Right
    }

    /**
     * エージェントをプレイヤーのところによびます。
     */
    //% blockId=hiragana_agent_teleport_to_player
    //% block="エージェントを よぶ"
    //% weight=100
    export function callAgent(): void {
        if (hiraganaShare.isExecuting()) agent.teleportToPlayer()
        hiraganaShare.callAgent()
    }

    /**
     * エージェントを、えらんだほうこうにうごかします。
     */
    //% blockId=hiragana_agent_move
    //% block="エージェントを $direction に $distance ブロック うごかす"
    //% distance.min=1 distance.defl=1
    //% weight=90
    export function moveAgent(direction: Direction, distance: number): void {
        if (hiraganaShare.isExecuting()) agent.move(toSixDirection(direction), distance)
        hiraganaShare.move(dirText(direction), distance)
    }

    /**
     * エージェントのむきをかえます。
     */
    //% blockId=hiragana_agent_turn
    //% block="エージェントの むきを $direction に かえる"
    //% weight=80
    export function turnAgent(direction: TurnDirection): void {
        hiraganaShare.turn(direction == TurnDirection.Left ? "left" : "right")
        if (!hiraganaShare.isExecuting()) return
        if (direction == TurnDirection.Left) {
            agent.turn(LEFT_TURN)
        } else {
            agent.turn(RIGHT_TURN)
        }
    }

    /**
     * エージェントのいちをかえします。
     */
    //% blockId=hiragana_agent_position
    //% block="エージェントの いち"
    //% weight=70
    export function agentPosition(): Position {
        hiraganaShare.notePos("エージェントの いち")
        return agent.getPosition()
    }

    /**
     * エージェントにブロックをおかせます。
     */
    //% blockId=hiragana_agent_place
    //% block="エージェントに $direction へ おく"
    //% weight=60
    export function placeAgent(direction: Direction): void {
        if (hiraganaShare.isExecuting()) agent.place(toSixDirection(direction))
        hiraganaShare.place(dirText(direction))
    }

    /**
     * エージェントのもちものをせっていします。
     */
    //% blockId=hiragana_agent_set_item
    //% block="エージェントに $blockType を $count コ、もちもの $slot ばんに せっていする"
    //% blockType.shadow=minecraftBlock
    //% blockType.defl=Block.Grass
    //% count.min=1 count.max=64 count.defl=1
    //% slot.min=1 slot.max=27 slot.defl=1
    //% weight=50
    export function setAgentItem(blockType: number, count: number, slot: number): void {
        if (hiraganaShare.isExecuting()) agent.setItem(blockType, count, slot)
        hiraganaShare.setItem(blockType, count, slot)
    }

    function dirText(direction: Direction): string {
        switch (direction) {
            case Direction.Back: return "back"
            case Direction.Left: return "left"
            case Direction.Right: return "right"
            case Direction.Up: return "up"
            case Direction.Down: return "down"
            default: return "forward"
        }
    }

    function toSixDirection(direction: Direction) {
        switch (direction) {
            case Direction.Back:
                return BACK
            case Direction.Left:
                return LEFT
            case Direction.Right:
                return RIGHT
            case Direction.Up:
                return UP
            case Direction.Down:
                return DOWN
            default:
                return FORWARD
        }
    }
}

//% block="ポジション"
//% color="#69B090"
//% weight=55
namespace hiraganaPositions {
    /**
     * プレイヤーからみた、そうたいのいちをつくります。
     */
    //% blockId=hiragana_relative_position
    //% block="みぎ $right うえ $up まえ $forward の いち"
    //% right.defl=0 up.defl=0 forward.defl=0
    //% weight=100
    export function relativePosition(right: number, up: number, forward: number): Position {
        hiraganaShare.notePos("みぎ " + right + " うえ " + up + " まえ " + forward)
        return pos(right, up, forward)
    }

    /**
     * ワールドのぜったいざひょうをつくります。
     */
    //% blockId=hiragana_world_position
    //% block="ワールド $x $y $z"
    //% x.defl=0 y.defl=0 z.defl=0
    //% weight=90
    export function worldPosition(x: number, y: number, z: number): Position {
        hiraganaShare.notePos("ワールド " + x + " " + y + " " + z)
        return world(x, y, z)
    }
}

//% block="プレイヤー"
//% color="#0078D7"
//% weight=100
namespace hiraganaPlayer {
    //% blockId=hiragana_player_on_chat
    //% block="チャットコマンド $command を にゅうりょくしたとき"
    //% command.defl="run"
    //% weight=100
    export function onChat(command: string, handler: () => void): void {
        hiraganaShare.onChat(command, handler)
    }

    //% blockId=hiragana_player_teleport
    //% block="プレイヤーを $position に テレポートさせる"
    //% position.shadow=minecraftCreatePosition
    //% weight=90
    export function teleport(position: Position): void {
        if (hiraganaShare.isExecuting()) player.teleport(position)
        hiraganaShare.teleport(position)
    }

    /**
     * チュートリアルの template 専用。見た目は onChat と同じで、ブロック置き場には出さない。
     */
    //% blockId=hiragana_player_on_chat_template
    //% block="チャットコマンド $command を にゅうりょくしたとき"
    //% blockHidden=1
    export function onChatTemplate(command: string, handler: () => void): void {
        hiraganaShare.onChat(command, handler)
    }
}

//% block="くりかえし"
//% color="#569138"
//% weight=60
namespace hiraganaLoops {
    //% blockId=hiragana_loops_repeat
    //% block="$count かい くりかえす"
    //% count.defl=4
    //% handlerStatement=1
    //% weight=100
    export function repeat(count: number, handler: () => void): void {
        hiraganaShare.repeat(count, handler)
    }
}

//% block="ブロック"
//% color="#7ABB55"
//% weight=70
namespace hiraganaBlocks {
    //% blockId=hiragana_blocks_place
    //% block="$blockType を $position に おく"
    //% blockType.shadow=minecraftBlock
    //% blockType.defl=Block.Grass
    //% position.shadow=minecraftCreatePosition
    //% weight=100
    export function place(blockType: number, position: Position): void {
        if (hiraganaShare.isExecuting()) blocks.place(blockType, position)
        hiraganaShare.placeAt(blockType, position)
    }
}

//% block="いきもの"
//% color="#764BCC"
//% weight=65
namespace hiraganaMobs {
    /**
     * いきものを スポーンさせます。なぞるときは出さずに記録だけする。
     */
    //% blockId=hiragana_mobs_spawn
    //% block="$mob を $position に スポーンさせる"
    //% mob.shadow=minecraftAnimal
    //% position.shadow=minecraftCreatePosition
    //% weight=100
    export function spawn(mob: number, position: Position): void {
        if (hiraganaShare.isExecuting()) mobs.spawn(mob, position)
        hiraganaShare.spawn(mob, position)
    }
}

//% blockHidden=1
namespace hiragana {
    export enum Direction {
        Forward,
        Back,
        Left,
        Right,
        Up,
        Down
    }

    export enum TurnDirection {
        Left,
        Right
    }

    //% blockHidden=1
    export function callAgent(): void {
        hiraganaAgent.callAgent()
    }

    //% blockHidden=1
    export function moveAgent(direction: Direction, distance: number): void {
        hiraganaAgent.moveAgent(direction as number, distance)
    }

    //% blockHidden=1
    export function moveAgentForward(distance: number): void {
        hiraganaAgent.moveAgent(hiraganaAgent.Direction.Forward, distance)
    }

    //% blockHidden=1
    export function turnAgent(direction: TurnDirection): void {
        hiraganaAgent.turnAgent(direction as number)
    }

    //% blockHidden=1
    export function agentPosition(): Position {
        return hiraganaAgent.agentPosition()
    }

    //% blockHidden=1
    export function relativePosition(right: number, up: number, forward: number): Position {
        return hiraganaPositions.relativePosition(right, up, forward)
    }

    //% blockHidden=1
    export function placeAgent(direction: Direction): void {
        hiraganaAgent.placeAgent(direction as number)
    }

    //% blockHidden=1
    export function setAgentItem(blockType: number, count: number, slot: number): void {
        hiraganaAgent.setAgentItem(blockType, count, slot)
    }
}
