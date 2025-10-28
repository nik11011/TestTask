import * as THREE from "three"


export class AudioControl{
    listener = new THREE.AudioListener();
    volume: boolean = true;
    audioLoader = new THREE.AudioLoader();
    loopSound = new THREE.Audio(this.listener);
    coinHopSound = new THREE.Audio(this.listener);
    bombHopSound = new THREE.Audio(this.listener);
    stepSound = new THREE.Audio(this.listener);
    step2Sound = new THREE.Audio(this.listener);
    step3Sound = new THREE.Audio(this.listener);
    loseMusic = new THREE.Audio(this.listener);
    winMusic = new THREE.Audio(this.listener);
    wrathSound = new THREE.Audio(this.listener);
    loadSounds() {
        this.audioLoader.load('loopTrack.mp3', (buffer) => {
            this.loopSound.setBuffer(buffer);
            this.loopSound.setLoop(true);
            this.loopSound.setVolume(0.5);
        });
        this.audioLoader.load('coin.mp3', (buffer) => {
            this.coinHopSound.setBuffer(buffer);
            this.coinHopSound.setVolume(0.5);
        });
        this.audioLoader.load('explosion_small_no_tail_03.mp3', (buffer) => {
            this.bombHopSound.setBuffer(buffer);
            this.bombHopSound.setVolume(0.5);
        });
        this.audioLoader.load('step_0.mp3', (buffer) => {
            this.stepSound.setBuffer(buffer);
            this.stepSound.setVolume(0.5);
            this.stepSound.setLoop(true);
        });
        this.audioLoader.load('STGR_Fail_Lose_forMUSIC_A_1.mp3', (buffer) => {
            this.loseMusic.setBuffer(buffer);
            this.loseMusic.setVolume(0.5);
        });
        this.audioLoader.load('STGR_Success_Win_forMUSIC_A_2.mp3', (buffer) => {
            this.winMusic.setBuffer(buffer);
            this.winMusic.setVolume(0.5);
        });
        this.audioLoader.load('SFX_UI_Appear_Generic_2.mp3', (buffer) => {
            this.wrathSound.setBuffer(buffer);
            this.wrathSound.setVolume(0.5);
        });
    }
    playLoseSounds(playerDeath:boolean) {
        if (playerDeath == false && this.volume == true){
            this.bombHopSound.play();
            this.loopSound.setVolume(0);
            this.loopSound.pause();
            this.loopSound.remove();
            this.loseMusic.play();
        }
        else {
            this.bombHopSound.pause();
            this.loopSound.setVolume(0);
            this.loopSound.pause();
            this.loseMusic.pause();
        }
    }

    playWinSounds(win: number) {
        if (win != 0 && this.volume == true) {
            this.loopSound.setVolume(0);
            this.loopSound.pause();
            this.loopSound.remove();
            this.stepSound.remove;
            this.winMusic.play();
        }
        else {
            this.loopSound.pause();
            this.winMusic.pause();
        }
    }

    playCoinTake() {
        if (this.volume) {
            this.coinHopSound.play();
        }
        else {
            this.coinHopSound.pause();
        }
    }


    WrathSoundPlay() {
        if (this.volume) {
            this.wrathSound.play();
        } else {
            this.wrathSound.pause();
        }
    }
}
