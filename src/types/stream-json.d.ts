declare module 'stream-json' {
  import { Transform } from 'stream'
  export function parser(): Transform
}

declare module 'stream-json/streamers/StreamArray.js' {
  import { Transform } from 'stream'
  export function streamArray(): Transform
}