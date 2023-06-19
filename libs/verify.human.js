"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyHuman = void 0;
const tslib_1 = require("tslib");
const inference_1 = require("@huggingface/inference");
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
class VerifyHuman {
    config;
    inference;
    constructor(config) {
        this.config = config;
        const { HuggingFaceToken } = config;
        if (HuggingFaceToken === "" || HuggingFaceToken) {
            throw new Error("HuggingFaceToken is required");
        }
        this.inference = new inference_1.HfInference(HuggingFaceToken);
    }
    async verify(imageUri, categories) {
        console.log("verify----start", imageUri, categories);
        const imageCates = await this.inference.imageClassification({
            data: await (await (0, node_fetch_1.default)(imageUri)).blob(),
            model: "google/vit-base-patch16-224",
        });
        console.log("verify----response", { imageCates });
        for (const imageCate of imageCates) {
            const { label } = imageCate;
            for (const category of categories) {
                if (label.includes(category)) {
                    return category;
                }
            }
        }
    }
}
exports.VerifyHuman = VerifyHuman;
//# sourceMappingURL=verify.human.js.map