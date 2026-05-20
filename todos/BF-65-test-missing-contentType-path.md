# Add test for "file present but contentType missing" path

- **Severity:** P3 (nice to have)
- **File:** `tests/contentful/topicsv2.spec.ts`

## Problem

The mapper handles three input shapes for `item.fields.file`:

1. **No file at all** — covered by the "sets url to empty string when there is
   no file at all (no warn)" test.
2. **File with allowed image contentType** — covered by the `image/png` test.
3. **File with rejected/non-allowlisted contentType** — covered by the
   `application/pdf` test.

Missing: **file is present but `contentType` itself is missing/undefined** (e.g.
a malformed Contentful asset where `file.fields.file = { url: '//x' }` but
no `contentType`). The current code path on this input is:

- `isAllowedImageAsset(file)` → `false` (because `typeof undefined !== 'string'`)
- `if (file)` → `true` → emits the `[BF-65] Rejecting...` warn with
  `contentType=undefined`
- returns `{ url: '', title: file.fields.title || '' }`

The `isAllowedImageAsset` unit test covers the false return, but the *mapper-
level* behavior (warn + empty url, not silent) is not asserted. If someone
later "optimizes" the `if (file)` warn branch to require a string contentType,
the regression would not be caught.

## Suggested fix

Add a third case to the `getTopics customInfographicFile mapping` describe
block:

```ts
it('warns and sets url to empty string when contentType is missing on a present file', async () => {
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const topic = await runMapper({
    title: 'Mystery asset',
    // contentType deliberately omitted
    file: { url: '//images.ctfassets.net/x/y/z' } as any
  })
  expect(topic).not.toBeNull()
  const infgc = topic!.infographics[0]
  expect(infgc.customInfographicFile.url).toBe('')
  expect(infgc.customInfographicFile.title).toBe('Mystery asset')
  expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[BF-65]'))
  expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('contentType=undefined'))
})
```

## Why it matters

Locks in the "loud on malformed asset" contract end-to-end through the mapper,
not just the helper. Tiny addition, covers a real shape Contentful can serve.
