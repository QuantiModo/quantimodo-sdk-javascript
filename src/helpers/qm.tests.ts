import * as path from "path";
export function getBuildUrl() {
    return process.env.BUILD_URL || process.env.CIRCLE_BUILD_URL
}