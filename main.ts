//% block="ひらがな"
//% color="#4b7bec"
namespace hiragana {
    /**
     * エージェントを、まえにうごかします。
     */
    //% blockId=hiragana_agent_move_forward
    //% block="エージェントを まえに $distance ブロック うごかす"
    //% distance.min=1 distance.defl=1
    export function moveAgentForward(distance: number): void {
        agent.move(FORWARD, distance)
    }
}
