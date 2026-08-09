# Private Robotics Knowledge Base

Authorized static mirror of `https://vla.yilong-zhu.com/`, containing the
overview and 19 technical documents with the original layout and content.

## Local Preview

From the repository root:

```bash
python3 -m http.server 8765 --directory private-kb/public
```

Open `http://127.0.0.1:8765/`.

## Cloudflare Pages

Deploy `private-kb/public` as the static output directory. No build command is
required. Keep the Git repository private; repository privacy alone does not
protect the deployed website.

After the Pages deployment is available:

1. Open Cloudflare Zero Trust.
2. Go to `Access -> Applications` and add a self-hosted application.
3. Enter the Pages custom hostname, for example `kb.example.com`.
4. Enable One-time PIN or the required identity provider.
5. Create an `Allow` policy containing only approved email addresses.
6. Set a short session duration, such as 24 hours.
7. Add a final `Block` policy for every other identity.

For manual access requests, expose a separate public hostname such as
`access.example.com`; approve a request by adding its email to the Access allow
policy. Do not place the request form behind the protected knowledge-base
hostname.

## Privacy Controls

- `_headers` prevents indexing and disables browser caching of protected pages.
- `robots.txt` disallows all crawlers.
- Mermaid, KaTeX, and KaTeX fonts are bundled locally.
- Cloudflare Access remains mandatory: robots directives are not authentication.
