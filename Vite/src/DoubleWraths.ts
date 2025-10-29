﻿import {Wrath} from "./InteractiveObjects/Wrath";
import {Scene} from "three";
import {updateTextMesh} from "./Font3DComponent";


export class DoubleWraths{
    private readonly fWrath: Wrath;
    private readonly sWrath: Wrath;

    constructor(fWrath: Wrath, sWrath: Wrath) {
        this.fWrath = fWrath;
        this.sWrath = sWrath;
    }

    public removeWrath(scene:Scene): void{
        if(this.fWrath.activatedWrath){
            scene.remove(this.sWrath.model);
            updateTextMesh(this.sWrath.textMesh, "");
        }
        if(this.sWrath.activatedWrath){
            scene.remove(this.fWrath.model);
            updateTextMesh(this.fWrath.textMesh, "");
        }
    }
}