"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MidjourneyApi = void 0;
const queue_1 = require("./queue");
const utls_1 = require("./utls");
class MidjourneyApi {
    config;
    apiQueue = (0, queue_1.CreateQueue)(1);
    UpId = Date.now() % 10; // upload id
    constructor(config) {
        this.config = config;
    }
    // limit the number of concurrent interactions
    async safeIteractions(payload) {
        return this.apiQueue.addTask(() => new Promise((resolve) => {
            this.interactions(payload, (res) => {
                resolve(res);
            });
        }));
    }
    async interactions(payload, callback) {
        try {
            const headers = {
                "Content-Type": "application/json",
                Authorization: this.config.SalaiToken,
            };
            const response = await this.config.fetch(`${this.config.DiscordBaseUrl}/api/v9/interactions`, {
                method: "POST",
                body: JSON.stringify(payload),
                headers: headers,
            });
            callback && callback(response.status);
            //discord api rate limit
            await (0, utls_1.sleep)(950);
            if (response.status >= 400) {
                console.error("api.error.config", { payload, config: this.config });
            }
            return response.status;
        }
        catch (error) {
            console.error(error);
            callback && callback(500);
        }
    }
    async ImagineApi(prompt, nonce = (0, utls_1.nextNonce)()) {
        const guild_id = this.config.ServerId;
        const payload = {
            type: 2,
            application_id: "936929561302675456",
            guild_id,
            channel_id: this.config.ChannelId,
            session_id: this.config.SessionId,
            data: {
                version: "1118961510123847772",
                id: "938956540159881230",
                name: "imagine",
                type: 1,
                options: [
                    {
                        type: 3,
                        name: "prompt",
                        value: prompt,
                    },
                ],
                application_command: {
                    id: "938956540159881230",
                    application_id: "936929561302675456",
                    version: "1118961510123847772",
                    default_permission: true,
                    default_member_permissions: null,
                    type: 1,
                    nsfw: false,
                    name: "imagine",
                    description: "Create images with Midjourney",
                    dm_permission: true,
                    options: [
                        {
                            type: 3,
                            name: "prompt",
                            description: "The prompt to imagine",
                            required: true,
                        },
                    ],
                },
                attachments: [],
            },
            nonce,
        };
        return this.safeIteractions(payload);
    }
    async VariationApi(index, messageId, messageHash, nonce) {
        const payload = {
            type: 3,
            guild_id: this.config.ServerId,
            channel_id: this.config.ChannelId,
            message_flags: 0,
            message_id: messageId,
            application_id: "936929561302675456",
            session_id: this.config.SessionId,
            data: {
                component_type: 2,
                custom_id: `MJ::JOB::variation::${index}::${messageHash}`,
            },
            nonce,
        };
        return this.safeIteractions(payload);
    }
    async UpscaleApi(index, messageId, messageHash, nonce) {
        const guild_id = this.config.ServerId;
        const payload = {
            type: 3,
            guild_id,
            channel_id: this.config.ChannelId,
            message_flags: 0,
            message_id: messageId,
            application_id: "936929561302675456",
            session_id: this.config.SessionId,
            data: {
                component_type: 2,
                custom_id: `MJ::JOB::upsample::${index}::${messageHash}`,
            },
            nonce,
        };
        return this.safeIteractions(payload);
    }
    async ClickBtnApi(messageId, customId, nonce) {
        const guild_id = this.config.ServerId;
        const payload = {
            type: 3,
            nonce,
            guild_id,
            channel_id: this.config.ChannelId,
            message_flags: 0,
            message_id: messageId,
            application_id: "936929561302675456",
            session_id: this.config.SessionId,
            data: {
                component_type: 2,
                custom_id: customId,
            },
        };
        return this.safeIteractions(payload);
    }
    async InfoApi(nonce) {
        const guild_id = this.config.ServerId;
        const payload = {
            type: 2,
            application_id: "936929561302675456",
            guild_id,
            channel_id: this.config.ChannelId,
            session_id: this.config.SessionId,
            data: {
                version: "1118961510123847776",
                id: "972289487818334209",
                name: "info",
                type: 1,
                options: [],
                application_command: {
                    id: "972289487818334209",
                    application_id: "936929561302675456",
                    version: "972289487818334209",
                    default_member_permissions: null,
                    type: 1,
                    nsfw: false,
                    name: "info",
                    description: "View information about your profile.",
                    dm_permission: true,
                    contexts: null,
                },
                attachments: [],
            },
            nonce,
        };
        return this.safeIteractions(payload);
    }
    async FastApi(nonce) {
        const guild_id = this.config.ServerId;
        const payload = {
            type: 2,
            application_id: "936929561302675456",
            guild_id,
            channel_id: this.config.ChannelId,
            session_id: this.config.SessionId,
            data: {
                version: "987795926183731231",
                id: "972289487818334212",
                name: "fast",
                type: 1,
                options: [],
                application_command: {
                    id: "972289487818334212",
                    application_id: "936929561302675456",
                    version: "987795926183731231",
                    default_member_permissions: null,
                    type: 1,
                    nsfw: false,
                    name: "fast",
                    description: "Switch to fast mode",
                    dm_permission: true,
                    contexts: null,
                },
                attachments: [],
            },
            nonce,
        };
        return this.safeIteractions(payload);
    }
    async RelaxApi(nonce) {
        const guild_id = this.config.ServerId;
        const channel_id = this.config.ChannelId;
        const payload = {
            type: 2,
            application_id: "936929561302675456",
            guild_id,
            channel_id,
            session_id: this.config.SessionId,
            data: {
                version: "987795926183731232",
                id: "972289487818334213",
                name: "relax",
                type: 1,
                options: [],
                application_command: {
                    id: "972289487818334213",
                    application_id: "936929561302675456",
                    version: "987795926183731232",
                    default_member_permissions: null,
                    type: 1,
                    nsfw: false,
                    name: "relax",
                    description: "Switch to relax mode",
                    dm_permission: true,
                    contexts: null,
                },
                attachments: [],
            },
            nonce,
        };
        return this.safeIteractions(payload);
    }
}
exports.MidjourneyApi = MidjourneyApi;
//# sourceMappingURL=midjourne.api.js.map