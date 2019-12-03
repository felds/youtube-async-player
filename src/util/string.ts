export function idFromURL(url: string): string {
  const shortMatch = url.match(/^https:\/\/youtu.be\/(\w{11})/);
  if (shortMatch) {
    return shortMatch[1];
  }

  const longMatch = url.match(/https:\/\/www.youtube.com\/watch\?v=(\w{11})/);
  if (longMatch) {
    return longMatch[1];
  }

  throw new TypeError(`Bad youtube url (${url}).`);
}
