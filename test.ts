import { server } from "./tests/msw/server.ts";


server.listen()

const result = await fetch("https://api.optimizely.com/flags/v1/projects/12345/flags", {
  headers: {
    accept: "application/json",
  }
})

if (!result.ok) {
  throw new Error(`Request failed with status ${result.status}`);
}

console.log(await result.json())
