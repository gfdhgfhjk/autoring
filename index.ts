import { definePlugin, Logger } from "@vencord/plugincore";
import { FluxDispatcher } from "@webpack/common";

/*
 * AutoRedial Plugin
 * Automatically sends another ring request to a user after the initial call ring stops.
 */

export default definePlugin({
    name: "AutoRedial",
    description: "Automatically re-rings a user when the ringing stops during a call attempt.",

    start() {
        Logger.log("AutoRedial loaded.");

        FluxDispatcher.subscribe("RTC_CALL_ENDED", this.onCallEnded);
    },

    stop() {
        FluxDispatcher.unsubscribe("RTC_CALL_ENDED", this.onCallEnded);
        Logger.log("AutoRedial stopped.");
    },

    // Called when Discord ends the ringing state
    onCallEnded(event: any) {
        try {
            const channelId = event.channelId;
            if (!channelId) return;

            Logger.log(`Call ended on channel ${channelId}, re‑ringing...`);

            FluxDispatcher.dispatch({
                type: "RTC_CALL", // Forces Discord to start another call ring
                channelId
            });
        } catch (err) {
            Logger.error("Failed to auto-redial:", err);
        }
    }
});
