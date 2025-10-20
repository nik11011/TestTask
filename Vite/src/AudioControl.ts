import * as THREE from "three"


export class AudioControl{
    static listener = new THREE.AudioListener();

    static async createAudio() {
        const loopSound = new THREE.Audio(this.listener);
        const CoinHopSound = new THREE.Audio(this.listener);
        const BombHopSound = new THREE.Audio(this.listener);
        const StepSound = new THREE.Audio(this.listener);
        const LoseMusic = new THREE.Audio(this.listener);
        const WinMusic = new THREE.Audio(this.listener);
        const WrathSound = new THREE.Audio(this.listener)
        return {loopSound, CoinHopSound, BombHopSound, StepSound, LoseMusic, WinMusic, WrathSound};
    }
}
