import * as WordCloud from 'wordcloud';
import { ListEntry } from 'wordcloud';

export class WordCloudSetup {

    static provide(canvas: HTMLCanvasElement, words: ListEntry[] | any[]): void {
        const options: WordCloud.Options = {
            list: words,
            gridSize: Math.round(16 * canvas.width / 1024),
            weightFactor(size) {return Math.pow(size, 2.3) * canvas.width / 1024; },
            fontFamily: 'Segoe UI',
            drawOutOfBound: true,
            wait: 333,
            shuffle: true,
            rotateRatio: 0.5,
            minRotation: 0,
            maxRotation: 4.71239,
            backgroundColor: 'transparent',
            color(word, weight) {
                const rng = Math.round(Math.random() * 10);
                switch (rng) {
                    case 10: return '#10c9ab';
                    case  9: return '#fcba03';
                    case  8: return '#eb4034';
                    case  7: return '#4287f5';
                    case  6: return '#32a852';
                    case  5: return '#4260f5';
                    case  4: return '#7159eb';
                    case  3: return '#9747ff';
                    case  2: return '#ffbc47';
                    case  1: return '#ff8147';
                    default: return '#808080';
                }
            }
        };
        console.log('canvas:', canvas);
        console.log('options:', options);
        WordCloud(canvas, options);
    }

}
