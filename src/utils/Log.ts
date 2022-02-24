import { LogConstant } from "./Const"

export default class Log{
    static information: { key: string, time:number, detail? }[] = []

    static nbDeath: number = 0
    static nbKills: number = 0
    
    constructor(){

    }


    static addInformation(key: string, detail?){
        if(typeof detail === 'object'){
            detail = JSON.parse(JSON.stringify(detail))
        }

        switch(key){
            case LogConstant.DIE:
                Log.nbDeath++
                break
            case LogConstant.KILL:
                Log.nbKills++
                break
        }

        Log.information.push({ 
            key: key,
            time: Date.now(),
            detail: detail
        })
    }

    static sendResult(){
        console.log(Log.nbDeath, Log.nbKills, Log.information)
    }
}