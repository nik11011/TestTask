import {Player} from "./InteractiveObjects/Player";
import {Audio, AudioListener, AudioLoader} from "three";


export class AudioControlComponent {
    public volume: boolean = true;

    public readonly listener: AudioListener = new AudioListener();
    private readonly _audioLoader: AudioLoader = new AudioLoader();
    public readonly stepSound: Audio = new Audio(this.listener);
    private readonly _loopSound: Audio = new Audio(this.listener);
    private readonly _coinHopSound: Audio = new Audio(this.listener);
    private readonly _bombHopSound: Audio = new Audio(this.listener);
    private readonly _loseMusic: Audio = new Audio(this.listener);
    private readonly _winMusic: Audio = new Audio(this.listener);
    private readonly _wrathSound: Audio = new Audio(this.listener);
    loadSounds() {
        this._audioLoader.load('loopTrack.mp3', (buffer) => {
            this._loopSound.setBuffer(buffer);
            this._loopSound.setLoop(true);
            this._loopSound.setVolume(0.5);
        });
        this._audioLoader.load('coin.mp3', (buffer) => {
            this._coinHopSound.setBuffer(buffer);
            this._coinHopSound.setVolume(0.5);
        });
        this._audioLoader.load('explosion_small_no_tail_03.mp3', (buffer) => {
            this._bombHopSound.setBuffer(buffer);
            this._bombHopSound.setVolume(0.5);
        });
        this._audioLoader.load('step_0.mp3', (buffer) => {
            this.stepSound.setBuffer(buffer);
            this.stepSound.setVolume(0.5);
            this.stepSound.setLoop(true);
        });
        this._audioLoader.load('STGR_Fail_Lose_forMUSIC_A_1.mp3', (buffer) => {
            this._loseMusic.setBuffer(buffer);
            this._loseMusic.setVolume(0.5);
        });
        this._audioLoader.load('STGR_Success_Win_forMUSIC_A_2.mp3', (buffer) => {
            this._winMusic.setBuffer(buffer);
            this._winMusic.setVolume(0.5);
        });
        this._audioLoader.load('SFX_UI_Appear_Generic_2.mp3', (buffer) => {
            this._wrathSound.setBuffer(buffer);
            this._wrathSound.setVolume(0.5);
        });
    }
    playLoseSounds(playerDeath:boolean) {
        if (playerDeath == false && this.volume == true){
            this._bombHopSound.play();
            this._loopSound.setVolume(0);
            this._loopSound.pause();
            this._loopSound.remove();
            this._loseMusic.play();
        }
        else {
            this._bombHopSound.pause();
            this._loopSound.setVolume(0);
            this._loopSound.pause();
            this._loseMusic.pause();
        }
    }

    playWinSounds(win: number) {
        if (win != 0 && this.volume == true) {
            this._loopSound.setVolume(0);
            this._loopSound.pause();
            this._loopSound.remove();
            this.stepSound.remove;
            this._winMusic.play();
        }
        else {
            this._loopSound.pause();
            this._winMusic.pause();
        }
    }

    playCoinTake() {
        if (this.volume) {
            this._coinHopSound.play();
        }
        else {
            this._coinHopSound.pause();
        }
    }


    WrathSoundPlay() {
        if (this.volume) {
            this._wrathSound.play();
        } else {
            this._wrathSound.pause();
        }
    }
    playTracks(player:Player) {
        if (player.playerDeath == false && player.win == 0 && this.volume == true) {
            if(!this._loopSound.isPlaying) {
                this._loopSound.play();
            }
        }
        else
        {
            this._loopSound.pause();
        }
    }
}
