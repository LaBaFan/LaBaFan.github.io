export type NoteLike = {
  id: string;
  data?: {
    title?: string;
    updatedAt?: Date | string;
    slug?: string;
  };
};

export function normalizeSlug(value: string): string {
  return value
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\.md$/i, '')
    .replace(/\/index$/i, '')
    .replace(/\/{2,}/g, '/');
}

export function noteHref(value: string): string {
  const slug = normalizeSlug(value);
  return slug ? `/notes/${slug}/` : '/notes/';
}

export function getCanonicalSlug(note: Pick<NoteLike, 'id' | 'data'>): string {
  return typeof note.data?.slug === 'string' ? note.data.slug : normalizeSlug(note.id);
}

export function getNoteTitle(note: Pick<NoteLike, 'id' | 'data'>): string {
  const title = note.data?.title?.trim();
  if (title) return title;

  const slug = normalizeSlug(note.id);
  return slug.split('/').at(-1) || '笔记';
}

function updatedAtTimestamp(note: NoteLike): number {
  const value = note.data?.updatedAt;
  if (!value) return 0;
  const timestamp = value instanceof Date ? value.getTime() : Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function sortNotesByUpdatedAt<T extends NoteLike>(notes: readonly T[]): T[] {
  return [...notes].sort((left, right) => {
    const byDate = updatedAtTimestamp(right) - updatedAtTimestamp(left);
    return byDate || left.id.localeCompare(right.id, 'zh-CN');
  });
}

export function getAdjacentNotes<T extends NoteLike>(
  notes: readonly T[],
  currentId: string,
): { previous?: T; next?: T } {
  const currentIndex = notes.findIndex((note) => note.id === currentId);
  if (currentIndex < 0) return {};

  return {
    previous: notes[currentIndex - 1],
    next: notes[currentIndex + 1],
  };
}
