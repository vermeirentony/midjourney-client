"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MidjourneyMessage = void 0;
const tslib_1 = require("tslib");
const interfaces_1 = require("./interfaces");
const queue_1 = require("./queue");
const utls_1 = require("./utls");
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
class MidjourneyMessage {
    magApiQueue = (0, queue_1.CreateQueue)(1);
    config;
    constructor(defaults) {
        const { SalaiToken } = defaults;
        if (!SalaiToken) {
            throw new Error("SalaiToken are required");
        }
        this.config = {
            ...interfaces_1.DefaultMJConfig,
            ...defaults,
        };
    }
    log(...args) {
        this.config.Debug && console.log(...args, new Date().toISOString());
    }
    async FilterMessages(timestamp, prompt, loading) {
        const seed = prompt.match(/\[(.*?)\]/)?.[1];
        this.log(`seed:`, seed);
        const data = await this.safeRetrieveMessages(this.config.Limit);
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (item.author.id === "936929561302675456" &&
                item.content.includes(`${seed}`)) {
                const itemTimestamp = new Date(item.timestamp).getTime();
                if (itemTimestamp < timestamp) {
                    this.log("old message");
                    continue;
                }
                if (item.attachments.length === 0) {
                    this.log("no attachment");
                    break;
                }
                const imageUrl = item.attachments[0].url;
                //waiting
                if (item.attachments[0].filename.startsWith("grid") ||
                    item.components.length === 0) {
                    this.log(`content`, item.content);
                    const progress = this.content2progress(item.content);
                    loading?.(imageUrl, progress);
                    break;
                }
                //finished
                const content = item.content.split("**")[1];
                const msg = {
                    content,
                    id: item.id,
                    uri: imageUrl,
                    flags: item.flags,
                    hash: this.UriToHash(imageUrl),
                    progress: "done",
                    options: (0, utls_1.formatOptions)(item.components),
                };
                return msg;
            }
        }
        return null;
    }
    content2progress(content) {
        const spcon = content.split("**");
        if (spcon.length < 3) {
            return "";
        }
        content = spcon[2];
        const regex = /\(([^)]+)\)/; // matches the value inside the first parenthesis
        const match = content.match(regex);
        let progress = "";
        if (match) {
            progress = match[1];
        }
        return progress;
    }
    UriToHash(uri) {
        return uri.split("_").pop()?.split(".")[0] ?? "";
    }
    async WaitMessage(prompt, loading, timestamp) {
        timestamp = timestamp ?? Date.now();
        for (let i = 0; i < this.config.MaxWait; i++) {
            const msg = await this.FilterMessages(timestamp, prompt, loading);
            if (msg !== null) {
                return msg;
            }
            this.log(i, "wait no message found");
            await (0, utls_1.sleep)(1000 * 2);
        }
        return null;
    }
    // limit the number of concurrent interactions
    async safeRetrieveMessages(limit = 50) {
        return this.magApiQueue.addTask(() => this.RetrieveMessages(limit));
    }
    async RetrieveMessages(limit = this.config.Limit) {
        const headers = {
            "Content-Type": "application/json",
            Authorization: this.config.SalaiToken,
        };
        const response = await (0, node_fetch_1.default)(`${this.config.DiscordBaseUrl}/api/v10/channels/${this.config.ChannelId}/messages?limit=${limit}`, {
            headers,
        });
        if (!response.ok) {
            this.log("error config", { config: this.config });
            this.log(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
}
exports.MidjourneyMessage = MidjourneyMessage;
//# sourceMappingURL=midjourney.message.js.map