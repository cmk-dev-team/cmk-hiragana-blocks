//% block="ひらがな"
//% color="#4b7bec"
namespace hiragana {
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
        agent.teleportToPlayer()
    }

    /**
     * エージェントを、えらんだほうこうにうごかします。
     */
    //% blockId=hiragana_agent_move
    //% block="エージェントを $direction に $distance ブロック うごかす"
    //% distance.min=1 distance.defl=1
    //% weight=90
    export function moveAgent(direction: Direction, distance: number): void {
        agent.move(toSixDirection(direction), distance)
    }

    /**
     * エージェントのむきをかえます。
     */
    //% blockId=hiragana_agent_turn
    //% block="エージェントの むきを $direction に かえる"
    //% weight=80
    export function turnAgent(direction: TurnDirection): void {
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
        return agent.getPosition()
    }

    /**
     * エージェントにブロックをおかせます。
     */
    //% blockId=hiragana_agent_place
    //% block="エージェントに $direction へ おかせる"
    //% weight=60
    export function placeAgent(direction: Direction): void {
        agent.place(toSixDirection(direction))
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
        agent.setItem(blockType, count, slot)
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
