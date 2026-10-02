"""Restore original Wix articles from a read-only HTML snapshot; never overwrite local posts.

Requires beautifulsoup4. Usage: python scripts/restore-wix-archive.py SNAPSHOT_DIRECTORY
The directory contains wix-fetch-manifest.json and wix-html/<sha256>.html.
"""
import hashlib
import html as html_entities
import json
import pathlib
import re
import sys
from urllib.parse import urljoin, urlparse, quote, unquote
from bs4 import BeautifulSoup, NavigableString

ROOT = pathlib.Path(__file__).resolve().parents[1]
def clean(s):
    return re.sub(r'\s+', ' ', html_entities.unescape(s)).strip()

def safe_url(url):
    url = urljoin('https://www.thepharmacoach.com/', url or '')
    return url if urlparse(url).scheme in ('https', 'http', 'mailto', 'tel') else ''

def slug_of(url):
    return quote(unquote(urlparse(url).path.split('/post/',1)[1].rstrip('/')), safe='-._~')

def runs(node):
    result=[]
    for text in node.descendants:
        if not isinstance(text, NavigableString): continue
        if text.parent.name in ('script', 'style'): continue
        item={'text':str(text)}
        a=text.find_parent('a')
        if a and safe_url(a.get('href')): item['url']=safe_url(a.get('href'))
        if text.find_parent(['strong','b']): item['bold']=True
        if text.find_parent(['em','i']): item['italic']=True
        result.append(item)
    return result

def parse(html, url):
    soup=BeautifulSoup(html,'html.parser')
    metadata=[]
    for script in soup.select('script[type="application/ld+json"]'):
        try: metadata.append(json.loads(script.string or script.get_text()))
        except ValueError: pass
    meta=next((d for d in metadata if isinstance(d,dict) and d.get('@type')=='BlogPosting'),None)
    viewer=soup.select_one('[data-id="content-viewer"]')
    if not meta or not viewer: raise ValueError('Missing BlogPosting metadata or content viewer')
    body=[]
    for node in viewer.find_all(['p','h1','h2','h3','h4','h5','h6','ul','ol','blockquote','img','figcaption','iframe','video']):
        if node.find_parent(['p','h1','h2','h3','h4','h5','h6','ul','ol','blockquote']) is not None: continue
        text=clean(node.get_text(' ',strip=True))
        if node.name=='img':
            src=safe_url(node.get('data-pin-media') or node.get('src'))
            if src: body.append({'type':'image','url':src,'text':node.get('alt','')})
        elif node.name in ('iframe','video'):
            src=safe_url(node.get('src'))
            if src: body.append({'type':'link','url':src,'text':'Watch the original video'})
        elif node.name in ('ul','ol'):
            items=[li for li in node.find_all('li') if clean(li.get_text(' ',strip=True))]
            if items: body.append({'type':'list','items':[clean(li.get_text(' ',strip=True)) for li in items], 'richItems':[runs(li) for li in items], 'ordered':node.name=='ol'})
        elif text:
            kind='h2' if node.name.startswith('h') else 'quote' if node.name=='blockquote' else 'p'
            body.append({'type':kind,'text':text,'runs':runs(node)})
    if not any(b.get('text') for b in body if b['type']!='image'): raise ValueError('No recoverable article text')
    source_text=clean(viewer.get_text(' ',strip=True))
    recovered_text=clean(' '.join(' '.join(b['items']) if b['type']=='list' else b.get('text','') for b in body if b['type'] not in ('image','link')))
    # Exact word coverage catches missed paragraphs, tables, and unexpected Wix layouts.
    source_words=re.findall(r'\w+',source_text.casefold())
    recovered_words=re.findall(r'\w+',recovered_text.casefold())
    if source_words!=recovered_words: raise ValueError(f'Text fidelity mismatch: source={len(source_words)}, recovered={len(recovered_words)}')
    image=meta.get('image','')
    if isinstance(image,list): image=image[0] if image else ''
    if isinstance(image,dict): image=image.get('url','')
    slug=slug_of(url)
    return dict(slug=slug,title=meta.get('headline') or 'Untitled archive post',excerpt=clean(meta.get('description') or source_text)[:217].rstrip()+'…',author=meta.get('author',{}).get('name') or 'The Pharma Coach',published=meta.get('datePublished','')[:10],tags=['Career advice'],image=image,canonical=f'https://thepharmacoach.com/blog/{slug}/',body=body,editorialStatus='needs-editorial-rewrite',legacySource={'url':url,'sha256':hashlib.sha256(html.encode()).hexdigest(),'modified':meta.get('dateModified'),'textWords':len(source_words),'textVerified':True})

def main():
    snapshot=pathlib.Path(sys.argv[1])
    posts=json.loads((ROOT/'src/posts.json').read_text())
    by_slug={p['slug']:p for p in posts}
    report=[]
    seen=set()
    for row in json.loads((snapshot/'wix-fetch-manifest.json').read_text()):
        slug=slug_of(row['url'])
        if slug in seen: continue
        seen.add(slug)
        receipt={'url':row['url'],'slug':slug,'httpStatus':row['status']}
        try:
            if row['status']!=200: raise ValueError(f'Wix returned HTTP {row["status"]}')
            post=parse((snapshot/'wix-html'/row['file']).read_text(),row['url'])
            receipt.update(sourceSha256=post['legacySource']['sha256'],textWords=post['legacySource']['textWords'])
            if slug in by_slug:
                receipt['status']='restored-original' if by_slug[slug].get('legacySource') else 'existing-post-preserved'
                if by_slug[slug].get('legacySource') and not by_slug[slug].get('editorialRevision'): by_slug[slug]=post
            else:
                by_slug[slug]=post
                receipt['status']='restored-original'
        except Exception as e:
            receipt.update(status='needs-source-recovery',reason=str(e))
        report.append(receipt)
    posts=sorted(by_slug.values(),key=lambda p:p.get('published',''),reverse=True)
    # Re-importing a source snapshot must not restore retired-host dependencies.
    media_manifest=ROOT/'migration/blog-media-manifest.json'
    if media_manifest.exists():
        media_map={row['original']:row['local'] for row in json.loads(media_manifest.read_text())}
        def localize(value):
            if isinstance(value,dict): return {k:localize(v) for k,v in value.items()}
            if isinstance(value,list): return [localize(v) for v in value]
            return media_map.get(value,value) if isinstance(value,str) else value
        posts=localize(posts)
        for post in posts:
            for block in post.get('body',[]):
                if block.get('url','').startswith('/assets/blog-archive/') and block['url'].endswith('.mp4'):
                    block['type']='video'
                    block['text']='Watch video'
    (ROOT/'src/posts.json').write_text(json.dumps(posts,ensure_ascii=False,indent=2)+'\n')
    legacy=json.loads((ROOT/'src/legacy-posts.json').read_text())
    known={p['from']:p for p in legacy}
    for row in report:
        if row['slug'] not in by_slug: continue
        path='/post/'+row['slug']
        entry=known.get(path,{'from':path,'title':by_slug[row['slug']]['title']})
        entry.update(to='/blog/'+row['slug']+'/',status=301,decision='restored-original' if row['status']=='restored-original' else 'already-moved')
        known[path]=entry
    (ROOT/'src/legacy-posts.json').write_text(json.dumps(list(known.values()),ensure_ascii=False,indent=2)+'\n')
    (ROOT/'migration').mkdir(exist_ok=True)
    (ROOT/'migration/wix-archive-manifest.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print({s:sum(r['status']==s for r in report) for s in sorted({r['status'] for r in report})})
    print('Total website posts:',len(posts))

if __name__=='__main__': main()
