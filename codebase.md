# .gitignore

```
node_modules
.next
.env*

```

# .idea\.gitignore

```
# Default ignored files
/shelf/
/workspace.xml
# Editor-based HTTP Client requests
/httpRequests/
# Datasource local storage ignored files
/dataSources/
/dataSources.local.xml

```

# .idea\ae-affiliate-bot.iml

```iml
<?xml version="1.0" encoding="UTF-8"?>
<module type="WEB_MODULE" version="4">
  <component name="NewModuleRootManager">
    <content url="file://$MODULE_DIR$">
      <excludeFolder url="file://$MODULE_DIR$/.tmp" />
      <excludeFolder url="file://$MODULE_DIR$/temp" />
      <excludeFolder url="file://$MODULE_DIR$/tmp" />
    </content>
    <orderEntry type="inheritedJdk" />
    <orderEntry type="sourceFolder" forTests="false" />
  </component>
</module>
```

# .idea\modules.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="ProjectModuleManager">
    <modules>
      <module fileurl="file://$PROJECT_DIR$/.idea/ae-affiliate-bot.iml" filepath="$PROJECT_DIR$/.idea/ae-affiliate-bot.iml" />
    </modules>
  </component>
</project>
```

# .idea\vcs.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="VcsDirectoryMappings">
    <mapping directory="$PROJECT_DIR$" vcs="Git" />
  </component>
</project>
```

# .idea\workspace.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="AutoImportSettings">
    <option name="autoReloadType" value="SELECTIVE" />
  </component>
  <component name="ChangeListManager">
    <list default="true" id="8cb92634-9d9f-4035-9cd1-7405903f8495" name="Changes" comment="" />
    <option name="SHOW_DIALOG" value="false" />
    <option name="HIGHLIGHT_CONFLICTS" value="true" />
    <option name="HIGHLIGHT_NON_ACTIVE_CHANGELIST" value="false" />
    <option name="LAST_RESOLUTION" value="IGNORE" />
  </component>
  <component name="ProjectColorInfo"><![CDATA[{
  "associatedIndex": 1
}]]></component>
  <component name="ProjectId" id="2wu9ShaNBVwFDg9Kay4nFKfPR2v" />
  <component name="ProjectViewState">
    <option name="hideEmptyMiddlePackages" value="true" />
    <option name="showLibraryContents" value="true" />
  </component>
  <component name="PropertiesComponent"><![CDATA[{
  "keyToString": {
    "ModuleVcsDetector.initialDetectionPerformed": "true",
    "RunOnceActivity.ShowReadmeOnStart": "true",
    "js.debugger.nextJs.config.created.client": "true",
    "js.debugger.nextJs.config.created.server": "true",
    "last_opened_file_path": "D:/Downloads/ae-affiliate-bot",
    "node.js.detected.package.eslint": "true",
    "node.js.detected.package.tslint": "true",
    "node.js.selected.package.eslint": "(autodetect)",
    "node.js.selected.package.tslint": "(autodetect)",
    "nodejs_package_manager_path": "npm",
    "vue.rearranger.settings.migration": "true"
  }
}]]></component>
  <component name="RunManager" selected="npm.Next.js: server-side">
    <configuration name="Next.js: debug client-side" type="JavascriptDebugType" uri="http://localhost:3000/">
      <method v="2" />
    </configuration>
    <configuration name="Next.js: server-side" type="js.build_tools.npm">
      <package-json value="$PROJECT_DIR$/package.json" />
      <command value="run" />
      <scripts>
        <script value="dev" />
      </scripts>
      <node-interpreter value="project" />
      <envs />
      <method v="2" />
    </configuration>
  </component>
  <component name="SharedIndexes">
    <attachedChunks>
      <set>
        <option value="bundled-js-predefined-d6986cc7102b-f27c65a3e318-JavaScript-WS-251.23774.424" />
      </set>
    </attachedChunks>
  </component>
  <component name="TaskManager">
    <task active="true" id="Default" summary="Default task">
      <changelist id="8cb92634-9d9f-4035-9cd1-7405903f8495" name="Changes" comment="" />
      <created>1746880593129</created>
      <option name="number" value="Default" />
      <option name="presentableId" value="Default" />
      <updated>1746880593129</updated>
      <workItem from="1746880594431" duration="625000" />
    </task>
    <servers />
  </component>
  <component name="TypeScriptGeneratedFilesManager">
    <option name="version" value="3" />
  </component>
</project>
```

# bots\affiliateBot.ts

```ts
import { Telegraf } from 'telegraf';
import axios from 'axios';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string;
const HOST = process.env.NEXT_PUBLIC_HOST_NAME as string;

if (!BOT_TOKEN) {
  throw new Error('Missing TELEGRAM_BOT_TOKEN env var');
}
if (!HOST) {
  throw new Error('Missing NEXT_PUBLIC_HOST_NAME env var');
}

const bot = new Telegraf(BOT_TOKEN);

