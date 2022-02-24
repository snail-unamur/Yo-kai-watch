export abstract class ConstantsTiles {
    // Constant for tiles
    static readonly textureId = 0
    // Each texture is seperated by 4 tiles
    static readonly tileDistance = 5
    static readonly diff = ConstantsTiles.textureId *  ConstantsTiles.tileDistance
    static readonly WALL_FACE:number = 33 + ConstantsTiles.diff
    static readonly WALL_LEFT:number = 69 // not done yet
    static readonly WALL_TOP_LEFT_CORNER:number = 34 + ConstantsTiles.diff
    static readonly WALL_TOP_LEFT_INNER_CORNER:number = 384
    static readonly WALL_TIP_INNER:number = 321
    static readonly WALL_TIP_TOP_LEFT:number = 2 + ConstantsTiles.diff
    static readonly WALL_BOTTOM_LEFT_CORNER:number = 98 + ConstantsTiles.diff
    static readonly WALL_BOTTOM_LEFT_CORNER_TIP:number = 66 + ConstantsTiles.diff
    static readonly WALL_RIGHT:number = 101 // not done yet
    static readonly WALL_TOP_RIGHT_CORNER:number = 35 + ConstantsTiles.diff 
    static readonly WALL_TOP_RIGHT_INNER_CORNER:number = 352
    static readonly WALL_TIP_TOP_RIGHT:number = 3 + ConstantsTiles.diff
    static readonly WALL_BOTTOM_RIGHT_CORNER:number = 99 + ConstantsTiles.diff
    static readonly WALL_BOTTOM_RIGHT_CORNER_TIP:number = 67 + ConstantsTiles.diff
    static readonly WALL_TIP:number = 1 + ConstantsTiles.diff
    static readonly ECHELLE:number = 195
    static readonly GROUND_CLEAN:number = 36 + ConstantsTiles.diff
    static readonly GROUND_CRACK:number = 68 + ConstantsTiles.diff
    static readonly GROUND_SLIGHTLY_CRACKED:number = 100 + ConstantsTiles.diff
    static readonly GROUND_BOTTOM_LEFT_HOLE:number = 161
    static readonly GROUND_BOTTOM_RIGHT_HOLE:number = 163
    static readonly GROUND_TOP_RIGHT_HOLE:number = 193
    static readonly GROUND_TOP_LEFT_HOLE:number = 194
    static readonly TREASURE_CLOSED:number = 595
}

export abstract class MonsterConstantsSize{
    // Monster size
    static readonly TINY = 'tiny'
    static readonly MEDIUM = 'medium'
    static readonly BIG = 'big'
}

export abstract class MonsterConstantsType{
    // Monster type
    static readonly ZOMBIE = 'zombie'
    static readonly GOBLIN = 'goblin'
    static readonly DEMON = 'demon'
}

export abstract class LogConstant{
    static readonly DIG = 'dig'
    static readonly GO_UP = 'go_up'
    static readonly DIE = 'die'
    static readonly KILL = 'kill'
    static readonly GET_HIT = 'get_hit'
    static readonly START_ROOM = 'start_room'
}