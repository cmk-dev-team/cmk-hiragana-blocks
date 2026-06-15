//% block="ひらがな"
//% color="#4b7bec"
namespace hiragana {
    export enum MoveDirection {
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

    /**
     * エージェントを、えらんだほうこうにうごかします。
     */
    //% blockId=hiragana_agent_move
    //% block="エージェントを %direction に %distance ブロック うごかす"
    //% distance.min=1 distance.defl=1
    export function moveAgent(direction: MoveDirection, distance: number): void {
        switch (direction) {
            case MoveDirection.Forward:
                agent.move(FORWARD, distance)
                break
            case MoveDirection.Back:
                agent.move(BACK, distance)
                break
            case MoveDirection.Left:
                agent.move(LEFT, distance)
                break
            case MoveDirection.Right:
                agent.move(RIGHT, distance)
                break
            case MoveDirection.Up:
                agent.move(UP, distance)
                break
            case MoveDirection.Down:
                agent.move(DOWN, distance)
                break
        }
    }
}