bot.command('link', async (ctx) => {
  const parts = ctx.message.text.split(' ').slice(1);
  if (parts.length === 0) {
    return ctx.reply('Usage: /link <AliExpress URL>');
  }
  const url = parts.join(' ');

  try {
    const { data } = await axios.post(`${HOST}/api/link`, { url });
    if (data.link) {
      return ctx.reply(data.link);
    }
    return ctx.reply('Could not generate link');
  } catch (err) {
    console.error(err);
    return ctx.reply('API error');
  }
});

export function launchBot() {
  bot.launch().then(() => {
    console.log('Telegram bot running');
  });
}

```

# lib\aliexpress.ts

```ts
// lib/aliexpress.ts
import axios from 'axios';
import { createHmac } from 'crypto';

const BASE   = 'https://api-sg.aliexpress.com';
const KEY    = process.env.AE_APP_KEY as string;
const SECRET = process.env.AE_APP_SECRET as string;
const PID    = process.env.AE_PID as string;

if (!KEY || !SECRET || !PID) {
  throw new Error('Missing AliExpress env vars');
}

/** Build the HMAC-SHA256 signature per AliExpress docs */
function sign(params: Record<string, any>): string {
  const sorted = Object.keys(params).sort();
  const raw    = sorted.map(k => `${k}${params[k]}`).join('');
  return createHmac('sha256', SECRET)
      .update(SECRET + raw + SECRET)
      .digest('hex')
      .toUpperCase();
}

/** Generate a PID-tagged deeplink for any AliExpress product URL */
export async function generateLink(url: string) {
  const timestamp = Date.now();
  const p: Record<string, any> = {
    method: 'aliexpress.affiliate.link.generate',
    app_key: KEY,
    timestamp,
    format: 'json',
    v: '2.0',
    pid: PID,
    promotion_link_type: 1,
    source_values: url,
  };
  p.sign = sign(p);

  const { data } = await axios.get(
      `${BASE}/openapi/param2/2/portals.open/api.list`,
      { params: p },
  );

  // Compatibility with both resp_result and result wrappers
  const arr =
      data?.resp_result?.result?.promotion_urls ??
      data?.result?.promotion_urls ??
      [];

  if (arr.length > 0) return arr[0].url as string;
  throw new Error('AliExpress did not return a link');
}

```

# next.config.js

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};
module.exports = nextConfig;

```

# package.json

```json
{
  "name": "ae-affiliate-bot",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "bot": "ts-node bots/affiliateBot.ts"
  },
  "dependencies": {
    "axios": "^1.6.5",
    "crypto-js": "^4.2.0",
    "next": "14.2.3",
    "react": "18.3.0",
    "react-dom": "18.3.0",
    "telegraf": "^4.16.2"
  },
  "devDependencies": {
    "@types/node": "20.12.3",
    "@types/react": "18.3.7",
    "ts-node": "10.9.1",
    "typescript": "5.4.4"
  }
}

```

# pages\api\link.ts

```ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { generateLink } from '../../lib/aliexpress';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'url required' });
  }

  try {
    const link = await generateLink(url);
    return res.status(200).json({ link });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'AliExpress API failed' });
  }
}

```

# pages\index.tsx

```tsx
// pages/index.tsx
export default function Home() {
    return (
        <main style={{fontFamily:'sans-serif',padding:'2rem'}}>
            <h1>AE Affiliate Bot API</h1>
            <p>POST <code>/api/link</code> with&nbsp;{"{ url }"} to get a PID-tagged link.</p>
        </main>
    );
}

```

# push.sh

```sh
git add .
git commit -m "bruh here's an update"
git push origin main
```

# README.md

```md
# AliExpress Affiliate Telegram Bot (Vercel Ready)

Minimal Next.js (API‑only) project written in TypeScript that:

* Exposes **POST `/api/link`** – returns an AliExpress affiliate URL for any product link.
* Includes an optional **Telegram bot** (`/bots/affiliateBot.ts`) you can run with `npm run bot`.

## Quick start

1. **Install**

\`\`\`bash
npm install
\`\`\`

2. **Create `.env.local`** (copy from `.env.example`) and fill:

\`\`\`
AE_APP_KEY=
AE_APP_SECRET=
AE_PID=
TELEGRAM_BOT_TOKEN=
NEXT_PUBLIC_HOST_NAME=https://your-vercel-domain
\`\`\`

3. **Dev**

\`\`\`bash
npm run dev        # API at http://localhost:3000/api/link
npm run bot        # Telegram polling bot
\`\`\`

4. **Deploy to Vercel**

\`\`\`bash
vercel --prod
\`\`\`

Add the same environment variables in the Vercel dashboard.

## Usage

*Send to Telegram*:

\`\`\`
/link https://www.aliexpress.com/item/123456.html
\`\`\`

Bot replies with your PID-tagged affiliate URL.

*Call the API directly*:

\`\`\`bash
curl -X POST https://your-vercel-domain/api/link \
     -H 'Content-Type: application/json' \
     -d '{"url":"https://www.aliexpress.com/item/123456.html"}'
\`\`\`

---

### Notes

* No database required – each request is individually signed with `AppSecret`.
* Works on the free Vercel tier; build output is ≈5 MB.

```

# tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "types": ["node"]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}

```

