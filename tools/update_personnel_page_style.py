#!/usr/bin/env python3
from __future__ import annotations
import datetime as dt
import hashlib
import html.parser
import pathlib
import re
import sys

ROOT = pathlib.Path('/home/CNS2026391745/Documents/YUEYICHEN')
DEST = ROOT / 'personnel page technical content KB.md'
CACHE = ROOT / '.cache' / 'vla_kb_combined.sha256'
LOG = ROOT / 'logs' / 'personnel_page_style_update.log'
ROOT_URL = 'https://vla.yilong-zhu.com/'
REFERENCE_ROOT = ROOT / 'private-kb'
REFERENCE_PUBLIC = REFERENCE_ROOT / 'public'
CRON_SPEC = '17 9 * * 1'
START = '<!-- AUTO-SOURCE-START -->'
END = '<!-- AUTO-SOURCE-END -->'

ENTITY_PAT = r'\b(?:Pi0|Pi0\.5|Pi0-FAST|Pi-Star|Pi0\.7|GR00T|SmolVLA|WALL-OSS|WALL-X|X-VLA|Psi0|DreamZero|Fast-WAM|ACT|VLM3|VLM³|Decoupled WBC|GEAR-SONIC|MotionBricks|OpenVLA|LeRobot|LIBERO|Isaac Lab|MuJoCo|DDS|ONNX|TensorRT|PPO|Diffusion|FAST|VQVAE|FSQ|Flow Matching|action expert|PaliGemma|SigLIP|DINOv2|Qwen|Gemma|Swin)\b'
NUM_PAT = r'\b\d[\d,]*(?:\.\d+)?\s*(?:B|M|K|Hz|FPS|DoF|维|层|帧|步|tokens?|token|ms|s|GB|TB|条|小时|%|pp)\b'


def now() -> str:
    return dt.datetime.now().astimezone().strftime('%Y-%m-%d %H:%M:%S %Z')


def log(msg: str) -> None:
    LOG.parent.mkdir(parents=True, exist_ok=True)
    with LOG.open('a', encoding='utf-8') as f:
        f.write(f'[{now()}] {msg}\n')


