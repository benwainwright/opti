import { fromOpenApi } from "@mswjs/source/open-api";
import testSpec from "../../api.json" with { type: 'json' }

export const handlers = await fromOpenApi(testSpec as Parameters<typeof fromOpenApi>[0])
