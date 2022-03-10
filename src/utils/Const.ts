export abstract class ConstantsTiles {
    // Nb of tiles separating each texture
    static readonly tileDistance = 5
    static readonly EMPTY:number = 0
    static readonly WALL_FACE:number = 33
    static readonly WALL_LEFT:number = 69
    static readonly WALL_TOP_LEFT_CORNER:number = 34
    static readonly WALL_TOP_LEFT_INNER_CORNER:number = 161
    static readonly WALL_TIP_INNER:number = 162
    static readonly WALL_TIP_TOP_LEFT:number = 2
    static readonly WALL_BOTTOM_LEFT_CORNER:number = 98
    static readonly WALL_BOTTOM_LEFT_CORNER_TIP:number = 66
    static readonly WALL_RIGHT:number = 101
    static readonly WALL_TOP_RIGHT_CORNER:number = 35 
    static readonly WALL_TOP_RIGHT_INNER_CORNER:number = 163
    static readonly WALL_TIP_TOP_RIGHT:number = 3
    static readonly WALL_BOTTOM_RIGHT_CORNER:number = 99
    static readonly WALL_BOTTOM_RIGHT_CORNER_TIP:number = 67
    static readonly WALL_TIP:number = 1
    static readonly GROUND_CLEAN:number = 36
    static readonly GROUND_CRACK:number = 68
    static readonly GROUND_SLIGHTLY_CRACKED:number = 100

    static readonly FILE_LIMIT_TOP:number = 162
    static readonly FILE_LIMIT_TOP_LEFT:number = 161
    static readonly FILE_LIMIT_TOP_RIGHT:number = 163

    static readonly FILE_LIMIT_LEFT:number = 193
    static readonly FILE_LIMIT_RIGHT:number = 195

    static readonly FILE_LIMIT_BOTTOM:number = 226
    static readonly FILE_LIMIT_BOTTOM_LEFT:number = 225
    static readonly FILE_LIMIT_BOTTOM_RIGHT:number = 227
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
    static readonly TUTORIAL_LOADING = 'project_loading'
    static readonly TUTORIAL_LOADED = 'project_loaded'
    static readonly PROJECT_LOADING = 'project_loading'
    static readonly PROJECT_LOADED = 'project_loaded'
    static readonly PROJECT_LOADING_FAILED = 'project_loading_failed'
    static readonly PAUSE = 'pause'
    static readonly FREEZE = 'freeze'
    static readonly EXIT = 'exit'
}

export abstract class TileSetName{
    static readonly CLASSIC = "tiles"
    static readonly FUNKY = "tiles_funky"
    static readonly GRAY_DARK = "tiles_grayscale_dark"
    static readonly GRAY_LIGHT = "tiles_grayscale_light"

    static tilesets: string[] = [
        TileSetName.CLASSIC,
        TileSetName.FUNKY,
        TileSetName.GRAY_DARK,
        TileSetName.GRAY_LIGHT
    ]
}