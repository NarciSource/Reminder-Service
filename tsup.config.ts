import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/main.ts"],

    outDir: "../dist/reminder/worker",

    format: ["cjs"],
    target: "node18",
    platform: "node",

    sourcemap: true,
    clean: true,
    dts: false,

    loader: {
        ".lua": "text",
    },

    esbuildOptions(options) {
        options.alias = {
            "@": "./src",
        };
    },

    external: ["@nestjs/websockets", "@nestjs/microservices"],
});
