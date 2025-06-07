const autoParse = require('../index.js')
const { assert } = require('chai')

describe('URL and file path parsing', function () {
  it('parses URL strings when enabled', function () {
    const url = autoParse('https://example.com', { parseUrls: true })
    assert.instanceOf(url, URL)
    assert.strictEqual(url.hostname, 'example.com')
  })

  it('parses file paths when enabled', function () {
    const p = autoParse('./foo/bar', { parseFilePaths: true })
    assert.strictEqual(p.includes('foo'), true)
  })

  it('defaults to string when disabled', function () {
    assert.strictEqual(autoParse('https://example.com'), 'https://example.com')
  })
})
