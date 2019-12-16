export function getId(idOrUrl: string): string {
  const idMatch = idOrUrl.match(/^\w{11}$/);
  if (idMatch) {
    return idOrUrl;
  }

  const shortMatch = idOrUrl.match(/^https:\/\/youtu.be\/(\w{11})/);
  if (shortMatch) {
    return shortMatch[1];
  }

  const longMatch = idOrUrl.match(
    /^https:\/\/www.youtube.com\/watch\?v=(\w{11})/
  );
  if (longMatch) {
    return longMatch[1];
  }

  throw new TypeError(`Bad youtube id or url (${idOrUrl}).`);
}
