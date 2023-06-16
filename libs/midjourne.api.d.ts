import { MJConfig } from "./interfaces";
export declare class MidjourneyApi {
    config: MJConfig;
    private apiQueue;
    UpId: number;
    constructor(config: MJConfig);
    protected safeIteractions(payload: any): Promise<number>;
    protected interactions(payload: any, callback?: (result: number) => void): Promise<number | undefined>;
    ImagineApi(prompt: string, nonce?: string): Promise<number>;
    VariationApi(index: number, messageId: string, messageHash: string, nonce?: string): Promise<number>;
    UpscaleApi(index: number, messageId: string, messageHash: string, nonce?: string): Promise<number>;
    ClickBtnApi(messageId: string, customId: string, nonce?: string): Promise<number>;
    InfoApi(nonce?: string): Promise<number>;
    FastApi(nonce?: string): Promise<number>;
    RelaxApi(nonce?: string): Promise<number>;
}