class LinkParser(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(); self.links=[]; self.in_a=False; self.href=None; self.text=[]
    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            self.in_a=True; self.href=dict(attrs).get('href'); self.text=[]
    def handle_data(self, data):
        if self.in_a:
            s=data.strip()
            if s: self.text.append(s)
    def handle_endtag(self, tag):
        if tag == 'a' and self.in_a:
            label=' '.join(self.text).strip()
            if self.href: self.links.append((self.href,label))
            self.in_a=False


class TextParser(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(); self.skip=0; self.out=[]
    def handle_starttag(self, tag, attrs):
        if tag in {'script','style','svg','button'}:
            self.skip += 1; return
        if self.skip: return
        if tag in {'h1','h2','h3','h4'}: self.out.append('\n' + '#'*int(tag[1]) + ' ')
        elif tag in {'p','tr'}: self.out.append('\n')
        elif tag in {'th','td'}: self.out.append(' | ')
        elif tag == 'li': self.out.append('\n- ')
        elif tag == 'pre': self.out.append('\n```\n')
        elif tag == 'br': self.out.append('\n')
    def handle_endtag(self, tag):
        if self.skip:
            if tag in {'script','style','svg','button'}: self.skip -= 1
            return
        if tag in {'h1','h2','h3','h4','p','tr','table','ul','ol'}: self.out.append('\n')
        elif tag == 'pre': self.out.append('\n```\n')
    def handle_data(self, data):
        if self.skip: return
        s=' '.join(data.split())
        if s: self.out.append(s + ' ')


def read_reference_page(href: str) -> str:
    public_root = REFERENCE_PUBLIC.resolve()
    path = (REFERENCE_PUBLIC / href).resolve()
    path.relative_to(public_root)
    if not path.is_file():
        raise RuntimeError(f'missing local KB reference page: {path}')
    return path.read_text(encoding='utf-8')


def extract_main_text(doc: str) -> str:
    m=re.search(r'<main class="content">(.*?)</main>', doc, flags=re.S)
    fragment=m.group(1) if m else doc
    p=TextParser(); p.feed(fragment)
    text=''.join(p.out).replace('− 100% + □ ⤢','')
    while '\n\n\n' in text: text=text.replace('\n\n\n','\n\n')
    return text.strip() + '\n'


def headings(text: str) -> list[str]:
    out=[]
    for line in text.splitlines():
        line=re.sub(r'\s+#\s*$', '', line.strip())
        if line.startswith('#'):
            out.append(line)
    return out


def digest(text: str) -> str:
    return hashlib.sha256(re.sub(r'\s+', ' ', text).strip().encode('utf-8')).hexdigest()


def anchors(text: str, limit=28) -> tuple[list[str], list[str]]:
    ents=sorted(set(re.findall(ENTITY_PAT, text)))
    nums=[]
    for n in re.findall(NUM_PAT, text):
        if n not in nums: nums.append(n)
        if len(nums) >= limit: break
    return ents[:40], nums


def discover_pages(root_doc: str) -> list[tuple[str, str]]:
    p=LinkParser(); p.feed(root_doc)
    seen=set(); pages=[]
    for href,label in p.links:
        href=href.split('#')[0]
        if not href or not href.endswith('.html'): continue
        if href in seen: continue
        seen.add(href); pages.append((href, label or href))
    if 'index.html' not in seen:
        pages.insert(0, ('index.html', 'Overview'))
    return pages


def crawl() -> list[dict]:
    if not REFERENCE_PUBLIC.is_dir():
        raise RuntimeError(f'missing local KB reference root: {REFERENCE_PUBLIC}')
    root_doc=read_reference_page('index.html')
    pages=discover_pages(root_doc)
    if len(pages) != 20:
        raise RuntimeError(f'expected 20 local KB pages, discovered {len(pages)}')
    results=[]
    for href,label in pages:
        text=extract_main_text(read_reference_page(href))
        if len(text) < 500:
            raise RuntimeError(f'incomplete page: {href}')
        ents, nums = anchors(text)
        results.append({
            'href': href,
            'label': label,
            'path': str((REFERENCE_PUBLIC / href).relative_to(ROOT)),
            'digest': digest(text),
            'headings': headings(text),
            'entities': ents,
            'numbers': nums,
        })
    return results


def combined_digest(results: list[dict]) -> str:
    joined='\n'.join(f"{r['href']}:{r['digest']}" for r in results)
    return hashlib.sha256(joined.encode('utf-8')).hexdigest()


def page_catalog(results: list[dict]) -> str:
    lines=['| Page | Local full-text reference | Top-level outline | Anchors |', '| --- | --- | --- | --- |']
    for r in results:
        hs='; '.join(h.lstrip('# ').strip() for h in r['headings'][:5])
        ents=', '.join(r['entities'][:8]) or 'none'
        nums=', '.join(r['numbers'][:8]) or 'none'
        lines.append(f"| {r['label']} | `{r['path']}` | {hs} | {ents}; {nums} |")
    return '\n'.join(lines)


def replace_block(content: str, block: str) -> str:
    if START in content and END in content:
        return re.sub(re.escape(START) + r'.*?' + re.escape(END), block, content, flags=re.S)
    return block + '\n\n' + content


def main() -> int:
    try:
        results=crawl()
        new_hash=combined_digest(results)
        old_hash=CACHE.read_text(encoding='utf-8').strip() if CACHE.exists() else ''
        changed=new_hash != old_hash
        block=f'''{START}\nLocal reference status:\n- Last indexed: {now()}\n- Primary full-text reference: {REFERENCE_ROOT}\n- HTML document root: {REFERENCE_PUBLIC}\n- Source provenance: {ROOT_URL}\n- Pages indexed: {len(results)}\n- Combined digest: {new_hash[:16]}\n- Local reference changed in last run: {'yes' if changed else 'no'}\n- Index mode: local authorized mirror; no network or Chrome session required\n- Schedule: {CRON_SPEC} every Monday, local machine time\n\nLatest local reference catalog:\n{page_catalog(results)}\n\nRefresh behavior: the weekly job indexes `private-kb/public`, updates only this auto-managed block, and preserves the manually synthesized writing guide below. Refresh the authorized mirror separately before indexing when the upstream KB changes.\n{END}'''
        current=DEST.read_text(encoding='utf-8')
        DEST.write_text(replace_block(current, block), encoding='utf-8')
        CACHE.parent.mkdir(parents=True, exist_ok=True)
        CACHE.write_text(new_hash+'\n', encoding='utf-8')
        log(f'local KB reference block updated; pages={len(results)}; reference_changed={changed}; digest={new_hash[:16]}')
        return 0
    except Exception as exc:
        log(f'skipped full KB update: {exc}')
        return 1

if __name__ == '__main__':
    sys.exit(main())
