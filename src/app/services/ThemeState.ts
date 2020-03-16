export enum Themes {
    Light,
    Dark
}

export class ThemeState {

    constructor(theme: Themes) {
        switch (theme) {
            case Themes.Light:
                this.theme = Themes.Light;
                this.inTransition = false;
                this.degree = 0;
                break;
            case Themes.Dark:
                this.theme = Themes.Dark;
                this.inTransition = false;
                this.degree = 1;
                break;
            default:
                break;
        }
    }

    get Theme(): Themes {
        return this.theme;
    }
    get IsInTransition(): boolean {
        return this.inTransition;
    }
    set IsInTransition(inTransition: boolean) {
        this.inTransition = inTransition;
    }
    get Degree(): number {
        return this.degree;
    }
    set Degree(degree: number) {
        if (degree <= 0) {
            this.degree = 0;
            this.theme = Themes.Light;
            this.inTransition = false;
        } else if (degree >= 1) {
            this.degree = 1;
            this.theme = Themes.Dark;
            this.inTransition = false;
        } else {
            this.degree = degree;
            this.inTransition = true;
        }
    }
    private theme: Themes;
    private inTransition: boolean;
    private degree: number;
}
