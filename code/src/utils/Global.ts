import { TileSetName } from "./Const"

export abstract class Global {
    static fileTree
    static issues: any[] = []
    static tileset: string = TileSetName.tilesets[0]
}